
import { useStaffQueries } from './useStaffQueries';
import { useStaffMutations } from './useStaffMutations';

export const useStaffManagement = () => {
  const { staffMembers, isLoading, error } = useStaffQueries();
  const {
    createStaffMember,
    createStaffProfile,
    updateStaffProfile,
    deactivateStaff,
    isCreatingStaff,
    isCreating,
    isUpdating,
    isDeactivating,
  } = useStaffMutations();

  return {
    staffMembers,
    isLoading,
    error,
    createStaffMember,
    createStaffProfile,
    updateStaffProfile,
    deactivateStaff,
    isCreatingStaff,
    isCreating,
    isUpdating,
    isDeactivating,
  };
};
