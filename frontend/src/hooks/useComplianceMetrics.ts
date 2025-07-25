
import { useQuery } from '@tanstack/react-query';
import { complianceService } from '@/services/complianceService';
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
      
      return await complianceService.getComplianceMetrics();
    },
    enabled: !!user,
  });

  return {
    metrics: metrics || { completion_rate: 0, overdue_rate: 0, avg_completion_time: 0 },
    isLoading,
  };
};
