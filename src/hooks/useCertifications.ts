
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Certification {
  id: string;
  user_id: string;
  certification_name: string;
  certification_number?: string;
  issuing_organization: string;
  issue_date?: string;
  expiry_date: string;
  renewal_period_months: number;
  status: 'active' | 'expired' | 'pending_renewal';
  reminder_sent_30_days: boolean;
  reminder_sent_60_days: boolean;
  reminder_sent_90_days: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useCertifications = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: certifications, isLoading } = useQuery({
    queryKey: ['certifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('certifications')
        .select(`
          *,
          user:users!certifications_user_id_fkey(first_name, last_name)
        `)
        .order('expiry_date', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const { data: expiringCertifications } = useQuery({
    queryKey: ['expiring-certifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('certifications')
        .select(`
          *,
          user:users!certifications_user_id_fkey(first_name, last_name)
        `)
        .eq('status', 'pending_renewal')
        .order('expiry_date', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const addCertification = useMutation({
    mutationFn: async (certification: Omit<Certification, 'id' | 'created_at' | 'updated_at' | 'reminder_sent_30_days' | 'reminder_sent_60_days' | 'reminder_sent_90_days'>) => {
      const { data, error } = await supabase
        .from('certifications')
        .insert(certification)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      queryClient.invalidateQueries({ queryKey: ['expiring-certifications'] });
      toast({ title: 'Certification added successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateCertification = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Certification> & { id: string }) => {
      const { data, error } = await supabase
        .from('certifications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      queryClient.invalidateQueries({ queryKey: ['expiring-certifications'] });
      toast({ title: 'Certification updated successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    certifications,
    expiringCertifications,
    isLoading,
    addCertification,
    updateCertification,
    isAdding: addCertification.isPending,
    isUpdating: updateCertification.isPending,
  };
};
