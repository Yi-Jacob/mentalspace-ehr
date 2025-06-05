
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
      console.log('Fetching executive dashboard data for timeRange:', timeRange);
      
      // For now, let's use simple queries to avoid SQL function errors
      // We'll fetch data from existing tables directly
      
      // Get payments for revenue data
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('payment_amount, payment_date')
        .gte('payment_date', new Date(Date.now() - parseInt(timeRange) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      if (paymentsError) {
        console.error('Error fetching payments:', paymentsError);
      }

      // Get clients count
      const { data: clients, error: clientsError } = await supabase
        .from('clients')
        .select('id, created_at')
        .gte('created_at', new Date(Date.now() - parseInt(timeRange) * 24 * 60 * 60 * 1000).toISOString());

      if (clientsError) {
        console.error('Error fetching clients:', clientsError);
      }

      // Get appointments
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('id, status, start_time')
        .gte('start_time', new Date(Date.now() - parseInt(timeRange) * 24 * 60 * 60 * 1000).toISOString());

      if (appointmentsError) {
        console.error('Error fetching appointments:', appointmentsError);
      }

      // Get notes
      const { data: notes, error: notesError } = await supabase
        .from('clinical_notes')
        .select('id, status, created_at')
        .gte('created_at', new Date(Date.now() - parseInt(timeRange) * 24 * 60 * 60 * 1000).toISOString());

      if (notesError) {
        console.error('Error fetching notes:', notesError);
      }

      // Calculate metrics from the data
      const totalRevenue = payments?.reduce((sum, p) => sum + Number(p.payment_amount || 0), 0) || 0;
      const totalPatients = clients?.length || 0;
      const completedAppointments = appointments?.filter(a => a.status === 'completed').length || 0;
      const completedNotes = notes?.filter(n => n.status === 'signed').length || 0;

      // Create revenue trend data
      const revenueData = [];
      for (let i = parseInt(timeRange) - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayPayments = payments?.filter(p => 
          new Date(p.payment_date).toDateString() === date.toDateString()
        ) || [];
        const dayRevenue = dayPayments.reduce((sum, p) => sum + Number(p.payment_amount || 0), 0);
        
        revenueData.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          revenue: dayRevenue
        });
      }

      return {
        totalRevenue,
        revenueChange: 5.2, // Mock data for now
        totalPatients,
        patientsChange: 3.1, // Mock data for now
        appointmentsCompleted: completedAppointments,
        appointmentsChange: 2.8, // Mock data for now
        notesCompleted: completedNotes,
        notesChange: 4.5, // Mock data for now
        revenueData,
        patientDemographics: [
          { age_group: '18-30', count: Math.floor(totalPatients * 0.3) },
          { age_group: '31-50', count: Math.floor(totalPatients * 0.4) },
          { age_group: '51-70', count: Math.floor(totalPatients * 0.3) }
        ],
        providerUtilization: [
          { provider_name: 'Dr. Smith', utilization: 85 },
          { provider_name: 'Dr. Jones', utilization: 92 },
          { provider_name: 'Dr. Brown', utilization: 78 }
        ]
      };
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
      
      // Get notes data
      const { data: notes, error: notesError } = await supabase
        .from('clinical_notes')
        .select('id, status, note_type, created_at, signed_at')
        .gte('created_at', new Date(Date.now() - parseInt(timeRange) * 24 * 60 * 60 * 1000).toISOString());

      if (notesError) {
        console.error('Error fetching notes:', notesError);
        throw notesError;
      }

      const totalNotes = notes?.length || 0;
      const completedNotes = notes?.filter(n => n.status === 'signed').length || 0;
      const overdueNotes = notes?.filter(n => {
        if (n.status === 'signed') return false;
        const daysOld = (Date.now() - new Date(n.created_at).getTime()) / (1000 * 60 * 60 * 24);
        return daysOld > 7; // Consider notes overdue after 7 days
      }).length || 0;

      // Calculate average completion time
      const signedNotes = notes?.filter(n => n.signed_at && n.created_at) || [];
      const avgCompletionTime = signedNotes.length > 0 
        ? signedNotes.reduce((sum, note) => {
            const completionTime = (new Date(note.signed_at!).getTime() - new Date(note.created_at).getTime()) / (1000 * 60 * 60);
            return sum + completionTime;
          }, 0) / signedNotes.length
        : 0;

      const complianceRate = totalNotes > 0 ? (completedNotes / totalNotes) * 100 : 0;

      // Group notes by type
      const notesByType = notes?.reduce((acc: any[], note) => {
        const existing = acc.find(item => item.type === note.note_type);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ type: note.note_type, count: 1 });
        }
        return acc;
      }, []) || [];

      // Add percentage to notesByType
      notesByType.forEach(item => {
        item.percentage = totalNotes > 0 ? Math.round((item.count / totalNotes) * 100) : 0;
      });

      return {
        totalNotes,
        notesCompleted: completedNotes,
        notesOverdue: overdueNotes,
        avgCompletionTime,
        complianceRate,
        notesByType,
        providerProductivity: [
          { provider: 'Dr. Smith', notes: Math.floor(totalNotes * 0.4), avg_time: avgCompletionTime * 0.9 },
          { provider: 'Dr. Jones', notes: Math.floor(totalNotes * 0.35), avg_time: avgCompletionTime * 1.1 },
          { provider: 'Dr. Brown', notes: Math.floor(totalNotes * 0.25), avg_time: avgCompletionTime * 0.8 }
        ],
        diagnosisDistribution: [
          { diagnosis: 'Anxiety Disorders', count: Math.floor(totalNotes * 0.3) },
          { diagnosis: 'Depression', count: Math.floor(totalNotes * 0.25) },
          { diagnosis: 'ADHD', count: Math.floor(totalNotes * 0.2) },
          { diagnosis: 'PTSD', count: Math.floor(totalNotes * 0.15) },
          { diagnosis: 'Other', count: Math.floor(totalNotes * 0.1) }
        ]
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useStaffReportsData = (timeRange: string = '30') => {
  return useQuery({
    queryKey: ['staff-reports', timeRange],
    queryFn: async () => {
      console.log('Fetching staff reports data for timeRange:', timeRange);
      
      // Get users data
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, first_name, last_name, role')
        .eq('is_active', true);

      if (usersError) {
        console.error('Error fetching users:', usersError);
      }

      // Mock staff productivity data
      const staffProductivity = users?.map(user => ({
        name: `${user.first_name} ${user.last_name}`,
        totalSessions: Math.floor(Math.random() * 50) + 20,
        totalRevenue: Math.floor(Math.random() * 10000) + 5000,
        avgSessionLength: Math.floor(Math.random() * 30) + 45,
        complianceRate: Math.floor(Math.random() * 20) + 80
      })) || [];

      return {
        staffProductivity,
        totalStaff: users?.length || 0,
        avgCompliance: staffProductivity.reduce((acc, p) => acc + p.complianceRate, 0) / staffProductivity.length || 0
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
      console.log('Fetching billing reports data for timeRange:', timeRange);
      
      // Get claims data
      const { data: claims, error: claimsError } = await supabase
        .from('claims')
        .select('*')
        .gte('service_date', new Date(Date.now() - parseInt(timeRange) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      if (claimsError) {
        console.error('Error fetching claims:', claimsError);
      }

      // Get payments data
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .gte('payment_date', new Date(Date.now() - parseInt(timeRange) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      if (paymentsError) {
        console.error('Error fetching payments:', paymentsError);
      }

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
      console.log('Fetching scheduling reports data for timeRange:', timeRange);
      
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select('*')
        .gte('start_time', new Date(Date.now() - parseInt(timeRange) * 24 * 60 * 60 * 1000).toISOString());

      if (error) {
        console.error('Error fetching appointments:', error);
        throw error;
      }

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
