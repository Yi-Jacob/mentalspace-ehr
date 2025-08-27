import { apiClient } from './api-helper/client';

export interface PaymentCalculation {
  id: string;
  userId: string;
  status: 'pending' | 'completed' | 'cancelled';
  compensationType: 'session_based' | 'hourly';
  payPeriodStart: string;
  payPeriodEnd: string;
  totalSessions?: number;
  totalHours?: number;
  grossAmount: number;
  deductions: number;
  netAmount: number;
  regularHours?: number;
  overtimeHours?: number;
  calculationDetails?: any;
  processedAt?: string;
  processedBy?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    firstName: string;
    lastName: string;
  };
  processedByUser?: {
    firstName: string;
    lastName: string;
  };
}

export interface ComplianceReport {
  totalPayroll: number;
  totalSessions: number;
  signedSessions: number;
  complianceRate: number;
  payrollTrend: Array<{
    date: string;
    amount: number;
    count: number;
  }>;
  providerPerformance: Array<{
    name: string;
    totalSessions: number;
    signedSessions: number;
    earnings: number;
    complianceRate: number;
  }>;
  paymentData: any[];
  sessionData: any[];
  timeData: any[];
  complianceData: any[];
}

export interface ComplianceMetrics {
  completion_rate: number;
  overdue_rate: number;
  avg_completion_time: number;
}

export interface ProviderCompensationConfig {
  id: string;
  providerId: string;
  compensationType: 'session_based' | 'hourly' | 'hybrid';
  baseSessionRate?: number;
  baseHourlyRate?: number;
  experienceTier?: number;
  isOvertimeEligible?: boolean;
  eveningDifferential?: number;
  weekendDifferential?: number;
  effectiveDate: string;
  expirationDate?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  provider?: {
    id: string;
    user?: {
      firstName: string;
      lastName: string;
    };
  };
}

// Compliance Service
export class ComplianceService {
  private baseUrl = '/compliance';

  // Get all time entries
  async getAll(date?: string, userId?: string): Promise<any[]> {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (userId) params.append('userId', userId);
    
    const url = `${this.baseUrl}/time-tracking${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiClient.get<any[]>(url);
    return response.data;
  }

  // Create new time entry
  async create(data: any): Promise<any> {
    const response = await apiClient.post(`${this.baseUrl}/time-tracking`, data);
    return response.data;
  }

  // Clock in functionality
  async clockIn(userId: string): Promise<any> {
    const response = await apiClient.post(`${this.baseUrl}/time-tracking/clock-in`, { userId });
    return response.data;
  }

  // Clock out functionality
  async clockOut(entryId: string): Promise<any> {
    const response = await apiClient.post(`${this.baseUrl}/time-tracking/${entryId}/clock-out`);
    return response.data;
  }

  // Get active time entry for user
  async getActiveTimeEntry(userId: string): Promise<any> {
    const response = await apiClient.get(`${this.baseUrl}/time-tracking/active/${userId}`);
    return response.data;
  }

  // Approve time entry
  async approveTimeEntry(entryId: string, approvedBy: string): Promise<any> {
    const response = await apiClient.post(`${this.baseUrl}/time-tracking/${entryId}/approve`, { approvedBy });
    return response.data;
  }

  // Ask for update on time entry
  async askForUpdateTimeEntry(entryId: string, requestedBy: string, updateNotes?: string): Promise<any> {
    const response = await apiClient.post(`${this.baseUrl}/time-tracking/${entryId}/ask-for-update`, { 
      requestedBy, 
      updateNotes 
    });
    return response.data;
  }

  // Get session multipliers
  async getSessionMultipliers(providerId?: string): Promise<any[]> {
    const params = new URLSearchParams();
    if (providerId) params.append('providerId', providerId);
    
    const url = `${this.baseUrl}/session-multipliers${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiClient.get<any[]>(url);
    return response.data;
  }

  // Get payment calculations with filters
  async getPaymentCalculations(status?: string, period?: string): Promise<PaymentCalculation[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (period) params.append('period', period);
    
    const url = `${this.baseUrl}/payment-calculations${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiClient.get<PaymentCalculation[]>(url);
    return response.data;
  }

  // Get compliance reports
  async getComplianceReports(timeRange: number = 30, reportType: string = 'overview'): Promise<ComplianceReport> {
    const params = new URLSearchParams({
      timeRange: timeRange.toString(),
      reportType
    });
    
    const response = await apiClient.get<ComplianceReport>(`${this.baseUrl}/reports?${params.toString()}`);
    return response.data;
  }

  // Get compliance dashboard
  async getComplianceDashboard(): Promise<any> {
    const response = await apiClient.get(`${this.baseUrl}/dashboard`);
    return response.data;
  }

  // Get compliance overview
  async getComplianceOverview(): Promise<any> {
    const response = await apiClient.get(`${this.baseUrl}/overview`);
    return response.data;
  }

  // Get compliance metrics for current user
  async getComplianceMetrics(): Promise<ComplianceMetrics> {
    const response = await apiClient.get<ComplianceMetrics>(`${this.baseUrl}/metrics`);
    return response.data;
  }

  // Provider Compensation Methods
  async getProviderCompensations(status?: string, providerId?: string): Promise<ProviderCompensationConfig[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (providerId) params.append('providerId', providerId);
    
    const url = `${this.baseUrl}/provider-compensation${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiClient.get<ProviderCompensationConfig[]>(url);
    return response.data;
  }

  async getProviderCompensationById(id: string): Promise<ProviderCompensationConfig> {
    const response = await apiClient.get<ProviderCompensationConfig>(`${this.baseUrl}/provider-compensation/${id}`);
    return response.data;
  }

  async createProviderCompensation(data: Partial<ProviderCompensationConfig>): Promise<ProviderCompensationConfig> {
    const response = await apiClient.post<ProviderCompensationConfig>(`${this.baseUrl}/provider-compensation`, data);
    return response.data;
  }

  async updateProviderCompensation(id: string, data: Partial<ProviderCompensationConfig>): Promise<ProviderCompensationConfig> {
    const response = await apiClient.put<ProviderCompensationConfig>(`${this.baseUrl}/provider-compensation/${id}`, data);
    return response.data;
  }

  async deleteProviderCompensation(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/provider-compensation/${id}`);
  }

  async approveProviderCompensation(id: string, reviewedBy: string, reviewNotes?: string): Promise<ProviderCompensationConfig> {
    const response = await apiClient.post<ProviderCompensationConfig>(`${this.baseUrl}/provider-compensation/${id}/approve`, {
      reviewedBy,
      reviewNotes
    });
    return response.data;
  }

  async rejectProviderCompensation(id: string, reviewedBy: string, reviewNotes?: string): Promise<ProviderCompensationConfig> {
    const response = await apiClient.post<ProviderCompensationConfig>(`${this.baseUrl}/provider-compensation/${id}/reject`, {
      reviewedBy,
      reviewNotes
    });
    return response.data;
  }
}

export const complianceService = new ComplianceService(); 