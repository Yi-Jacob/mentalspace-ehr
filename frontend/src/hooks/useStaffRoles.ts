
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types/staff';

export const useStaffRoles = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if current user has specific role using the security definer function
  const { data: userRoles, isLoading: rolesLoading } = useQuery({
    queryKey: ['current-user-roles'],
    queryFn: async () => {
      console.log('Fetching user roles...');
      
      try {
        // Use the security definer function to get current user roles
        const { data, error } = await supabase
          .rpc('get_current_user_roles');

        if (error) {
          console.error('Error fetching user roles:', error);
          return [];
        }
        
        console.log('User roles fetched successfully:', data);
        return data || [];
      } catch (err) {
        console.error('Unexpected error fetching roles:', err);
        return [];
      }
    },
    retry: 1,
  });

  const hasRole = useCallback((role: UserRole): boolean => {
    const result = userRoles?.some(r => r.role === role) || false;
    console.log(`Checking role ${role}:`, result, 'Available roles:', userRoles);
    return result;
  }, [userRoles]);

  const hasAnyRole = useCallback((roles: UserRole[]): boolean => {
    return userRoles?.some(r => roles.includes(r.role as UserRole)) || false;
  }, [userRoles]);

  // Assign role to user
  const assignRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: UserRole }) => {
      // Get current user info using the security definer function
      const { data: userInfo, error: userError } = await supabase
        .rpc('get_current_user_info');

      if (userError || !userInfo || userInfo.length === 0) {
        throw new Error('Could not get current user information');
      }

      const currentUser = userInfo[0];

      const { data, error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: role,
          assigned_by: currentUser.user_id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-members'] });
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      queryClient.invalidateQueries({ queryKey: ['current-user-roles'] });
      toast({
        title: 'Success',
        description: 'Role assigned successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to assign role',
        variant: 'destructive',
      });
    },
  });

  // Remove role from user
  const removeRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: UserRole }) => {
      const { error } = await supabase
        .from('user_roles')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('role', role);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-members'] });
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      queryClient.invalidateQueries({ queryKey: ['current-user-roles'] });
      toast({
        title: 'Success',
        description: 'Role removed successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove role',
        variant: 'destructive',
      });
    },
  });

  return {
    userRoles,
    rolesLoading,
    hasRole,
    hasAnyRole,
    assignRole: assignRoleMutation.mutate,
    removeRole: removeRoleMutation.mutate,
    isAssigningRole: assignRoleMutation.isPending,
    isRemovingRole: removeRoleMutation.isPending,
  };
};
