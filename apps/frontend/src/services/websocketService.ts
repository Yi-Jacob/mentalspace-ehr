import { io, Socket } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';

interface WebSocketMessage {
  conversationId: string;
  message: any;
}

class WebSocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private messageHandlers: ((data: WebSocketMessage) => void)[] = [];

  connect(token: string) {
    if (this.socket?.connected) {
      return;
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    
    try {
      this.socket = io(`${backendUrl}/messages`, {
        auth: { token },
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true,
      });

      this.setupEventListeners();
    } catch (error) {
      this.handleError(error);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;
    
    this.socket.on('connect', () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      this.attemptReconnect();
    });

    this.socket.on('connect_error', (error) => {
      this.handleError(error);
    });

    this.socket.on('message:new', (data: WebSocketMessage) => {
      this.messageHandlers.forEach(handler => handler(data));
    });
  }

  private handleError(error: any) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.attemptReconnect();
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      return;
    }

    this.reconnectAttempts++;
    
    setTimeout(() => {
      if (this.socket) {
        this.socket.connect();
      }
    }, 1000 * this.reconnectAttempts);
  }

  // Register/unregister message handlers
  onNewMessage(handler: (data: WebSocketMessage) => void) {
    this.messageHandlers.push(handler);
  }

  offNewMessage(handler: (data: WebSocketMessage) => void) {
    const index = this.messageHandlers.indexOf(handler);
    if (index > -1) {
      this.messageHandlers.splice(index, 1);
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      socketId: this.socket?.id,
    };
  }
}

// Singleton instance
export const webSocketService = new WebSocketService();

// React hook for using WebSocket service
export const useWebSocket = () => {
  const { user, loading } = useAuth();

  const connect = () => {
    // Wait for auth to be fully loaded
    if (loading) {
      return;
    }

    // Get token from localStorage
    const token = localStorage.getItem('access_token');
    
    if (token && user) {
      webSocketService.connect(token);
    } else {
      console.log('🟠 useWebSocket: No token or user available');
    }
  };

  const disconnect = () => {
    webSocketService.disconnect();
  };

  return {
    connect,
    disconnect,
    webSocketService,
    isAuthReady: !loading && !!user,
  };
};
