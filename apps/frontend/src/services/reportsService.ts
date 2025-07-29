import { apiClient } from './api-helper/client';

export interface ExecutiveDashboardData {
  totalRevenue: number;
  revenueChange: number;
  totalPatients: number;
  patientsChange: number;
  appointmentsCompleted: number;
  appointmentsChange: number;
  notesCompleted: number;
  notesChange: number;
  revenueData: Array<{ date: string; revenue: number }>;
  patientDemographics: Array<{ age_group: string; count: number }>;
  providerUtilization: Array<{ provider_name: string; utilization: number }>;
}

export interface ClinicalReportsData {
  totalNotes: number;
  notesCompleted: number;
  notesOverdue: number;
  avgCompletionTime: number;
  complianceRate: number;
  notesByType: Array<{ type: string; count: number; percentage: number }>;
  providerProductivity: Array<{ provider: string; notes: number; avg_time: number }>;
  diagnosisDistribution: Array<{ diagnosis: string; count: number }>;
}

export interface StaffReportsData {
  staffProductivity: Array<{
    name: string;
    totalSessions: number;
    totalRevenue: number;
    avgSessionLength: number;
    complianceRate: number;
  }>;
  totalStaff: number;
  avgCompliance: number;
}

export interface BillingReportsData {
  totalClaims: number;
  totalRevenue: number;
  paidClaims: number;
  deniedClaims: number;
  collectionRate: number;
  denialRate: number;
  revenueByMonth: Record<string, number>;
}

export interface SchedulingReportsData {
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  noShowAppointments: number;
  completionRate: number;
  noShowRate: number;
  utilizationByDay: Record<string, number>;
}

class ReportsService {
  // Executive Dashboard
  async getExecutiveDashboard(timeRange: string = '30'): Promise<ExecutiveDashboardData> {
    const response = await apiClient.get<ExecutiveDashboardData>(`/reports/executive-dashboard?timeRange=${timeRange}`);
    return response.data;
  }

  // Clinical Reports
  async getClinicalReports(timeRange: string = '30', providerFilter?: string): Promise<ClinicalReportsData> {
    const params: any = { timeRange };
    if (providerFilter) params.providerFilter = providerFilter;
    
    const response = await apiClient.get<ClinicalReportsData>('/reports/clinical', { params });
    return response.data;
  }

  // Staff Reports
  async getStaffReports(timeRange: string = '30'): Promise<StaffReportsData> {
    const response = await apiClient.get<StaffReportsData>(`/reports/staff?timeRange=${timeRange}`);
    return response.data;
  }

  // Billing Reports
  async getBillingReports(timeRange: string = '30'): Promise<BillingReportsData> {
    const response = await apiClient.get<BillingReportsData>(`/reports/billing?timeRange=${timeRange}`);
    return response.data;
  }

  // Scheduling Reports
  async getSchedulingReports(timeRange: string = '30'): Promise<SchedulingReportsData> {
    const response = await apiClient.get<SchedulingReportsData>(`/reports/scheduling?timeRange=${timeRange}`);
    return response.data;
  }
}

export const reportsService = new ReportsService(); 