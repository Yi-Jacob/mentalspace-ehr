import { io, Socket } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';

export interface WebSocketMessage {
  conversationId: string;
  message: any;
}

export interface WebSocketConversationUpdate {
  conversationId: string;
  update: any;
}

export interface WebSocketParticipantChange {
  conversationId: string;
  change: any;
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  user: any;
}

class WebSocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  // Event handlers
  private messageHandlers: ((data: WebSocketMessage) => void)[] = [];
  private conversationUpdateHandlers: ((data: WebSocketConversationUpdate) => void)[] = [];
  private participantChangeHandlers: ((data: WebSocketParticipantChange) => void)[] = [];
  private typingStartHandlers: ((data: TypingIndicator) => void)[] = [];
  private typingStopHandlers: ((data: { conversationId: string; userId: string }) => void)[] = [];
  private userOnlineHandlers: ((data: { userId: string; status: string }) => void)[] = [];
  private userOfflineHandlers: ((data: { userId: string; status: string }) => void)[] = [];
  private errorHandlers: ((error: any) => void)[] = [];

  connect(token: string) {
    if (this.socket && this.isConnected) {
      return;
    }

    try {
      this.socket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001/messages', {
        auth: { token },
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true,
      });

      this.setupEventListeners();
      this.setupConnectionHandlers();
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      this.handleError(error);
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      this.isConnected = false;
      this.attemptReconnect();
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.handleError(error);
    });

    // Message events
    this.socket.on('message:new', (data: WebSocketMessage) => {
      this.messageHandlers.forEach(handler => handler(data));
    });

    this.socket.on('conversation:updated', (data: WebSocketConversationUpdate) => {
      this.conversationUpdateHandlers.forEach(handler => handler(data));
    });

    this.socket.on('participant:changed', (data: WebSocketParticipantChange) => {
      this.participantChangeHandlers.forEach(handler => handler(data));
    });

    // Typing indicators
    this.socket.on('typing:start', (data: TypingIndicator) => {
      this.typingStartHandlers.forEach(handler => handler(data));
    });

    this.socket.on('typing:stop', (data: { conversationId: string; userId: string }) => {
      this.typingStopHandlers.forEach(handler => handler(data));
    });

    // User status
    this.socket.on('user:online', (data: { userId: string; status: string }) => {
      this.userOnlineHandlers.forEach(handler => handler(data));
    });

    this.socket.on('user:offline', (data: { userId: string; status: string }) => {
      this.userOfflineHandlers.forEach(handler => handler(data));
    });

    // Error handling
    this.socket.on('error', (error: any) => {
      this.handleError(error);
    });
  }

  private setupConnectionHandlers() {
    if (!this.socket) return;

    this.socket.on('conversation:joined', (data: { conversationId: string }) => {
      console.log(`Joined conversation: ${data.conversationId}`);
    });

    this.socket.on('conversation:left', (data: { conversationId: string }) => {
      console.log(`Left conversation: ${data.conversationId}`);
    });
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    setTimeout(() => {
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      if (this.socket) {
        this.socket.connect();
      }
    }, delay);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Join/Leave conversation
  joinConversation(conversationId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join:conversation', { conversationId });
    }
  }

  leaveConversation(conversationId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave:conversation', { conversationId });
    }
  }

  // Typing indicators
  startTyping(conversationId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing:start', { conversationId });
    }
  }

  stopTyping(conversationId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing:stop', { conversationId });
    }
  }

  // Event handlers registration
  onNewMessage(handler: (data: WebSocketMessage) => void) {
    this.messageHandlers.push(handler);
  }

  onConversationUpdate(handler: (data: WebSocketConversationUpdate) => void) {
    this.conversationUpdateHandlers.push(handler);
  }

  onParticipantChange(handler: (data: WebSocketParticipantChange) => void) {
    this.participantChangeHandlers.push(handler);
  }

  onTypingStart(handler: (data: TypingIndicator) => void) {
    this.typingStartHandlers.push(handler);
  }

  onTypingStop(handler: (data: { conversationId: string; userId: string }) => void) {
    this.typingStopHandlers.push(handler);
  }

  onUserOnline(handler: (data: { userId: string; status: string }) => void) {
    this.userOnlineHandlers.push(handler);
  }

  onUserOffline(handler: (data: { userId: string; status: string }) => void) {
    this.userOfflineHandlers.push(handler);
  }

  onError(handler: (error: any) => void) {
    this.errorHandlers.push(handler);
  }

  // Remove event handlers
  offNewMessage(handler: (data: WebSocketMessage) => void) {
    const index = this.messageHandlers.indexOf(handler);
    if (index > -1) {
      this.messageHandlers.splice(index, 1);
    }
  }

  offConversationUpdate(handler: (data: WebSocketConversationUpdate) => void) {
    const index = this.conversationUpdateHandlers.indexOf(handler);
    if (index > -1) {
      this.conversationUpdateHandlers.splice(index, 1);
    }
  }

  offParticipantChange(handler: (data: WebSocketParticipantChange) => void) {
    const index = this.participantChangeHandlers.indexOf(handler);
    if (index > -1) {
      this.participantChangeHandlers.splice(index, 1);
    }
  }

  offTypingStart(handler: (data: TypingIndicator) => void) {
    const index = this.typingStartHandlers.indexOf(handler);
    if (index > -1) {
      this.typingStartHandlers.splice(index, 1);
    }
  }

  offTypingStop(handler: (data: { conversationId: string; userId: string }) => void) {
    const index = this.typingStopHandlers.indexOf(handler);
    if (index > -1) {
      this.typingStopHandlers.splice(index, 1);
    }
  }

  offUserOnline(handler: (data: { userId: string; status: string }) => void) {
    const index = this.userOnlineHandlers.indexOf(handler);
    if (index > -1) {
      this.userOnlineHandlers.splice(index, 1);
    }
  }

  offUserOffline(handler: (data: { userId: string; status: string }) => void) {
    const index = this.userOfflineHandlers.indexOf(handler);
    if (index > -1) {
      this.userOfflineHandlers.splice(index, 1);
    }
  }

  offError(handler: (error: any) => void) {
    const index = this.errorHandlers.indexOf(handler);
    if (index > -1) {
      this.errorHandlers.splice(index, 1);
    }
  }

  private handleError(error: any) {
    this.errorHandlers.forEach(handler => handler(error));
  }

  // Utility methods
  isConnectedToServer(): boolean {
    return this.isConnected;
  }

  getSocketId(): string | null {
    return this.socket?.id || null;
  }
}

// Create singleton instance
export const webSocketService = new WebSocketService();

// React hook for using WebSocket service
export const useWebSocket = () => {
  const { token } = useAuth();

  const connect = () => {
    if (token) {
      webSocketService.connect(token);
    }
  };

  const disconnect = () => {
    webSocketService.disconnect();
  };

  return {
    connect,
    disconnect,
    webSocketService,
  };
};
