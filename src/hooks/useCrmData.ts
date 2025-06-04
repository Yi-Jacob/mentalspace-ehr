
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Types for CRM data
export interface ReferralSource {
  id: string;
  name: string;
  organization?: string;
  type: string;
  specialty?: string;
  email?: string;
  phone?: string;
  address?: string;
  relationship_strength: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  source?: string;
  referral_source_id?: string;
  status: string;
  priority: string;
  concerns?: string;
  preferred_contact: string;
  insurance?: string;
  date_received: string;
  last_contact_date?: string;
  next_followup_date?: string;
  assigned_to?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CrmContact {
  id: string;
  name: string;
  organization?: string;
  position?: string;
  category: string;
  email?: string;
  phone?: string;
  address?: string;
  specialty?: string;
  relationship_type: string;
  tags?: string[];
  notes?: string;
  last_contact_date?: string;
  added_date: string;
  created_at: string;
  updated_at: string;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  type: string;
  status: string;
  audience?: string;
  description?: string;
  send_date?: string;
  last_sent_date?: string;
  next_send_date?: string;
  recipient_count: number;
  open_rate?: number;
  click_rate?: number;
  created_at: string;
  updated_at: string;
}

// Referral Sources hooks
export const useReferralSources = () => {
  return useQuery({
    queryKey: ['referral-sources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('referral_sources')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ReferralSource[];
    }
  });
};

export const useCreateReferralSource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<ReferralSource>) => {
      const { data: result, error } = await supabase
        .from('referral_sources')
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referral-sources'] });
    }
  });
};

// Leads hooks
export const useLeads = () => {
  return useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          referral_sources:referral_source_id(name),
          users:assigned_to(first_name, last_name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Lead[];
    }
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<Lead>) => {
      const { data: result, error } = await supabase
        .from('leads')
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    }
  });
};

// CRM Contacts hooks
export const useCrmContacts = () => {
  return useQuery({
    queryKey: ['crm-contacts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crm_contacts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as CrmContact[];
    }
  });
};

export const useCreateCrmContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<CrmContact>) => {
      const { data: result, error } = await supabase
        .from('crm_contacts')
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-contacts'] });
    }
  });
};

// Marketing Campaigns hooks
export const useMarketingCampaigns = () => {
  return useQuery({
    queryKey: ['marketing-campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as MarketingCampaign[];
    }
  });
};

export const useCreateMarketingCampaign = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<MarketingCampaign>) => {
      const { data: result, error } = await supabase
        .from('marketing_campaigns')
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing-campaigns'] });
    }
  });
};

// CRM Analytics hook
export const useCrmAnalytics = () => {
  return useQuery({
    queryKey: ['crm-analytics'],
    queryFn: async () => {
      // Get referral sources count
      const { count: referralSourcesCount } = await supabase
        .from('referral_sources')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Active');

      // Get new leads this month
      const firstDayOfMonth = new Date();
      firstDayOfMonth.setDate(1);
      const { count: newLeadsCount } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .gte('date_received', firstDayOfMonth.toISOString().split('T')[0]);

      // Get conversion rate (leads converted to clients)
      const { count: totalLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true });

      const { count: convertedLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Converted');

      const conversionRate = totalLeads ? Math.round((convertedLeads / totalLeads) * 100) : 0;

      return {
        activeReferralSources: referralSourcesCount || 0,
        newLeadsThisMonth: newLeadsCount || 0,
        conversionRate: conversionRate,
        estimatedRevenue: 12450 // This would need actual revenue tracking
      };
    }
  });
};
