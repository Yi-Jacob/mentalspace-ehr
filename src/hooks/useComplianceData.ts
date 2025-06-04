
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCompensationConfigs = (providerId?: string) => {
  return useQuery({
    queryKey: ['compensation-configs', providerId],
    queryFn: async () => {
      let query = supabase
        .from('provider_compensation_config')
        .select(`
          *,
          provider:users!provider_compensation_config_provider_id_fkey(first_name, last_name),
          created_by_user:users!provider_compensation_config_created_by_fkey(first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (providerId) {
        query = query.eq('provider_id', providerId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};

export const useSessionCompletions = (filters?: {
  providerId?: string;
  status?: 'signed' | 'unsigned' | 'locked';
  dateRange?: { start: string; end: string };
}) => {
  return useQuery({
    queryKey: ['session-completions', filters],
    queryFn: async () => {
      let query = supabase
        .from('session_completions')
        .select(`
          *,
          provider:users!session_completions_provider_id_fkey(first_name, last_name),
          client:clients(first_name, last_name),
          note:clinical_notes(id, status)
        `)
        .order('session_date', { ascending: false });

      if (filters?.providerId) {
        query = query.eq('provider_id', filters.providerId);
      }

      if (filters?.status === 'signed') {
        query = query.eq('is_note_signed', true);
      } else if (filters?.status === 'unsigned') {
        query = query.eq('is_note_signed', false).eq('is_locked', false);
      } else if (filters?.status === 'locked') {
        query = query.eq('is_locked', true);
      }

      if (filters?.dateRange) {
        query = query.gte('session_date', filters.dateRange.start)
                    .lte('session_date', filters.dateRange.end);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};

export const useTimeEntries = (filters?: {
  userId?: string;
  dateRange?: { start: string; end: string };
  status?: 'approved' | 'pending';
}) => {
  return useQuery({
    queryKey: ['time-entries', filters],
    queryFn: async () => {
      let query = supabase
        .from('time_entries')
        .select(`
          *,
          user:users!time_entries_user_id_fkey(first_name, last_name),
          approved_by_user:users!time_entries_approved_by_fkey(first_name, last_name)
        `)
        .order('entry_date', { ascending: false });

      if (filters?.userId) {
        query = query.eq('user_id', filters.userId);
      }

      if (filters?.status === 'approved') {
        query = query.eq('is_approved', true);
      } else if (filters?.status === 'pending') {
        query = query.eq('is_approved', false);
      }

      if (filters?.dateRange) {
        query = query.gte('entry_date', filters.dateRange.start)
                    .lte('entry_date', filters.dateRange.end);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};

export const usePaymentCalculations = (filters?: {
  userId?: string;
  status?: 'pending' | 'completed' | 'cancelled';
  dateRange?: { start: string; end: string };
}) => {
  return useQuery({
    queryKey: ['payment-calculations', filters],
    queryFn: async () => {
      let query = supabase
        .from('payment_calculations')
        .select(`
          *,
          user:users!payment_calculations_user_id_fkey(first_name, last_name),
          processed_by_user:users!payment_calculations_processed_by_fkey(first_name, last_name)
        `)
        .order('pay_period_start', { ascending: false });

      if (filters?.userId) {
        query = query.eq('user_id', filters.userId);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.dateRange) {
        query = query.gte('pay_period_start', filters.dateRange.start)
                    .lte('pay_period_end', filters.dateRange.end);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};

export const useComplianceDeadlines = (filters?: {
  providerId?: string;
  status?: 'pending' | 'met' | 'overdue';
}) => {
  return useQuery({
    queryKey: ['compliance-deadlines', filters],
    queryFn: async () => {
      let query = supabase
        .from('compliance_deadlines')
        .select(`
          *,
          provider:users!compliance_deadlines_provider_id_fkey(first_name, last_name)
        `)
        .order('deadline_date', { ascending: true });

      if (filters?.providerId) {
        query = query.eq('provider_id', filters.providerId);
      }

      const now = new Date();
      
      if (filters?.status === 'pending') {
        query = query.eq('is_met', false).gte('deadline_date', now.toISOString());
      } else if (filters?.status === 'met') {
        query = query.eq('is_met', true);
      } else if (filters?.status === 'overdue') {
        query = query.eq('is_met', false).lt('deadline_date', now.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};
