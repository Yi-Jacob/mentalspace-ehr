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
        // Step 1: Get all users first
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('*')
          .eq('is_active', true);

        if (usersError) {
          console.error('Error fetching users:', usersError);
          throw usersError;
        }
        
        console.log('Users data:', usersData);

        if (!usersData || usersData.length === 0) {
          console.log('No users found');
          return [];
        }

        // Step 2: Get staff profiles for these users
        const userIds = usersData.map(user => user.id);
        const { data: staffProfiles, error: profilesError } = await supabase
          .from('staff_profiles')
          .select('*')
          .in('user_id', userIds);

        if (profilesError) {
          console.error('Error fetching staff profiles:', profilesError);
          // Don't throw error, just log it as staff profiles might not exist
        }

        console.log('Staff profiles data:', staffProfiles);

        // Step 3: Get user roles for these users using the security definer function
        const { data: currentUserInfo, error: userInfoError } = await supabase
          .rpc('get_current_user_info');

        if (userInfoError) {
          console.error('Error getting current user info:', userInfoError);
          throw userInfoError;
        }

        console.log('Current user info:', currentUserInfo);

        // For now, let's just get roles data directly without RLS issues
        // We'll use a different approach to get roles
        let rolesData = [];
        
        // Try to get roles using our security definer function
        try {
          const { data: currentUserRoles, error: rolesError } = await supabase
            .rpc('get_current_user_roles');
          
          if (!rolesError && currentUserRoles) {
            console.log('Current user roles:', currentUserRoles);
            
            // If current user is practice admin, try to get all roles
            const isPracticeAdmin = currentUserRoles.some(role => role.role === 'Practice Administrator');
            
            if (isPracticeAdmin) {
              const { data: allRoles, error: allRolesError } = await supabase
                .from('user_roles')
                .select('*')
                .eq('is_active', true);
              
              if (!allRolesError) {
                rolesData = allRoles || [];
              }
            }
          }
        } catch (rolesFetchError) {
          console.error('Error fetching roles:', rolesFetchError);
          // Continue without roles data
        }

        console.log('Roles data:', rolesData);

        // Step 4: Combine the data
        const staffData = usersData.map(user => {
          const userStaffProfile = staffProfiles?.find(profile => profile.user_id === user.id);
          const userRoles = rolesData.filter(role => role.user_id === user.id) || [];
          
          return {
            ...user,
            staff_profile: userStaffProfile || null,
            roles: userRoles
          };
        }) as StaffMember[];

        console.log('Final staff data:', staffData);
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