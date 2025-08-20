import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
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
      
      // JWT payload structure: { sub: userId, email: string, roles: string[], iat: number, exp: number }
      client.userId = payload.sub; // Use 'sub' field for userId
      client.user = payload;


    } catch (error) {
      console.error('🟢 WebSocket connection error:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
    }
  }

  // Listen to events from MessagesEventsService - ONLY for new messages
  @OnEvent('message.new')
  handleNewMessage(payload: { conversationId: string; message: any }) {
    // Broadcast new message to all connected clients
    this.server.emit('message:new', {
      conversationId: payload.conversationId,
      message: payload.message,
    });
  
  }
}
