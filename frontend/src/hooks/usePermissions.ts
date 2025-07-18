
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types/staff';

interface Permission {
  category: string;
  action: string;
  scope: string;
}

export const usePermissions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current user's permissions using the new database function
  const { data: userPermissions, isLoading: permissionsLoading } = useQuery({
    queryKey: ['current-user-permissions'],
    queryFn: async () => {
      console.log('Permissions: Fetching user permissions...');
      
      // Use the new security definer function to get current user info safely
      const { data: userInfo, error: userError } = await supabase
        .rpc('get_current_user_info');

      if (userError) {
        console.error('Permissions: Error getting user info:', userError);
        return [];
      }

      if (!userInfo || userInfo.length === 0) {
        console.log('Permissions: No user info found');
        return [];
      }

      const currentUser = userInfo[0];
      console.log('Permissions: Current user found:', currentUser);

      // Use the get_user_permissions function
      const { data, error } = await supabase
        .rpc('get_user_permissions', { _user_id: currentUser.user_id });

      if (error) {
        console.error('Permissions: Error fetching user permissions:', error);
        return [];
      }

      console.log('Permissions: User permissions fetched:', data);
      return data || [];
    },
  });

  // Check if user has specific permission
  const hasPermission = useCallback((
    category: string, 
    action: string, 
    scope: string = 'all'
  ): boolean => {
    if (!userPermissions) return false;
    
    return userPermissions.some((perm: Permission) => 
      perm.category === category && 
      perm.action === action && 
      (perm.scope === scope || perm.scope === 'all')
    );
  }, [userPermissions]);

  // Check if user can access specific patient using the enhanced function
  const canAccessPatient = useCallback(async (
    clientId: string, 
    accessType: string = 'read'
  ): Promise<boolean> => {
    // Use the new security definer function to get current user info safely
    const { data: userInfo, error: userError } = await supabase
      .rpc('get_current_user_info');

    if (userError || !userInfo || userInfo.length === 0) {
      return false;
    }

    const currentUser = userInfo[0];

    // Use the enhanced function that supports access types
    const { data, error } = await supabase
      .rpc('can_access_patient_enhanced', { 
        _user_id: currentUser.user_id, 
        _client_id: clientId,
        _access_type: accessType
      });

    if (error) {
      console.error('Error checking patient access:', error);
      return false;
    }

    return data || false;
  }, []);

  // Enhanced role checking with specific permission validation
  const canManageUsers = useCallback(() => {
    return hasPermission('user_management', 'read') || 
           hasPermission('user_management', 'create') ||
           hasPermission('user_management', 'update');
  }, [hasPermission]);

  const canAssignRoles = useCallback(() => {
    return hasPermission('user_management', 'assign_roles');
  }, [hasPermission]);

  const canViewAuditLogs = useCallback(() => {
    return hasPermission('audit_logs', 'read');
  }, [hasPermission]);

  const canManageSchedule = useCallback((scope: string = 'own_only') => {
    return hasPermission('schedule', 'read', scope) ||
           hasPermission('schedule', 'update', scope) ||
           hasPermission('schedule', 'create', scope);
  }, [hasPermission]);

  const canManageClinicalNotes = useCallback((scope: string = 'assigned_only') => {
    return hasPermission('clinical_notes', 'create', scope) ||
           hasPermission('clinical_notes', 'read', scope) ||
           hasPermission('clinical_notes', 'update', scope);
  }, [hasPermission]);

  const canManageBilling = useCallback((scope: string = 'assigned_only') => {
    return hasPermission('billing', 'collect_copay', scope) ||
           hasPermission('billing', 'process_payment', scope) ||
           hasPermission('billing', 'generate_claims', scope);
  }, [hasPermission]);

  return {
    userPermissions,
    permissionsLoading,
    hasPermission,
    canAccessPatient,
    canManageUsers,
    canAssignRoles,
    canViewAuditLogs,
    canManageSchedule,
    canManageClinicalNotes,
    canManageBilling,
  };
};
