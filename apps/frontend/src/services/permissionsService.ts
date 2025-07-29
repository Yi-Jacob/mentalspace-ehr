import { apiClient } from './api-helper/client';

export interface Permission {
  category: string;
  action: string;
  scope: string;
}

// Permissions Service
export class PermissionsService {
  private baseUrl = '/permissions';

  // Get current user's permissions
  async getUserPermissions(): Promise<Permission[]> {
    const response = await apiClient.get<Permission[]>(`${this.baseUrl}/user`);
    return response.data;
  }

  // Check if user can access a specific patient
  async canAccessPatient(clientId: string, accessType: string = 'read'): Promise<boolean> {
    const response = await apiClient.get<{ canAccess: boolean }>(`${this.baseUrl}/patient/${clientId}/access`, {
      params: { accessType }
    });
    return response.data.canAccess;
  }
}

export const permissionsService = new PermissionsService(); 