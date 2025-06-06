
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { StaffMember } from '@/types/staff';

export const useStaffQueries = () => {
  // Fetch all staff members
  const { data: staffMembers, isLoading, error } = useQuery({
    queryKey: ['staff-members'],
    queryFn: async () => {
      console.log('Fetching staff members...');
      
      // First, let's try a simpler query to see all users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select(`
          *,
          staff_profile:staff_profiles(*),
          roles:user_roles(*)
        `)
        .eq('is_active', true);

      if (usersError) {
        console.error('Error fetching users:', usersError);
        throw usersError;
      }
      
      console.log('Raw users data:', usersData);
      
      // Transform the data to match our expected structure
      const transformedData = (usersData?.map(user => ({
        ...user,
        staff_profile: Array.isArray(user.staff_profile) ? user.staff_profile[0] : user.staff_profile,
        roles: user.roles || []
      })) || []) as StaffMember[];
      
      console.log('Transformed staff members:', transformedData);
      return transformedData;
    },
  });

  return {
    staffMembers,
    isLoading,
    error,
  };
};
