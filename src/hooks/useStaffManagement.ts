
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useStaffManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all staff members
  const { data: staffMembers, isLoading, error } = useQuery({
    queryKey: ['staff-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          staff_profile:staff_profiles!inner(*),
          roles:user_roles(*)
        `)
        .eq('is_active', true);

      if (error) throw error;
      
      // Transform the data to match our expected structure
      return data?.map(user => ({
        ...user,
        staff_profile: Array.isArray(user.staff_profile) ? user.staff_profile[0] : user.staff_profile,
        roles: user.roles || []
      })) || [];
    },
  });

  // Create staff profile
  const createStaffProfileMutation = useMutation({
    mutationFn: async (profileData: { user_id: string; [key: string]: any }) => {
      const { data, error } = await supabase
        .from('staff_profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-members'] });
      toast({
        title: 'Success',
        description: 'Staff profile created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create staff profile',
        variant: 'destructive',
      });
    },
  });

  // Update staff profile
  const updateStaffProfileMutation = useMutation({
    mutationFn: async ({ id, ...profileData }: { id: string; [key: string]: any }) => {
      const { data, error } = await supabase
        .from('staff_profiles')
        .update(profileData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-members'] });
      toast({
        title: 'Success',
        description: 'Staff profile updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update staff profile',
        variant: 'destructive',
      });
    },
  });

  // Deactivate staff member
  const deactivateStaffMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('users')
        .update({ is_active: false })
        .eq('id', userId);

      if (error) throw error;

      // Also deactivate staff profile
      await supabase
        .from('staff_profiles')
        .update({ status: 'inactive' })
        .eq('user_id', userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-members'] });
      toast({
        title: 'Success',
        description: 'Staff member deactivated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to deactivate staff member',
        variant: 'destructive',
      });
    },
  });

  return {
    staffMembers,
    isLoading,
    error,
    createStaffProfile: createStaffProfileMutation.mutate,
    updateStaffProfile: updateStaffProfileMutation.mutate,
    deactivateStaff: deactivateStaffMutation.mutate,
    isCreating: createStaffProfileMutation.isPending,
    isUpdating: updateStaffProfileMutation.isPending,
    isDeactivating: deactivateStaffMutation.isPending,
  };
};
