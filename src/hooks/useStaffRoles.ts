
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserRole, UserRoleAssignment } from '@/types/staff';

export const useStaffRoles = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if current user has specific role
  const { data: userRoles, isLoading: rolesLoading } = useQuery({
    queryKey: ['current-user-roles'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];

      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.user.id)
        .eq('is_active', true);

      if (error) throw error;
      return data as UserRoleAssignment[];
    },
  });

  const hasRole = useCallback((role: UserRole): boolean => {
    return userRoles?.some(r => r.role === role && r.is_active) || false;
  }, [userRoles]);

  const hasAnyRole = useCallback((roles: UserRole[]): boolean => {
    return userRoles?.some(r => roles.includes(r.role) && r.is_active) || false;
  }, [userRoles]);

  // Assign role to user
  const assignRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: UserRole }) => {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role,
          assigned_by: currentUser.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-members'] });
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
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
