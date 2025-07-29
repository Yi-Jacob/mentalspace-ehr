
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quickActionsService, QuickAction, CreateQuickActionRequest } from '@/services/quickActionsService';

export const useQuickActions = () => {
  const queryClient = useQueryClient();

  const { data: actions, isLoading } = useQuery({
    queryKey: ['quick-actions'],
    queryFn: async () => {
      return quickActionsService.getQuickActions();
    },
  });

  const createActionMutation = useMutation({
    mutationFn: async (action: CreateQuickActionRequest) => {
      return quickActionsService.createQuickAction(action);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quick-actions'] });
    },
  });

  const completeActionMutation = useMutation({
    mutationFn: async (actionId: string) => {
      return quickActionsService.completeQuickAction(actionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quick-actions'] });
    },
  });

  return {
    actions: actions || [],
    isLoading,
    createAction: createActionMutation.mutate,
    completeAction: completeActionMutation.mutate,
    isCreating: createActionMutation.isPending,
    isCompleting: completeActionMutation.isPending,
  };
};
