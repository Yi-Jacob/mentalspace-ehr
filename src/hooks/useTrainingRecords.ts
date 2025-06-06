
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TrainingRecord {
  id: string;
  user_id: string;
  training_title: string;
  training_type: string;
  provider_organization?: string;
  completion_date?: string;
  expiry_date?: string;
  hours_completed?: number;
  certificate_number?: string;
  status: 'in_progress' | 'completed' | 'expired';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useTrainingRecords = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: trainingRecords, isLoading } = useQuery({
    queryKey: ['training-records'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('training_records')
        .select(`
          *,
          user:users!training_records_user_id_fkey(first_name, last_name)
        `)
        .order('completion_date', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const addTrainingRecord = useMutation({
    mutationFn: async (record: Omit<TrainingRecord, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('training_records')
        .insert(record)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-records'] });
      toast({ title: 'Training record added successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateTrainingRecord = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<TrainingRecord> & { id: string }) => {
      const { data, error } = await supabase
        .from('training_records')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-records'] });
      toast({ title: 'Training record updated successfully' });
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
    trainingRecords,
    isLoading,
    addTrainingRecord,
    updateTrainingRecord,
    isAdding: addTrainingRecord.isPending,
    isUpdating: updateTrainingRecord.isPending,
  };
};
