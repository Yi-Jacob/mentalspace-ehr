
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ExecutiveDashboardData {
  totalRevenue: number;
  revenueChange: number;
  totalPatients: number;
  patientsChange: number;
  appointmentsCompleted: number;
  appointmentsChange: number;
  notesCompleted: number;
  notesChange: number;
  revenueData: any[];
  patientDemographics: any[];
  providerUtilization: any[];
}

export interface ClinicalReportsData {
  totalNotes: number;
  notesCompleted: number;
  notesOverdue: number;
  avgCompletionTime: number;
  complianceRate: number;
  notesByType: any[];
  providerProductivity: any[];
  diagnosisDistribution: any[];
}

export const useExecutiveDashboardData = (timeRange: string = '30') => {
  return useQuery({
    queryKey: ['executive-dashboard', timeRange],
    queryFn: async (): Promise<ExecutiveDashboardData> => {
      const startTime = performance.now();
      
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - parseInt(timeRange));

      // Check cache first
      const cacheKey = `executive_dashboard_${timeRange}_${startDate.toISOString().split('T')[0]}`;
      const { data: cachedData } = await supabase.rpc('get_cached_report_data', {
        p_cache_key: cacheKey
      });

      if (cachedData) {
        console.log('Using cached data for executive dashboard');
        return cachedData as ExecutiveDashboardData;
      }

      // Get current user for logging
      const { data: { user } } = await supabase.auth.getUser();
      const { data: currentUser } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user?.id)
        .single();

      // Fetch fresh data from database function
      const { data, error } = await supabase.rpc('get_executive_dashboard_metrics', {
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0]
      });

      if (error) {
        console.error('Error fetching executive dashboard data:', error);
        throw error;
      }

      const result = data[0];
      const dashboardData: ExecutiveDashboardData = {
        totalRevenue: Number(result.total_revenue || 0),
        revenueChange: Number(result.revenue_change || 0),
        totalPatients: Number(result.total_patients || 0),
        patientsChange: Number(result.patients_change || 0),
        appointmentsCompleted: Number(result.appointments_completed || 0),
        appointmentsChange: Number(result.appointments_change || 0),
        notesCompleted: Number(result.notes_completed || 0),
        notesChange: Number(result.notes_change || 0),
        revenueData: result.revenue_trend || [],
        patientDemographics: result.patient_demographics || [],
        providerUtilization: result.provider_utilization || []
      };

      // Cache the result
      await supabase.rpc('cache_report_data', {
        p_cache_key: cacheKey,
        p_report_type: 'executive_dashboard',
        p_data: dashboardData,
        p_ttl_minutes: 60
      });

      // Log usage
      const executionTime = Math.round(performance.now() - startTime);
      if (currentUser) {
        await supabase.rpc('log_report_usage', {
          p_user_id: currentUser.id,
          p_report_type: 'executive_dashboard',
          p_action: 'generated',
          p_filters: { time_range: timeRange },
          p_execution_time_ms: executionTime
        });
      }

      return dashboardData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useClinicalReportsData = (timeRange: string = '30', providerFilter?: string) => {
  return useQuery({
    queryKey: ['clinical-reports', timeRange, providerFilter],
    queryFn: async (): Promise<ClinicalReportsData> => {
      const startTime = performance.now();
      
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - parseInt(timeRange));

      // Check cache first
      const cacheKey = `clinical_reports_${timeRange}_${providerFilter || 'all'}_${startDate.toISOString().split('T')[0]}`;
      const { data: cachedData } = await supabase.rpc('get_cached_report_data', {
        p_cache_key: cacheKey
      });

      if (cachedData) {
        console.log('Using cached data for clinical reports');
        return cachedData as ClinicalReportsData;
      }

      // Get current user for logging
      const { data: { user } } = await supabase.auth.getUser();
      const { data: currentUser } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user?.id)
        .single();

      // Fetch fresh data from database function
      const { data, error } = await supabase.rpc('get_clinical_reports_data', {
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        provider_filter: providerFilter || null
      });

      if (error) {
        console.error('Error fetching clinical reports data:', error);
        throw error;
      }

      const result = data[0];
      const clinicalData: ClinicalReportsData = {
        totalNotes: Number(result.total_notes || 0),
        notesCompleted: Number(result.notes_completed || 0),
        notesOverdue: Number(result.notes_overdue || 0),
        avgCompletionTime: Number(result.avg_completion_time || 0),
        complianceRate: Number(result.compliance_rate || 0),
        notesByType: result.notes_by_type || [],
        providerProductivity: result.provider_productivity || [],
        diagnosisDistribution: result.diagnosis_distribution || []
      };

      // Cache the result
      await supabase.rpc('cache_report_data', {
        p_cache_key: cacheKey,
        p_report_type: 'clinical_reports',
        p_data: clinicalData,
        p_ttl_minutes: 30
      });

      // Log usage
      const executionTime = Math.round(performance.now() - startTime);
      if (currentUser) {
        await supabase.rpc('log_report_usage', {
          p_user_id: currentUser.id,
          p_report_type: 'clinical_reports',
          p_action: 'generated',
          p_filters: { time_range: timeRange, provider_filter: providerFilter },
          p_execution_time_ms: executionTime
        });
      }

      return clinicalData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useStaffReportsData = (timeRange: string = '30') => {
  return useQuery({
    queryKey: ['staff-reports', timeRange],
    queryFn: async () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - parseInt(timeRange));

      // Fetch staff productivity metrics
      const { data: staffMetrics, error: staffError } = await supabase
        .from('session_completions')
        .select(`
          provider_id,
          calculated_amount,
          duration_minutes,
          is_note_signed,
          session_date,
          provider:users!session_completions_provider_id_fkey(first_name, last_name)
        `)
        .gte('session_date', startDate.toISOString().split('T')[0])
        .lte('session_date', endDate.toISOString().split('T')[0]);

      if (staffError) throw staffError;

      // Aggregate by provider
      const providerStats = staffMetrics?.reduce((acc: any, session) => {
        const providerId = session.provider_id;
        const providerName = `${session.provider?.first_name} ${session.provider?.last_name}`;
        
        if (!acc[providerId]) {
          acc[providerId] = {
            name: providerName,
            totalSessions: 0,
            totalRevenue: 0,
            avgSessionLength: 0,
            complianceRate: 0,
            signedNotes: 0
          };
        }
        
        acc[providerId].totalSessions += 1;
        acc[providerId].totalRevenue += Number(session.calculated_amount || 0);
        acc[providerId].avgSessionLength += session.duration_minutes;
        if (session.is_note_signed) {
          acc[providerId].signedNotes += 1;
        }
        
        return acc;
      }, {});

      // Calculate averages and compliance
      const staffData = Object.values(providerStats || {}).map((provider: any) => ({
        ...provider,
        avgSessionLength: Math.round(provider.avgSessionLength / provider.totalSessions),
        complianceRate: Math.round((provider.signedNotes / provider.totalSessions) * 100)
      }));

      return {
        staffProductivity: staffData,
        totalStaff: staffData.length,
        avgCompliance: staffData.reduce((acc, p: any) => acc + p.complianceRate, 0) / staffData.length || 0
      };
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useBillingReportsData = (timeRange: string = '30') => {
  return useQuery({
    queryKey: ['billing-reports', timeRange],
    queryFn: async () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - parseInt(timeRange));

      // Fetch claims data
      const { data: claims, error: claimsError } = await supabase
        .from('claims')
        .select('*')
        .gte('service_date', startDate.toISOString().split('T')[0])
        .lte('service_date', endDate.toISOString().split('T')[0]);

      if (claimsError) throw claimsError;

      // Fetch payments data
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .gte('payment_date', startDate.toISOString().split('T')[0])
        .lte('payment_date', endDate.toISOString().split('T')[0]);

      if (paymentsError) throw paymentsError;

      const totalClaims = claims?.length || 0;
      const totalRevenue = payments?.reduce((sum, p) => sum + Number(p.payment_amount), 0) || 0;
      const paidClaims = claims?.filter(c => c.status === 'paid').length || 0;
      const deniedClaims = claims?.filter(c => c.status === 'denied').length || 0;

      return {
        totalClaims,
        totalRevenue,
        paidClaims,
        deniedClaims,
        collectionRate: totalClaims > 0 ? (paidClaims / totalClaims) * 100 : 0,
        denialRate: totalClaims > 0 ? (deniedClaims / totalClaims) * 100 : 0,
        revenueByMonth: payments?.reduce((acc: any, payment) => {
          const month = new Date(payment.payment_date).toLocaleDateString('en-US', { month: 'short' });
          acc[month] = (acc[month] || 0) + Number(payment.payment_amount);
          return acc;
        }, {}) || {}
      };
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useSchedulingReportsData = (timeRange: string = '30') => {
  return useQuery({
    queryKey: ['scheduling-reports', timeRange],
    queryFn: async () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - parseInt(timeRange));

      const { data: appointments, error } = await supabase
        .from('appointments')
        .select('*')
        .gte('start_time', startDate.toISOString())
        .lte('start_time', endDate.toISOString());

      if (error) throw error;

      const totalAppointments = appointments?.length || 0;
      const completedAppointments = appointments?.filter(a => a.status === 'completed').length || 0;
      const cancelledAppointments = appointments?.filter(a => a.status === 'cancelled').length || 0;
      const noShowAppointments = appointments?.filter(a => a.status === 'no_show').length || 0;

      return {
        totalAppointments,
        completedAppointments,
        cancelledAppointments,
        noShowAppointments,
        completionRate: totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0,
        noShowRate: totalAppointments > 0 ? (noShowAppointments / totalAppointments) * 100 : 0,
        utilizationByDay: appointments?.reduce((acc: any, appt) => {
          const day = new Date(appt.start_time).toLocaleDateString('en-US', { weekday: 'short' });
          acc[day] = (acc[day] || 0) + 1;
          return acc;
        }, {}) || {}
      };
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
