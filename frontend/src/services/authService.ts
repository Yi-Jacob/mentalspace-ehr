import { apiClient } from './api-helper/client';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  // Store token in localStorage
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Get token from localStorage
  private getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Remove token from localStorage
  private removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // Store user in localStorage
  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // Get user from localStorage
  private getUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Remove user from localStorage
  private removeUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  // Set auth headers for API requests
  setAuthHeaders(): void {
    const token = this.getToken();
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete apiClient.defaults.headers.common['Authorization'];
    }
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      const { access_token, user } = response.data;
      
      this.setToken(access_token);
      this.setUser(user);
      this.setAuthHeaders();
      
      return response.data;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Register user
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', data);
      const { access_token, user } = response.data;
      
      this.setToken(access_token);
      this.setUser(user);
      this.setAuthHeaders();
      
      return response.data;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Logout user
  async logout(): Promise<void> {
    this.removeToken();
    this.removeUser();
    this.setAuthHeaders();
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.getUser();
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }

  // Validate token with backend
  async validateToken(): Promise<User | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await apiClient.post('/auth/validate', { token });
      const user = response.data.user;
      this.setUser(user);
      return user;
    } catch (error) {
      // Token is invalid, clear auth state
      this.logout();
      return null;
    }
  }

  // Refresh token (if needed in the future)
  async refreshToken(): Promise<void> {
    // This could be implemented if we add refresh tokens
    // For now, we'll just validate the current token
    await this.validateToken();
  }

  // Handle authentication errors
  private handleAuthError(error: any): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    if (error.response?.status === 401) {
      return new Error('Invalid credentials');
    }
    if (error.response?.status === 409) {
      return new Error('User already exists');
    }
    return new Error('Authentication failed');
  }

  // Initialize auth state
  async initializeAuth(): Promise<User | null> {
    if (this.isAuthenticated()) {
      this.setAuthHeaders();
      return await this.validateToken();
    }
    return null;
  }
}

export const authService = new AuthService(); 