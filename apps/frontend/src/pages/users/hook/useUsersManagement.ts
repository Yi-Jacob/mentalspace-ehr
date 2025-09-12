
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { usersService } from '@/services/usersService';

export const useUsersManagement = () => {
  const { toast } = useToast();

  // Query for all staff members from backend API
  const {
    data: staffMembers = [],
    isLoading,
    error,
    refetch: refetchStaff,
  } = useQuery({
    queryKey: ['staff'],
    queryFn: () => usersService.getAllUsers(),
  });

  // Mutation for deactivating staff
  const deactivateStaffMutation = useMutation({
    mutationFn: (id: string) => usersService.deactivateUser(id),
    onSuccess: () => {
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

  const deactivateStaffMember = async (id: string) => {
    try {
      return await deactivateStaffMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error deactivating staff member:', error);
      throw error;
    }
  };

  return {
    // Data
    staffMembers,
    isLoading,
    error,
    refetchStaff,

    deactivateStaffMember,
    isDeactivating: deactivateStaffMutation.isPending,
  };
};
