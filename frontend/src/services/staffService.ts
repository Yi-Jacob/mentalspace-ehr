import { apiClient } from './api-helper/client';

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