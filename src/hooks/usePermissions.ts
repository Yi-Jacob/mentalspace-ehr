
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

  // Get current user's permissions - simplified version for now
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

      // Get user roles directly for now
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userData.id)
        .eq('is_active', true);

      if (!roles) return [];

      // Return basic permissions based on roles
      const permissions: Permission[] = [];
      
      roles.forEach((roleData) => {
        const role = roleData.role as UserRole;
        
        // Add basic permissions based on role
        switch (role) {
          case 'Practice Administrator':
            permissions.push(
              { category: 'user_management', action: 'read', scope: 'all' },
              { category: 'user_management', action: 'create', scope: 'all' },
              { category: 'user_management', action: 'update', scope: 'all' },
              { category: 'user_management', action: 'assign_roles', scope: 'all' },
              { category: 'audit_logs', action: 'read', scope: 'all' }
            );
            break;
          case 'Clinician':
            permissions.push(
              { category: 'clinical_notes', action: 'create', scope: 'assigned_only' },
              { category: 'clinical_notes', action: 'read', scope: 'assigned_only' },
              { category: 'clinical_notes', action: 'update', scope: 'assigned_only' },
              { category: 'schedule', action: 'read', scope: 'own_only' },
              { category: 'schedule', action: 'update', scope: 'own_only' }
            );
            break;
          case 'Clinical Administrator':
            permissions.push(
              { category: 'clinical_notes', action: 'delete', scope: 'all' },
              { category: 'patient_records', action: 'read', scope: 'all' },
              { category: 'patient_records', action: 'update', scope: 'all' }
            );
            break;
          case 'Practice Scheduler':
            permissions.push(
              { category: 'schedule', action: 'read', scope: 'all' },
              { category: 'schedule', action: 'create', scope: 'all' },
              { category: 'schedule', action: 'update', scope: 'all' }
            );
            break;
          case 'Practice Biller':
            permissions.push(
              { category: 'billing', action: 'collect_copay', scope: 'all' },
              { category: 'billing', action: 'process_payment', scope: 'all' },
              { category: 'billing', action: 'generate_claims', scope: 'all' }
            );
            break;
        }
      });

      return permissions;
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

  // Check if user can access specific patient - simplified version
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

    // Use existing function for now
    const { data, error } = await supabase
      .rpc('can_access_patient', { 
        _user_id: userData.id, 
        _client_id: clientId
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
