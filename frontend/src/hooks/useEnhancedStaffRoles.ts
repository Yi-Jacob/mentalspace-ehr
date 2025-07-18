
import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types/staff';
import { usePermissions } from './usePermissions';

export const useEnhancedStaffRoles = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { hasPermission, canManageUsers, canAssignRoles } = usePermissions();

  // Fetch all user roles using the security definer function
  const { data: userRoles, isLoading: rolesLoading } = useQuery({
    queryKey: ['current-user-roles'],
    queryFn: async () => {
      console.log('Enhanced: Fetching user roles...');
      
      try {
        // Use the security definer function to get current user roles
        const { data, error } = await supabase
          .rpc('get_current_user_roles');

        if (error) {
          console.error('Enhanced: Error fetching user roles:', error);
          throw error;
        }
        
        console.log('Enhanced: User roles fetched:', data);
        return data || [];
      } catch (err) {
        console.error('Enhanced: Unexpected error fetching roles:', err);
        return [];
      }
    },
  });

  // Enhanced role checking with business logic
  const hasRole = useCallback((role: UserRole): boolean => {
    const result = userRoles?.some(r => r.role === role) || false;
    console.log(`Enhanced: Checking role ${role}:`, result);
    return result;
  }, [userRoles]);

  const hasAnyRole = useCallback((roles: UserRole[]): boolean => {
    return userRoles?.some(r => roles.includes(r.role as UserRole)) || false;
  }, [userRoles]);

  // Clinical Administrator validation - must also have Clinician role
  const isClinicalAdministrator = useCallback((): boolean => {
    return hasRole('Clinical Administrator') && hasRole('Clinician');
  }, [hasRole]);

  // Supervisor capabilities
  const canSupervise = useCallback((): boolean => {
    return hasRole('Supervisor') && hasPermission('clinical_notes', 'cosign', 'supervised_only');
  }, [hasRole, hasPermission]);

  // Billing role validation
  const canBillInsurance = useCallback((): boolean => {
    // Interns, Assistants, Associates cannot bill directly
    const restrictedRoles: UserRole[] = ['Intern', 'Assistant', 'Associate'];
    const hasRestrictedRole = hasAnyRole(restrictedRoles);
    
    if (hasRestrictedRole) {
      return false; // Must use supervisor's credentials
    }
    
    return hasRole('Clinician') || hasRole('Practice Biller');
  }, [hasRole, hasAnyRole]);

  // Schedule access based on role
  const hasScheduleAccess = useCallback((): boolean => {
    // Practice Schedulers have access to all schedules
    if (hasRole('Practice Scheduler')) {
      return hasPermission('schedule', 'read', 'all');
    }
    
    // Clinicians and similar roles have access to their own schedules
    const clinicalRoles: UserRole[] = ['Clinician', 'Intern', 'Assistant', 'Associate', 'Supervisor'];
    if (hasAnyRole(clinicalRoles)) {
      return hasPermission('schedule', 'read', 'own_only');
    }
    
    return false;
  }, [hasRole, hasAnyRole, hasPermission]);

  // Note creation permissions based on role
  const canCreateNoteType = useCallback((noteType: string): boolean => {
    // Practice Schedulers can only create specific note types
    if (hasRole('Practice Scheduler')) {
      const allowedNotes = ['missed_appointment', 'contact', 'miscellaneous'];
      return allowedNotes.includes(noteType);
    }
    
    // Practice Billers can create contact and miscellaneous notes
    if (hasRole('Practice Biller')) {
      const allowedNotes = ['contact', 'miscellaneous'];
      return allowedNotes.includes(noteType);
    }
    
    // Clinical roles can create clinical notes
    const clinicalRoles: UserRole[] = ['Clinician', 'Intern', 'Assistant', 'Associate', 'Supervisor', 'Clinical Administrator'];
    if (hasAnyRole(clinicalRoles)) {
      return hasPermission('clinical_notes', 'create', 'assigned_only');
    }
    
    return false;
  }, [hasRole, hasAnyRole, hasPermission]);

  // Assign role with validation
  const assignRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: UserRole }) => {
      if (!canAssignRoles()) {
        throw new Error('You do not have permission to assign roles');
      }

      // Validate Clinical Administrator role requires Clinician role
      if (role === 'Clinical Administrator') {
        const { data: existingRoles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .eq('is_active', true);
        
        const hasClinicianRole = existingRoles?.some(r => r.role === 'Clinician');
        if (!hasClinicianRole) {
          throw new Error('Clinical Administrator role requires Clinician role to be assigned first');
        }
      }

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
      queryClient.invalidateQueries({ queryKey: ['current-user-permissions'] });
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

  // Remove role with validation
  const removeRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: UserRole }) => {
      if (!canAssignRoles()) {
        throw new Error('You do not have permission to remove roles');
      }

      // Prevent removing Clinician role if Clinical Administrator role exists
      if (role === 'Clinician') {
        const { data: existingRoles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .eq('is_active', true);
        
        const hasClinicalAdminRole = existingRoles?.some(r => r.role === 'Clinical Administrator');
        if (hasClinicalAdminRole) {
          throw new Error('Cannot remove Clinician role while Clinical Administrator role is active');
        }
      }

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
      queryClient.invalidateQueries({ queryKey: ['current-user-permissions'] });
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
    isClinicalAdministrator,
    canSupervise,
    canBillInsurance,
    hasScheduleAccess,
    canCreateNoteType,
    canManageUsers,
    canAssignRoles,
    assignRole: assignRoleMutation.mutate,
    removeRole: removeRoleMutation.mutate,
    isAssigningRole: assignRoleMutation.isPending,
    isRemovingRole: removeRoleMutation.isPending,
  };
};
