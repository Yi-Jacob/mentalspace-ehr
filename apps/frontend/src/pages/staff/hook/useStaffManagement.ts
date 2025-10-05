
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { staffService, type CreateStaffInput, type UpdateStaffInput } from '@/services/staffService';
import { StaffMember } from '@/types/staffType';

export const useStaffManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query for all staff members from backend API
  const {
    data: staffMembers = [],
    isLoading,
    error,
    refetch: refetchStaff,
  } = useQuery({
    queryKey: ['staff'],
    queryFn: () => staffService.getAllStaff(),
  });

  // Mutation for creating staff
  const createStaffMutation = useMutation({
    mutationFn: (input: CreateStaffInput) => staffService.createStaff(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      queryClient.invalidateQueries({ queryKey: ['staff-members'] });
      toast({
        title: 'Success',
        description: 'Staff member created successfully',
      });
      return data;
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create staff member',
        variant: 'destructive',
      });
    },
  });

  // Mutation for updating staff
  const updateStaffMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateStaffInput }) => 
      staffService.updateStaff(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      queryClient.invalidateQueries({ queryKey: ['staff-members'] });
      toast({
        title: 'Success',
        description: 'Staff member updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update staff member',
        variant: 'destructive',
      });
    },
  });

  // Mutation for deleting staff
  const deleteStaffMutation = useMutation({
    mutationFn: (id: string) => staffService.deleteStaff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      queryClient.invalidateQueries({ queryKey: ['staff-members'] });
      toast({
        title: 'Success',
        description: 'Staff member deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete staff member',
        variant: 'destructive',
      });
    },
  });

  // Mutation for deactivating staff
  const deactivateStaffMutation = useMutation({
    mutationFn: (id: string) => staffService.deactivateStaff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
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

  // Staff management functions
  const createStaffMember = async (input: CreateStaffInput) => {
    try {
      const result = await createStaffMutation.mutateAsync(input);
      return result;
    } catch (error) {
      console.error('Error creating staff member:', error);
      throw error;
    }
  };

  const updateStaffMember = async (id: string, input: UpdateStaffInput) => {
    try {
      return await updateStaffMutation.mutateAsync({ id, input });
    } catch (error) {
      console.error('Error updating staff member:', error);
      throw error;
    }
  };

  const deleteStaffMember = async (id: string) => {
    try {
      return await deleteStaffMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting staff member:', error);
      throw error;
    }
  };

  const deactivateStaffMember = async (id: string) => {
    try {
      return await deactivateStaffMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error deactivating staff member:', error);
      throw error;
    }
  };

  const getStaff = async (id: string) => {
    try {
      return await staffService.getStaff(id);
    } catch (error) {
      console.error('Error fetching staff member:', error);
      throw error;
    }
  };

  return {
    // Data
    staffMembers,
    isLoading,
    error,
    refetchStaff,

    // Mutations
    createStaffMember,
    updateStaffMember,
    deleteStaffMember,
    deactivateStaffMember,
    getStaff,

    // Loading states
    isCreating: createStaffMutation.isPending,
    isUpdating: updateStaffMutation.isPending,
    isDeleting: deleteStaffMutation.isPending,
    isDeactivating: deactivateStaffMutation.isPending,
  };
};
