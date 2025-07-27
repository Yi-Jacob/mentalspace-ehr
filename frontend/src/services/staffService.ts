import { apiClient } from './api-helper/client';
import { UserStatus, StaffMember } from '@/types/staff';

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

export interface UserRole {
  role: string;
  assignedAt: string;
  assignedBy?: string;
}

export interface PerformanceMetric {
  id: string;
  user_id: string;
  metric_type: string;
  metric_value: number;
  target_value?: number;
  measurement_period: string;
  period_start: string;
  period_end: string;
  notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  user?: {
    firstName: string;
    lastName: string;
  };
  reviewer?: {
    firstName: string;
    lastName: string;
  };
}

class StaffService {
  async createStaff(input: CreateStaffInput): Promise<any> {
    try {
      await apiClient.post<StaffMember>('/staff', input);
    } catch (error) {
      console.error('Error creating staff:', error);
      throw error;
    }
  }

  async getAllStaff(): Promise<StaffMember[]> {
    try {
      const response = await apiClient.get<StaffMember[]>('/staff');
      console.log('getAllStaff - response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching staff:', error);
      throw error;
    }
  }
  
  // User Roles
  async getCurrentUserRoles(): Promise<UserRole[]> {
    const response = await apiClient.get<UserRole[]>('/staff/roles/current');
    return response.data;
  }

  async assignRole(userId: string, role: string): Promise<any> {
    const response = await apiClient.post('/staff/roles/assign', {
      userId,
      role,
    });
    return response.data;
  }

  async removeRole(userId: string, role: string): Promise<any> {
    const response = await apiClient.post('/staff/roles/remove', {
      userId,
      role,
    });
    return response.data;
  }

  // Performance Metrics
  async getPerformanceMetrics(userId?: string): Promise<PerformanceMetric[]> {
    const params = userId ? { userId } : {};
    const response = await apiClient.get<PerformanceMetric[]>('/staff/performance-metrics', { params });
    return response.data;
  }

  async createPerformanceMetric(metric: Omit<PerformanceMetric, 'id' | 'created_at'>): Promise<PerformanceMetric> {
    const response = await apiClient.post<PerformanceMetric>('/staff/performance-metrics', metric);
    return response.data;
  }

  async updatePerformanceMetric(id: string, updates: Partial<PerformanceMetric>): Promise<PerformanceMetric> {
    const response = await apiClient.put<PerformanceMetric>(`/staff/performance-metrics/${id}`, updates);
    return response.data;
  }
}

export const staffService = new StaffService(); 