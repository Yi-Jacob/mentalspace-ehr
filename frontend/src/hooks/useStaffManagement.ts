
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { staffService, type CreateStaffInput, type UpdateStaffInput } from '@/services/staffService';
import { StaffMember } from '@/types/staff';

export const useStaffManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query for all staff members
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast({
        title: 'Success',
        description: 'Staff member created successfully',
      });
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
      return await createStaffMutation.mutateAsync(input);
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

  const deactivateStaff = async (id: string) => {
    try {
      return await deactivateStaffMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error deactivating staff member:', error);
      throw error;
    }
  };

  // Get staff by ID hook
  const useStaffById = (id: string) => {
    return useQuery({
      queryKey: ['staff', id],
      queryFn: () => staffService.getStaffById(id),
      enabled: !!id,
    });
  };

  return {
    // Data
    staffMembers,
    isLoading,
    error,
    
    // Mutations
    createStaffMember,
    updateStaffMember,
    deleteStaffMember,
    deactivateStaff,
    useStaffById,
    
    // Loading states
    isCreating: createStaffMutation.isPending,
    isUpdating: updateStaffMutation.isPending,
    isDeleting: deleteStaffMutation.isPending,
    isDeactivating: deactivateStaffMutation.isPending,
    
    // Refetch function
    refetchStaff,
  };
};
