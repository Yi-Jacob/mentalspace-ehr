import { apiClient } from './api-helper/client';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
  };
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface ValidateTokenRequest {
  token: string;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    this.setToken(response.data.access_token);
    this.setUser(response.data.user);
    return response.data;
  }

  async validateToken(): Promise<User> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No token found');
    }
    const response = await apiClient.post<User>('/auth/validate', { token });
    this.setUser(response.data);
    return response.data;
  }

  async resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    const response = await apiClient.post<ResetPasswordResponse>('/auth/reset-password', data);
    return response.data;
  }

  // Store token in localStorage
  setToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  // Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Remove token from localStorage
  removeToken(): void {
    localStorage.removeItem('access_token');
  }

  // Store user in localStorage
  private setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  async logout(): Promise<void> {
    try {
      const token = this.getToken();
      if (token) {
        await apiClient.post('/auth/logout', {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      // Even if backend call fails, we should still clear local storage
      console.warn('Backend logout failed, but clearing local storage:', error);
    } finally {
      // Always clear local storage
      this.removeToken();
      this.removeUser();
    }
  }

  // Get user from localStorage
  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Remove user from localStorage
  private removeUser(): void {
    localStorage.removeItem('user');
  }
}

export const authService = new AuthService(); 