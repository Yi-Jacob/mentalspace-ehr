import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';
import { JwtService } from '@nestjs/jwt';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  user?: any;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/messages',
})
export class MessagesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, string>(); // userId -> socketId

  constructor(
    private readonly jwtService: JwtService,
  ) {}

  afterInit(server: Server) {
    console.log('Messages WebSocket Gateway initialized');
  }

  async handleConnection(client: AuthenticatedSocket) {
    try {
      // Extract token from handshake auth
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        client.disconnect();
        return;
      }

      // Verify JWT token
      const payload = this.jwtService.verify(token);
      client.userId = payload.id;
      client.user = payload;

      // Store user connection
      this.connectedUsers.set(payload.id, client.id);

      // Join user to their personal room
      await client.join(`user:${payload.id}`);

      // Emit online status to all connected users
      this.server.emit('user:online', { userId: payload.id, status: 'online' });

      console.log(`User ${payload.id} connected to WebSocket`);
    } catch (error) {
      console.error('WebSocket connection error:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      // Remove user connection
      this.connectedUsers.delete(client.userId);
      
      // Emit offline status
      this.server.emit('user:offline', { userId: client.userId, status: 'offline' });
      
      console.log(`User ${client.userId} disconnected from WebSocket`);
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('join:conversation')
  async handleJoinConversation(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    try {
      // Leave previous conversation rooms
      const rooms = Array.from(client.rooms);
      rooms.forEach(room => {
        if (room.startsWith('conversation:')) {
          client.leave(room);
        }
      });

      // Join new conversation room
      await client.join(`conversation:${data.conversationId}`);
      
      client.emit('conversation:joined', { conversationId: data.conversationId });
      console.log(`User ${client.userId} joined conversation ${data.conversationId}`);
    } catch (error) {
      client.emit('error', { message: 'Failed to join conversation' });
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('leave:conversation')
  async handleLeaveConversation(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    await client.leave(`conversation:${data.conversationId}`);
    client.emit('conversation:left', { conversationId: data.conversationId });
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('typing:start')
  async handleTypingStart(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    // Emit typing indicator to all users in the conversation (except sender)
    client.to(`conversation:${data.conversationId}`).emit('typing:start', {
      conversationId: data.conversationId,
      userId: client.userId,
      user: client.user,
    });
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('typing:stop')
  async handleTypingStop(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    // Emit typing stop indicator
    client.to(`conversation:${data.conversationId}`).emit('typing:stop', {
      conversationId: data.conversationId,
      userId: client.userId,
    });
  }

  // Listen to events from MessagesEventsService
  @OnEvent('message.new')
  handleNewMessage(payload: { conversationId: string; message: any }) {
    this.server.to(`conversation:${payload.conversationId}`).emit('message:new', {
      conversationId: payload.conversationId,
      message: payload.message,
    });
  }

  @OnEvent('conversation.updated')
  handleConversationUpdate(payload: { conversationId: string; update: any }) {
    this.server.to(`conversation:${payload.conversationId}`).emit('conversation:updated', {
      conversationId: payload.conversationId,
      update: payload.update,
    });
  }

  @OnEvent('participant.changed')
  handleParticipantChange(payload: { conversationId: string; change: any }) {
    this.server.to(`conversation:${payload.conversationId}`).emit('participant:changed', {
      conversationId: payload.conversationId,
      change: payload.change,
    });
  }

  // Method to check if user is online
  isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  // Method to get user's socket
  getUserSocket(userId: string): Socket | undefined {
    const socketId = this.connectedUsers.get(userId);
    return socketId ? this.server.sockets.sockets.get(socketId) : undefined;
  }
}
