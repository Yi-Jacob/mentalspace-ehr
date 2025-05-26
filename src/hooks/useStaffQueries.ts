
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { StaffMember } from '@/types/staff';

export const useStaffQueries = () => {
  // Fetch all staff members
  const { data: staffMembers, isLoading, error } = useQuery({
    queryKey: ['staff-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          staff_profile:staff_profiles!inner(*),
          roles:user_roles(*)
        `)
        .eq('is_active', true);

      if (error) throw error;
      
      // Transform the data to match our expected structure
      return (data?.map(user => ({
        ...user,
        staff_profile: Array.isArray(user.staff_profile) ? user.staff_profile[0] : user.staff_profile,
        roles: user.roles || []
      })) || []) as StaffMember[];
    },
  });

  return {
    staffMembers,
    isLoading,
    error,
  };
};
