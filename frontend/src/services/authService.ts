import { apiClient } from './api-helper/client';

// Types
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export type UserRole = 'admin' | 'provider' | 'staff' | 'viewer';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refresh_token: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role?: UserRole;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

// Auth Service
export class AuthService {
  private baseUrl = '/auth';

  // Login
  async login(data: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>(`${this.baseUrl}/login`, data);
  }

  // Register
  async register(data: RegisterRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>(`${this.baseUrl}/register`, data);
  }

  // Logout
  async logout(): Promise<void> {
    return apiClient.post(`${this.baseUrl}/logout`, {});
  }

  // Refresh token
  async refreshToken(data: RefreshTokenRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>(`${this.baseUrl}/refresh`, data);
  }

  // Get current user
  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>(`${this.baseUrl}/me`);
  }

  // Update user profile
  async updateProfile(data: Partial<User>): Promise<User> {
    return apiClient.put<User>(`${this.baseUrl}/profile`, data);
  }

  // Change password
  async changePassword(data: ChangePasswordRequest): Promise<void> {
    return apiClient.post(`${this.baseUrl}/change-password`, data);
  }

  // Forgot password
  async forgotPassword(email: string): Promise<void> {
    return apiClient.post(`${this.baseUrl}/forgot-password`, { email });
  }

  // Reset password
  async resetPassword(token: string, new_password: string): Promise<void> {
    return apiClient.post(`${this.baseUrl}/reset-password`, { token, new_password });
  }

  // Verify email
  async verifyEmail(token: string): Promise<void> {
    return apiClient.post(`${this.baseUrl}/verify-email`, { token });
  }

  // Resend verification email
  async resendVerificationEmail(email: string): Promise<void> {
    return apiClient.post(`${this.baseUrl}/resend-verification`, { email });
  }
}

export const authService = new AuthService(); 