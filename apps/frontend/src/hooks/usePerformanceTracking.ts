
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffService } from '@/services/staffService';
import type { PerformanceMetric } from '@/services/staffService';
import { useToast } from '@/hooks/use-toast';

export type { PerformanceMetric };

export const usePerformanceTracking = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: performanceMetrics, isLoading } = useQuery({
    queryKey: ['performance-metrics'],
    queryFn: async () => {
      return await staffService.getPerformanceMetrics();
    },
  });

  const addPerformanceMetric = useMutation({
    mutationFn: async (metric: Omit<PerformanceMetric, 'id' | 'created_at'>) => {
      return await staffService.createPerformanceMetric(metric);
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
      return await staffService.updatePerformanceMetric(id, updates);
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
