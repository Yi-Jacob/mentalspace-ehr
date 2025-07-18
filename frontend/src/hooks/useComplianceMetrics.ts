
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ComplianceMetrics {
  completion_rate: number;
  overdue_rate: number;
  avg_completion_time: number;
}

export const useComplianceMetrics = () => {
  const { user } = useAuth();

  const { data: metrics, isLoading } = useQuery({
    queryKey: ['compliance-metrics', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .rpc('calculate_compliance_metrics', { user_uuid: user.id });

      if (error) throw error;
      
      return data[0] as ComplianceMetrics;
    },
    enabled: !!user,
  });

  return {
    metrics: metrics || { completion_rate: 0, overdue_rate: 0, avg_completion_time: 0 },
    isLoading,
  };
};
