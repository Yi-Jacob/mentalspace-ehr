import { useQuery } from '@tanstack/react-query';
import { reportsService } from '@/services/reportsService';
import type { ExecutiveDashboardData, ClinicalReportsData, StaffReportsData, BillingReportsData, SchedulingReportsData } from '@/services/reportsService';

export type { ExecutiveDashboardData, ClinicalReportsData, StaffReportsData, BillingReportsData, SchedulingReportsData };

export const useExecutiveDashboardData = (timeRange: string = '30') => {
  return useQuery({
    queryKey: ['executive-dashboard', timeRange],
    queryFn: async (): Promise<ExecutiveDashboardData> => {
      console.log('Fetching executive dashboard data for timeRange:', timeRange);
      return await reportsService.getExecutiveDashboard(timeRange);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useClinicalReportsData = (timeRange: string = '30', providerFilter?: string) => {
  return useQuery({
    queryKey: ['clinical-reports', timeRange, providerFilter],
    queryFn: async (): Promise<ClinicalReportsData> => {
      console.log('Fetching clinical reports data for timeRange:', timeRange);
      return await reportsService.getClinicalReports(timeRange, providerFilter);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useStaffReportsData = (timeRange: string = '30') => {
  return useQuery({
    queryKey: ['staff-reports', timeRange],
    queryFn: async (): Promise<StaffReportsData> => {
      console.log('Fetching staff reports data for timeRange:', timeRange);
      return await reportsService.getStaffReports(timeRange);
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useBillingReportsData = (timeRange: string = '30') => {
  return useQuery({
    queryKey: ['billing-reports', timeRange],
    queryFn: async (): Promise<BillingReportsData> => {
      console.log('Fetching billing reports data for timeRange:', timeRange);
      return await reportsService.getBillingReports(timeRange);
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useSchedulingReportsData = (timeRange: string = '30') => {
  return useQuery({
    queryKey: ['scheduling-reports', timeRange],
    queryFn: async (): Promise<SchedulingReportsData> => {
      console.log('Fetching scheduling reports data for timeRange:', timeRange);
      return await reportsService.getSchedulingReports(timeRange);
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
