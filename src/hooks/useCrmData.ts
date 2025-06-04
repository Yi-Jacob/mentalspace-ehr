
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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

// Mock data for now since database tables aren't in TypeScript types yet
const mockReferralSources: ReferralSource[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    organization: 'Family Medicine Associates',
    type: 'Healthcare Provider',
    specialty: 'Family Medicine',
    email: 's.johnson@fma.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Anytown, ST 12345',
    relationship_strength: 'Strong',
    status: 'Active',
    notes: 'Excellent source for anxiety and depression referrals.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Valley Medical Center',
    organization: 'Valley Medical Center',
    type: 'Hospital',
    specialty: 'Emergency Medicine',
    email: 'referrals@valleymedical.com',
    phone: '(555) 987-6543',
    address: '456 Hospital Ave, Anytown, ST 12345',
    relationship_strength: 'Good',
    status: 'Active',
    notes: 'Refers crisis cases and trauma patients.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '(555) 111-2222',
    source: 'Dr. Sarah Johnson',
    status: 'New',
    priority: 'High',
    concerns: 'Anxiety and panic attacks',
    preferred_contact: 'Phone',
    insurance: 'Blue Cross Blue Shield',
    date_received: '2024-01-15',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Mary Johnson',
    email: 'mary.j@email.com',
    phone: '(555) 333-4444',
    source: 'Website',
    status: 'Contacted',
    priority: 'Medium',
    concerns: 'Depression and stress management',
    preferred_contact: 'Email',
    insurance: 'Aetna',
    date_received: '2024-01-12',
    last_contact_date: '2024-01-14',
    next_followup_date: '2024-01-20',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const mockContacts: CrmContact[] = [
  {
    id: '1',
    name: 'Dr. Michael Brown',
    organization: 'Community Health Center',
    position: 'Chief of Psychiatry',
    category: 'Healthcare Provider',
    email: 'm.brown@chc.org',
    phone: '(555) 555-6666',
    specialty: 'Psychiatry',
    relationship_type: 'Active Referrer',
    tags: ['psychiatry', 'medication-management'],
    added_date: '2024-01-01',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const mockCampaigns: MarketingCampaign[] = [
  {
    id: '1',
    name: 'Monthly Provider Newsletter',
    type: 'Email Newsletter',
    status: 'Active',
    audience: 'Healthcare Providers',
    description: 'Monthly updates on services and referral process',
    recipient_count: 150,
    open_rate: 68.5,
    click_rate: 12.3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Referral Sources hooks
export const useReferralSources = () => {
  return useQuery({
    queryKey: ['referral-sources'],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockReferralSources;
    }
  });
};

export const useCreateReferralSource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<ReferralSource>) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newSource = {
        ...data,
        id: Date.now().toString(),
        relationship_strength: 'Developing',
        status: 'Active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as ReferralSource;
      mockReferralSources.push(newSource);
      return newSource;
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockLeads;
    }
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<Lead>) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newLead = {
        ...data,
        id: Date.now().toString(),
        status: 'New',
        date_received: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as Lead;
      mockLeads.push(newLead);
      return newLead;
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockContacts;
    }
  });
};

export const useCreateCrmContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<CrmContact>) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newContact = {
        ...data,
        id: Date.now().toString(),
        added_date: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as CrmContact;
      mockContacts.push(newContact);
      return newContact;
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockCampaigns;
    }
  });
};

export const useCreateMarketingCampaign = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<MarketingCampaign>) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newCampaign = {
        ...data,
        id: Date.now().toString(),
        status: 'Draft',
        recipient_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as MarketingCampaign;
      mockCampaigns.push(newCampaign);
      return newCampaign;
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        activeReferralSources: mockReferralSources.filter(s => s.status === 'Active').length,
        newLeadsThisMonth: mockLeads.length,
        conversionRate: 75,
        estimatedRevenue: 12450
      };
    }
  });
};
