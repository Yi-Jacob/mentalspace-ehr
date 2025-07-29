
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productivityGoalsService, ProductivityGoal, CreateProductivityGoalRequest, UpdateProductivityGoalRequest } from '@/services/productivityGoalsService';

export const useProductivityGoals = () => {
  const queryClient = useQueryClient();

  const { data: goals, isLoading } = useQuery({
    queryKey: ['productivity-goals'],
    queryFn: async () => {
      return productivityGoalsService.getGoals(new Date().toISOString().split('T')[0]);
    },
  });

  const createGoalMutation = useMutation({
    mutationFn: async (goal: CreateProductivityGoalRequest) => {
      return productivityGoalsService.createGoal(goal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productivity-goals'] });
    },
  });

  const updateGoalMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateProductivityGoalRequest }) => {
      return productivityGoalsService.updateGoal(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productivity-goals'] });
    },
  });

  return {
    goals: goals || [],
    isLoading,
    createGoal: createGoalMutation.mutate,
    updateGoal: updateGoalMutation.mutate,
    isCreating: createGoalMutation.isPending,
    isUpdating: updateGoalMutation.isPending,
  };
};
