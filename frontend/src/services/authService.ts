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

export interface ValidateTokenResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
  };
}

class AuthService {
  private readonly USER_KEY = 'auth_user';

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  }

  async validateToken(token: string): Promise<ValidateTokenResponse> {
    const response = await apiClient.post<ValidateTokenResponse>('/auth/validate', { token });
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
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }
  

}



export const authService = new AuthService(); 