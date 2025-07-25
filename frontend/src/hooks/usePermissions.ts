
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { permissionsService, Permission } from '@/services/permissionsService';
import { useToast } from '@/hooks/use-toast';

export const usePermissions = () => {
  const { toast } = useToast();

  // Get current user's permissions
  const { data: userPermissions, isLoading: permissionsLoading } = useQuery({
    queryKey: ['current-user-permissions'],
    queryFn: async () => {
      console.log('Permissions: Fetching user permissions...');
      const permissions = await permissionsService.getUserPermissions();
      console.log('Permissions: User permissions fetched:', permissions);
      return permissions || [];
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
    try {
      return await permissionsService.canAccessPatient(clientId, accessType);
    } catch (error) {
      console.error('Error checking patient access:', error);
      return false;
    }
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
