
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PerformanceMetric {
  id: string;
  user_id: string;
  metric_type: string;
  metric_value: number;
  target_value?: number;
  measurement_period: string;
  period_start: string;
  period_end: string;
  notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
}

export const usePerformanceTracking = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: performanceMetrics, isLoading } = useQuery({
    queryKey: ['performance-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('performance_metrics')
        .select(`
          *,
          user:users!performance_metrics_user_id_fkey(first_name, last_name),
          reviewer:users!performance_metrics_reviewed_by_fkey(first_name, last_name)
        `)
        .order('period_start', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const addPerformanceMetric = useMutation({
    mutationFn: async (metric: Omit<PerformanceMetric, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('performance_metrics')
        .insert(metric)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['performance-metrics'] });
      toast({ title: 'Performance metric added successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updatePerformanceMetric = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PerformanceMetric> & { id: string }) => {
      const { data, error } = await supabase
        .from('performance_metrics')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['performance-metrics'] });
      toast({ title: 'Performance metric updated successfully' });
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
    performanceMetrics,
    isLoading,
    addPerformanceMetric,
    updatePerformanceMetric,
    isAdding: addPerformanceMetric.isPending,
    isUpdating: updatePerformanceMetric.isPending,
  };
};
