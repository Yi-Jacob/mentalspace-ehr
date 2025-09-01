import { apiClient } from './api-helper/client';

export interface ComplianceDeadline {
  id: string;
  providerId: string;
  deadlineType: string;
  deadlineDate: string;
  isMet: boolean;
  notesPending?: number;
  notesCompleted?: number;
  reminderSent24h?: boolean;
  reminderSent48h?: boolean;
  reminderSent72h?: boolean;
  supervisorNotified?: boolean;
  createdAt: string;
  updatedAt: string;
  provider?: {
    firstName: string;
    lastName: string;
  };
}

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

export interface WeeklyPaymentCalculation {
  payPeriodWeek: string;
  providerId: string;
  providerName: string;
  totalSessions: number;
  totalHours: number;
  totalAmount: number;
  sessions: Array<{
    id: string;
    clientName: string;
    sessionDate: string;
    sessionType: string;
    durationMinutes: number;
    calculatedAmount: number;
    isNoteSigned: boolean;
    noteSignedAt?: string;
  }>;
  compensationConfig?: {
    baseSessionRate?: number;
    baseHourlyRate?: number;
    compensationType: string;
  };
}

export interface PaymentCalculationSummary {
  providerId: string;
  providerName: string;
  payPeriodWeek: string;
  totalSessions: number;
  totalHours: number;
  totalAmount: number;
  status: 'pending' | 'processed' | 'cancelled';
  processedAt?: string;
  processedBy?: string;
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
  async getAll(startDate?: string, endDate?: string, userId?: string): Promise<any[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
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

  // Delete time entry
  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/time-tracking/${id}`);
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

  // Get weekly payment calculation for a specific provider
  async getWeeklyPaymentCalculation(providerId: string, payPeriodWeek?: string): Promise<WeeklyPaymentCalculation> {
    const params = new URLSearchParams();
    if (payPeriodWeek) params.append('payPeriodWeek', payPeriodWeek);
    
    const url = `${this.baseUrl}/payment-calculation/weekly/${providerId}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiClient.get<WeeklyPaymentCalculation>(url);
    return response.data;
  }

  // Get weekly payment calculations for all providers
  async getWeeklyPaymentCalculations(payPeriodWeek?: string): Promise<PaymentCalculationSummary[]> {
    const params = new URLSearchParams();
    if (payPeriodWeek) params.append('payPeriodWeek', payPeriodWeek);
    
    const url = `${this.baseUrl}/payment-calculation/weekly${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiClient.get<PaymentCalculationSummary[]>(url);
    return response.data;
  }

  // Process payment for a provider
  async processPayment(providerId: string, payPeriodWeek?: string): Promise<any> {
    const params = new URLSearchParams();
    if (payPeriodWeek) params.append('payPeriodWeek', payPeriodWeek);
    
    const url = `${this.baseUrl}/payment-calculation/process/${providerId}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiClient.post(url);
    return response.data;
  }

  // Get payment history for a provider
  async getPaymentHistory(providerId: string, startDate?: string, endDate?: string): Promise<PaymentCalculation[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const url = `${this.baseUrl}/payment-calculation/history/${providerId}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiClient.get<PaymentCalculation[]>(url);
    return response.data;
  }

  // Get all payment calculations with filters
  async getAllPaymentCalculations(filters?: {
    status?: string;
    providerId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<PaymentCalculation[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.providerId) params.append('providerId', filters.providerId);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    
    const url = `${this.baseUrl}/payment-calculation/all${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiClient.get<PaymentCalculation[]>(url);
    return response.data;
  }

  // Get payment compliance status for a provider
  async getPaymentComplianceStatus(providerId: string, payPeriodWeek?: string): Promise<any> {
    const params = new URLSearchParams();
    if (payPeriodWeek) params.append('payPeriodWeek', payPeriodWeek);
    
    const url = `${this.baseUrl}/payment-calculation/compliance/${providerId}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiClient.get(url);
    return response.data;
  }

  // Get all compliance deadlines
  async getAllComplianceDeadlines(status?: string, providerId?: string): Promise<ComplianceDeadline[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (providerId) params.append('providerId', providerId);
    
    const url = `${this.baseUrl}/deadlines${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiClient.get<ComplianceDeadline[]>(url);
    return response.data;
  }

  // Mark deadline as met
  async markDeadlineAsMet(deadlineId: string): Promise<ComplianceDeadline> {
    const response = await apiClient.post<ComplianceDeadline>(`${this.baseUrl}/deadlines/${deadlineId}/approve`, {});
    return response.data;
  }

  // Get compliance deadline by ID
  async getComplianceDeadlineById(id: string): Promise<ComplianceDeadline> {
    const response = await apiClient.get<ComplianceDeadline>(`${this.baseUrl}/deadlines/${id}`);
    return response.data;
  }

  // Create compliance deadline
  async createComplianceDeadline(data: Partial<ComplianceDeadline>): Promise<ComplianceDeadline> {
    const response = await apiClient.post<ComplianceDeadline>(`${this.baseUrl}/deadlines`, data);
    return response.data;
  }

  // Update compliance deadline
  async updateComplianceDeadline(id: string, data: Partial<ComplianceDeadline>): Promise<ComplianceDeadline> {
    const response = await apiClient.put<ComplianceDeadline>(`${this.baseUrl}/deadlines/${id}`, data);
    return response.data;
  }

  // Delete compliance deadline
  async deleteComplianceDeadline(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/deadlines/${id}`);
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

  // Get list of staff providers (without payment data)
  async getStaffProviders(): Promise<Array<{ id: string; name: string }>> {
    const response = await apiClient.get<Array<{ id: string; name: string }>>(`${this.baseUrl}/staff-providers`);
    return response.data;
  }
}

export const complianceService = new ComplianceService(); 