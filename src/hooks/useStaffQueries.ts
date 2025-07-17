
import { useQuery } from '@tanstack/react-query';

export const useStaffQueries = () => {
  // Fetch all staff members from the backend API
  const { data: staffMembers, isLoading, error } = useQuery({
    queryKey: ['staff-members'],
    queryFn: async () => {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    },
  });
  return { staffMembers, isLoading, error };
};
