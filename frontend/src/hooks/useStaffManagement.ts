
import { useStaffQueries } from './useStaffQueries';
import { useStaffMutations } from './useStaffMutations';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useStaffManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { staffMembers, isLoading, error } = useStaffQueries();
  const {
    createStaffMember,
    createStaffProfile,
    updateStaffProfile,
    deactivateStaff,
    isCreatingStaff,
    isCreating,
    isUpdating,
    isDeactivating,
  } = useStaffMutations();

  // Add function to assign Practice Administrator role to current user
  const assignAdminRoleMutation = useMutation({
    mutationFn: async () => {
      // Get current user info using the security definer function
      const { data: userInfo, error: userError } = await supabase
        .rpc('get_current_user_info');

      if (userError || !userInfo || userInfo.length === 0) {
        throw new Error('Could not get current user information');
      }

      const currentUser = userInfo[0];

      // Check if user already has the role
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', currentUser.user_id)
        .eq('role', 'Practice Administrator')
        .eq('is_active', true)
        .single();

      if (existingRole) {
        throw new Error('User already has Practice Administrator role');
      }

      // Assign the role
      const { data, error } = await supabase
        .from('user_roles')
        .insert({
          user_id: currentUser.user_id,
          role: 'Practice Administrator',
          assigned_by: currentUser.user_id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-user-roles'] });
      queryClient.invalidateQueries({ queryKey: ['current-user-permissions'] });
      toast({
        title: 'Success',
        description: 'Practice Administrator role assigned successfully',
      });
      // Force a page refresh to ensure all permissions are updated
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to assign Practice Administrator role',
        variant: 'destructive',
      });
    },
  });

  return {
    staffMembers,
    isLoading,
    error,
    createStaffMember,
    createStaffProfile,
    updateStaffProfile,
    deactivateStaff,
    isCreatingStaff,
    isCreating,
    isUpdating,
    isDeactivating,
    assignAdminRole: assignAdminRoleMutation.mutate,
    isAssigningAdmin: assignAdminRoleMutation.isPending,
  };
};
