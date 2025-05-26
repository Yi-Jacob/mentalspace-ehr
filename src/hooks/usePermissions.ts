
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

  // Get current user's permissions
  const { data: userPermissions, isLoading: permissionsLoading } = useQuery({
    queryKey: ['current-user-permissions'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];

      // First get the user from our users table
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.user.id)
        .single();

      if (!userData) return [];

      const { data, error } = await supabase
        .rpc('get_user_permissions', { _user_id: userData.id });

      if (error) throw error;
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

  // Check if user can access specific patient
  const canAccessPatient = useCallback(async (
    clientId: string, 
    accessType: string = 'read'
  ): Promise<boolean> => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return false;

    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', user.user.id)
      .single();

    if (!userData) return false;

    const { data, error } = await supabase
      .rpc('can_access_patient_enhanced', { 
        _user_id: userData.id, 
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
