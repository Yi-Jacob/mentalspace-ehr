import { apiClient } from '@/services/api-helper/client';
import { StaffMember } from '@/types/staff';

// Types for TypeScript - using the existing StaffMember interface
export interface CreateStaffInput {
  email: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
}

export interface UpdateStaffInput {
  email?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}

export class StaffService {
  // Get all staff members
  async getAllStaff(): Promise<StaffMember[]> {
    try {
      return await apiClient.get<StaffMember[]>('/staff');
    } catch (error) {
      console.error('Error fetching staff:', error);
      throw error;
    }
  }

  // Get staff by ID
  async getStaffById(id: string): Promise<StaffMember | null> {
    try {
      return await apiClient.get<StaffMember>(`/staff/${id}`);
    } catch (error) {
      console.error('Error fetching staff by ID:', error);
      throw error;
    }
  }

  // Create new staff member
  async createStaff(input: CreateStaffInput): Promise<StaffMember> {
    try {
      return await apiClient.post<StaffMember>('/staff', input);
    } catch (error) {
      console.error('Error creating staff:', error);
      throw error;
    }
  }

  // Update staff member
  async updateStaff(id: string, input: UpdateStaffInput): Promise<StaffMember> {
    try {
      return await apiClient.put<StaffMember>(`/staff/${id}`, input);
    } catch (error) {
      console.error('Error updating staff:', error);
      throw error;
    }
  }

  // Delete staff member
  async deleteStaff(id: string): Promise<StaffMember> {
    try {
      return await apiClient.delete<StaffMember>(`/staff/${id}`);
    } catch (error) {
      console.error('Error deleting staff:', error);
      throw error;
    }
  }

  // Deactivate staff member
  async deactivateStaff(id: string): Promise<void> {
    try {
      await apiClient.patch(`/staff/${id}/deactivate`);
    } catch (error) {
      console.error('Error deactivating staff:', error);
      throw error;
    }
  }
}

export const staffService = new StaffService(); 