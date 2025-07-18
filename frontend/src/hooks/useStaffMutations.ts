
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CreateStaffMemberData, SupervisionRequirementType } from '@/types/staffManagement';
import { UserStatus } from '@/types/staff';

export const useStaffMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Create staff member using the database function
  const createStaffMemberMutation = useMutation({
    mutationFn: async (staffData: CreateStaffMemberData) => {
      const { data, error } = await supabase.rpc('create_staff_member', {
        p_first_name: staffData.first_name,
        p_last_name: staffData.last_name,
        p_email: staffData.email,
        p_roles: staffData.roles,
        p_employee_id: staffData.employee_id || null,
        p_job_title: staffData.job_title || null,
        p_department: staffData.department || null,
        p_phone_number: staffData.phone_number || null,
        p_npi_number: staffData.npi_number || null,
        p_license_number: staffData.license_number || null,
        p_license_state: staffData.license_state || null,
        p_license_expiry_date: staffData.license_expiry_date || null,
        p_hire_date: staffData.hire_date || null,
        p_billing_rate: staffData.billing_rate || null,
        p_can_bill_insurance: staffData.can_bill_insurance || false,
        p_status: (staffData.status as UserStatus) || 'active',
        p_notes: staffData.notes || null,
        p_supervision_type: (staffData.supervision_type as SupervisionRequirementType) || 'Not Supervised',
        p_supervisor_id: staffData.supervisor_id || null,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-members'] });
      toast({
        title: 'Success',
        description: 'Staff member created successfully',
      });
    },
    onError: (error: any) => {
      console.error('Error creating staff member:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create staff member',
        variant: 'destructive',
      });
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
    createStaffMember: createStaffMemberMutation.mutate,
    createStaffProfile: createStaffProfileMutation.mutate,
    updateStaffProfile: updateStaffProfileMutation.mutate,
    deactivateStaff: deactivateStaffMutation.mutate,
    isCreatingStaff: createStaffMemberMutation.isPending,
    isCreating: createStaffProfileMutation.isPending,
    isUpdating: updateStaffProfileMutation.isPending,
    isDeactivating: deactivateStaffMutation.isPending,
  };
};
