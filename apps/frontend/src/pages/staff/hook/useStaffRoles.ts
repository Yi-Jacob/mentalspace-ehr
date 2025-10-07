
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffService } from '@/services/staffService';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types/staffType';

export const useStaffRoles = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if current user has specific role
  const { data: userRoles, isLoading: rolesLoading } = useQuery({
    queryKey: ['current-user-roles'],
    queryFn: async () => {
      
      try {
        const data = await staffService.getCurrentUserRoles();
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
      return await staffService.assignRole(userId, role);
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
      return await staffService.removeRole(userId, role);
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
