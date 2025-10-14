import { io, Socket } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';
import { authService } from './authService';
import { isTokenValid, getTimeUntilExpiry } from '../utils/tokenUtils';

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
  private tokenRefreshTimer: NodeJS.Timeout | null = null;

  // Check if token is valid before connecting
  private isTokenValid(token: string): boolean {
    return isTokenValid(token);
  }

  // Refresh token and reconnect
  private async refreshTokenAndReconnect(): Promise<void> {
    try {
      console.log('🔄 WebSocket: Attempting to refresh token...');
      const user = await authService.validateToken();
      if (user) {
        const newToken = authService.getToken();
        if (newToken && this.isTokenValid(newToken)) {
          console.log('✅ WebSocket: Token refreshed successfully');
          this.disconnect();
          this.connect(newToken);
          return;
        }
      }
    } catch (error) {
      console.error('❌ WebSocket: Token refresh failed:', error);
    }
    
    // If refresh fails, disconnect and clear connection
    this.disconnect();
    this.clearTokenRefreshTimer();
  }

  // Set up token refresh timer
  private setupTokenRefreshTimer(token: string): void {
    this.clearTokenRefreshTimer();
    
    try {
      const timeUntilExpiry = getTimeUntilExpiry(token);
      
      // Refresh token 2 minutes before expiry
      const refreshTime = Math.max((timeUntilExpiry - 120) * 1000, 60000); // At least 1 minute
      
      console.log(`⏰ WebSocket: Token will refresh in ${Math.floor(refreshTime / 1000)} seconds`);
      
      this.tokenRefreshTimer = setTimeout(() => {
        this.refreshTokenAndReconnect();
      }, refreshTime);
    } catch (error) {
      console.error('❌ WebSocket: Failed to setup token refresh timer:', error);
    }
  }

  // Clear token refresh timer
  private clearTokenRefreshTimer(): void {
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
      this.tokenRefreshTimer = null;
    }
  }

  connect(token: string) {
    if (this.socket?.connected) {
      return;
    }

    // Validate token before connecting
    if (!this.isTokenValid(token)) {
      console.warn('⚠️ WebSocket: Token is invalid or expired, attempting refresh...');
      this.refreshTokenAndReconnect();
      return;
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:7000';
    
    try {
      console.log('🔌 WebSocket: Connecting to messages gateway...');
      this.socket = io(`${backendUrl}/messages`, {
        auth: { token },
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true,
      });

      this.setupEventListeners();
      this.setupTokenRefreshTimer(token);
    } catch (error) {
      this.handleError(error);
    }
  }

  disconnect() {
    if (this.socket) {
      console.log('🔌 WebSocket: Disconnecting...');
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
    this.clearTokenRefreshTimer();
  }

  private setupEventListeners() {
    if (!this.socket) return;
    
    this.socket.on('connect', () => {
      console.log('✅ WebSocket: Connected successfully');
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 WebSocket: Disconnected, reason:', reason);
      this.isConnected = false;
      
      // Don't attempt reconnect if it was due to token expiration
      if (reason !== 'io server disconnect') {
        this.attemptReconnect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ WebSocket: Connection error:', error);
      
      // If it's a JWT error, try to refresh token
      if (error.message?.includes('jwt') || error.message?.includes('TokenExpiredError')) {
        console.log('🔄 WebSocket: JWT error detected, attempting token refresh...');
        this.refreshTokenAndReconnect();
      } else {
        this.handleError(error);
      }
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
      console.log('🟠 useWebSocket: Auth still loading, waiting...');
      return;
    }

    // Check if user is actually authenticated
    if (!user) {
      console.log('🟠 useWebSocket: No authenticated user, skipping WebSocket connection');
      return;
    }

    // Get token from localStorage
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      console.log('🟠 useWebSocket: No access token found');
      return;
    }

    // Validate token before connecting
    if (!isTokenValid(token)) {
      console.log('🟠 useWebSocket: Token is invalid or expired, skipping WebSocket connection');
      return;
    }
    
    console.log('🟢 useWebSocket: Valid token found, connecting to WebSocket...');
    webSocketService.connect(token);
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
