
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
        // Get all users with their staff profiles
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select(`
            *,
            staff_profile:staff_profiles(*)
          `)
          .eq('is_active', true);

        if (usersError) {
          console.error('Error fetching users:', usersError);
          throw usersError;
        }
        
        console.log('Raw users data:', usersData);

        // Get all user roles separately
        const { data: rolesData, error: rolesError } = await supabase
          .from('user_roles')
          .select('*')
          .eq('is_active', true);

        if (rolesError) {
          console.error('Error fetching roles:', rolesError);
          throw rolesError;
        }

        console.log('Raw roles data:', rolesData);

        // Combine the data manually
        const staffData = usersData?.map(user => {
          const userRoles = rolesData?.filter(role => role.user_id === user.id) || [];
          
          return {
            ...user,
            staff_profile: Array.isArray(user.staff_profile) ? user.staff_profile[0] : user.staff_profile,
            roles: userRoles
          };
        }) || [];

        // Filter to only include users who have staff profiles or roles
        const filteredStaffData = staffData.filter(user => 
          user.staff_profile || (user.roles && user.roles.length > 0)
        );
        
        console.log('Filtered staff members:', filteredStaffData);
        return filteredStaffData as StaffMember[];
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
