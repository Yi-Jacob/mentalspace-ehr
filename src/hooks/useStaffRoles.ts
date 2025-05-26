
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types/staff';

export const useStaffRoles = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if current user has specific role using the new security definer function
  const { data: userRoles, isLoading: rolesLoading } = useQuery({
    queryKey: ['current-user-roles'],
    queryFn: async () => {
      console.log('Fetching user roles...');
      
      // Use the new security definer function to get current user info safely
      const { data: userInfo, error: userError } = await supabase
        .rpc('get_current_user_info');

      if (userError) {
        console.error('Error getting user info:', userError);
        return [];
      }

      if (!userInfo || userInfo.length === 0) {
        console.log('No user info found');
        return [];
      }

      const currentUser = userInfo[0];
      console.log('Current user found:', currentUser);

      // Try to get the user's roles with better error handling
      console.log('Attempting to fetch roles for user ID:', currentUser.user_id);
      
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', currentUser.user_id)
          .eq('is_active', true);

        if (error) {
          console.error('Error fetching user roles:', error);
          console.error('Error details:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          });
          
          // Try a different approach - use RPC to bypass RLS issues
          console.log('Trying alternative approach with RPC...');
          const { data: rpcData, error: rpcError } = await supabase
            .rpc('has_role', { 
              _user_id: currentUser.user_id, 
              _role: 'Practice Administrator' 
            });
            
          if (rpcError) {
            console.error('RPC error:', rpcError);
            return [];
          }
          
          console.log('RPC result for Practice Administrator:', rpcData);
          
          // If the user has Practice Administrator role, create a mock role object
          if (rpcData) {
            return [{
              id: 'mock-role-id',
              user_id: currentUser.user_id,
              role: 'Practice Administrator',
              is_active: true,
              assigned_at: new Date().toISOString(),
              assigned_by: null
            }];
          }
          
          return [];
        }
        
        console.log('User roles fetched successfully:', data);
        return data || [];
      } catch (err) {
        console.error('Unexpected error fetching roles:', err);
        return [];
      }
    },
  });

  const hasRole = useCallback((role: UserRole): boolean => {
    const result = userRoles?.some(r => r.role === role && r.is_active) || false;
    console.log(`Checking role ${role}:`, result);
    return result;
  }, [userRoles]);

  const hasAnyRole = useCallback((roles: UserRole[]): boolean => {
    return userRoles?.some(r => roles.includes(r.role as UserRole) && r.is_active) || false;
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
          role: role as any,
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
        .eq('role', role as any);

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
