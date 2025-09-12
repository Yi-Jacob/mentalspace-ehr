import { apiClient } from './api-helper/client';

export type UserType = {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  suffix?: string;
  email: string;
  userName?: string;
  clientId?: string;
  staffId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

class UsersService {
  async getAllUsers(): Promise<UserType[]> {
    try {
      const response = await apiClient.get<UserType[]>('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching staff:', error);
      throw error;
    }
  }

  async setDefaultPassword(userId: string): Promise<any> {
    const response = await apiClient.post(`/users/${userId}/set-default-password`);
    return response.data;
  }

  async deactivateUser(userId: string): Promise<any> {
    const response = await apiClient.post(`/users/${userId}/deactivate`);
    return response.data;
  }

  async activateUser(userId: string): Promise<any> {
    const response = await apiClient.post(`/users/${userId}/activate`);
    return response.data;
  }
}

export const usersService = new UsersService(); 