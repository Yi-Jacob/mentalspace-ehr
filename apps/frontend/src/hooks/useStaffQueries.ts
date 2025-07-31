import { useQuery } from '@tanstack/react-query';
import { staffService } from '@/services/staffService';
import { StaffMember } from '@/types/staffType';

export const useStaffQueries = () => {
  // Fetch all staff members from backend API
  const { data: staffMembers, isLoading, error } = useQuery({
    queryKey: ['staff-members'],
    queryFn: async () => {
      console.log('Fetching staff members from backend...');
      
      try {
        // Use the staffService to fetch data from backend
        const staffData = await staffService.getAllStaff();
        
        console.log('Staff data from backend:', staffData);
        return staffData;
      } catch (err) {
        console.error('Error in staff query:', err);
        throw err;
      }
    },
    retry: 1,
    retryDelay: 1000,
  });

  return {
    staffMembers,
    isLoading,
    error,
  };
};