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
}

export const complianceService = new ComplianceService(); 