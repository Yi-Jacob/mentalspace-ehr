
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { StaffMember } from '@/types/staff';

export const useStaffQueries = () => {
  // Fetch all staff members
  const { data: staffMembers, isLoading, error } = useQuery({
    queryKey: ['staff-members'],
    queryFn: async () => {
      console.log('Fetching staff members...');
      
      try {
        // Use explicit foreign key relationship to avoid ambiguity
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select(`
            *,
            staff_profile:staff_profiles!staff_profiles_user_id_fkey(*),
            roles:user_roles!user_roles_user_id_fkey(*)
          `)
          .eq('is_active', true);

        if (usersError) {
          console.error('Error fetching users:', usersError);
          throw usersError;
        }
        
        console.log('Raw users data:', usersData);
        
        // Filter to only include users who have staff profiles or roles
        const staffData = usersData?.filter(user => 
          user.staff_profile || (user.roles && user.roles.length > 0)
        ) || [];
        
        // Transform the data to match our expected structure
        const transformedData = staffData.map(user => ({
          ...user,
          staff_profile: Array.isArray(user.staff_profile) ? user.staff_profile[0] : user.staff_profile,
          roles: user.roles || []
        })) as StaffMember[];
        
        console.log('Transformed staff members:', transformedData);
        return transformedData;
      } catch (err) {
        console.error('Error in staff query:', err);
        throw err;
      }
    },
    retry: 2,
    retryDelay: 1000,
  });

  return {
    staffMembers,
    isLoading,
    error,
  };
};
