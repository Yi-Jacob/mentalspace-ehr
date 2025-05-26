
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface QuickAction {
  id: string;
  user_id: string;
  action_type: string;
  title: string;
  description?: string;
  priority: number;
  due_date?: string;
  completed: boolean;
  completed_at?: string;
  created_at: string;
}

export const useQuickActions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: actions, isLoading } = useQuery({
    queryKey: ['quick-actions', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quick_actions')
        .select('*')
        .eq('completed', false)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as QuickAction[];
    },
    enabled: !!user,
  });

  const createActionMutation = useMutation({
    mutationFn: async (action: Omit<QuickAction, 'id' | 'user_id' | 'created_at' | 'completed' | 'completed_at'>) => {
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user?.id)
        .single();

      if (!userData) throw new Error('User not found');

      const { data, error } = await supabase
        .from('quick_actions')
        .insert({
          ...action,
          user_id: userData.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quick-actions'] });
    },
  });

  const completeActionMutation = useMutation({
    mutationFn: async (actionId: string) => {
      const { data, error } = await supabase
        .from('quick_actions')
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq('id', actionId)
        .select()
        .single();

      if (error) throw error;
      return data;
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
