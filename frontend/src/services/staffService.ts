import { apiClient } from '@/services/api-helper/client';
import { StaffMember } from '@/types/staff';
import { UserRole, UserStatus } from '@/types/staff';

// Types for TypeScript - comprehensive staff creation interface
export interface CreateStaffInput {
  // Basic user information
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  suffix?: string;
  avatarUrl?: string;

  // Contact information
  userName?: string;
  mobilePhone?: string;
  workPhone?: string;
  homePhone?: string;
  canReceiveText?: boolean;

  // Address information
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zipCode?: string;

  // Staff profile information
  employeeId?: string;
  jobTitle?: string;
  formalName?: string;
  npiNumber?: string;
  department?: string;
  phoneNumber?: string;
  licenseNumber?: string;
  licenseState?: string;
  licenseExpiryDate?: string;
  hireDate?: string;
  billingRate?: number;
  canBillInsurance?: boolean;
  status?: UserStatus;
  notes?: string;

  // Additional fields
  clinicianType?: string;
  supervisionType?: string;
  supervisorId?: string;

  // Roles
  roles?: UserRole[];

  // User comments
  userComments?: string;
}

export interface UpdateStaffInput {
  email?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  // Add other updateable fields as needed
  employeeId?: string;
  jobTitle?: string;
  department?: string;
  phoneNumber?: string;
  npiNumber?: string;
  licenseNumber?: string;
  licenseState?: string;
  licenseExpiryDate?: string;
  hireDate?: string;
  billingRate?: number;
  canBillInsurance?: boolean;
  status?: UserStatus;
  notes?: string;
  roles?: UserRole[];
}

export interface StaffSearchParams {
  search?: string;
  department?: string;
  status?: string;
  role?: string;
  limit?: number;
  offset?: number;
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

  // Search staff members
  async searchStaff(params: StaffSearchParams): Promise<StaffMember[]> {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
      
      return await apiClient.get<StaffMember[]>(`/staff/search?${queryParams.toString()}`);
    } catch (error) {
      console.error('Error searching staff:', error);
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

  // Activate staff member
  async activateStaff(id: string): Promise<void> {
    try {
      await apiClient.patch(`/staff/${id}/activate`);
    } catch (error) {
      console.error('Error activating staff:', error);
      throw error;
    }
  }

  // Get staff by department
  async getStaffByDepartment(department: string): Promise<StaffMember[]> {
    try {
      return await apiClient.get<StaffMember[]>(`/staff/department/${department}`);
    } catch (error) {
      console.error('Error fetching staff by department:', error);
      throw error;
    }
  }

  // Get staff by role
  async getStaffByRole(role: string): Promise<StaffMember[]> {
    try {
      return await apiClient.get<StaffMember[]>(`/staff/role/${role}`);
    } catch (error) {
      console.error('Error fetching staff by role:', error);
      throw error;
    }
  }

  // Update staff roles
  async updateStaffRoles(id: string, roles: UserRole[]): Promise<StaffMember> {
    try {
      return await apiClient.patch<StaffMember>(`/staff/${id}/roles`, { roles });
    } catch (error) {
      console.error('Error updating staff roles:', error);
      throw error;
    }
  }

  // Get staff statistics
  async getStaffStatistics(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byDepartment: Record<string, number>;
    byRole: Record<string, number>;
  }> {
    try {
      return await apiClient.get('/staff/statistics');
    } catch (error) {
      console.error('Error fetching staff statistics:', error);
      throw error;
    }
  }

  // Bulk operations
  async bulkUpdateStaff(updates: Array<{ id: string; data: UpdateStaffInput }>): Promise<StaffMember[]> {
    try {
      return await apiClient.patch<StaffMember[]>('/staff/bulk', { updates });
    } catch (error) {
      console.error('Error bulk updating staff:', error);
      throw error;
    }
  }

  async bulkDeactivateStaff(ids: string[]): Promise<void> {
    try {
      await apiClient.patch('/staff/bulk/deactivate', { ids });
    } catch (error) {
      console.error('Error bulk deactivating staff:', error);
      throw error;
    }
  }

  // Export staff data
  async exportStaffData(format: 'csv' | 'excel' = 'csv'): Promise<Blob> {
    try {
      const response = await apiClient.get(`/staff/export?format=${format}`, {
        responseType: 'blob',
      });
      return response as Blob;
    } catch (error) {
      console.error('Error exporting staff data:', error);
      throw error;
    }
  }
}

export const staffService = new StaffService(); 