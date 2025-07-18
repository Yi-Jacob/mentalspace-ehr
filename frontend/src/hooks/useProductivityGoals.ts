
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ProductivityGoal {
  id: string;
  user_id: string;
  goal_type: string;
  target_value: number;
  current_value: number;
  date: string;
  created_at: string;
  updated_at: string;
}

export const useProductivityGoals = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: goals, isLoading } = useQuery({
    queryKey: ['productivity-goals', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('productivity_goals')
        .select('*')
        .eq('date', new Date().toISOString().split('T')[0])
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ProductivityGoal[];
    },
    enabled: !!user,
  });

  const createGoalMutation = useMutation({
    mutationFn: async (goal: Omit<ProductivityGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user?.id)
        .single();

      if (!userData) throw new Error('User not found');

      const { data, error } = await supabase
        .from('productivity_goals')
        .insert({
          ...goal,
          user_id: userData.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productivity-goals'] });
    },
  });

  const updateGoalMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ProductivityGoal> }) => {
      const { data, error } = await supabase
        .from('productivity_goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
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
