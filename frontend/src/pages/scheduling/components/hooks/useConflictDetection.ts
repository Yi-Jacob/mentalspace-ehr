
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ConflictCheckParams {
  appointmentId?: string;
  providerId: string;
  clientId: string;
  startTime: string;
  endTime: string;
}

export const useConflictDetection = ({ 
  appointmentId, 
  providerId, 
  clientId, 
  startTime, 
  endTime 
}: ConflictCheckParams) => {
  return useQuery({
    queryKey: ['appointment-conflicts', { appointmentId, providerId, clientId, startTime, endTime }],
    queryFn: async () => {
      console.log('Checking for conflicts:', { appointmentId, providerId, clientId, startTime, endTime });
      
      if (!providerId || !clientId || !startTime || !endTime) {
        return { conflicts: [], hasConflicts: false };
      }

      // Validate date/time format
      try {
        new Date(startTime);
        new Date(endTime);
      } catch (error) {
        console.warn('Invalid date format for conflict detection:', error);
        return { conflicts: [], hasConflicts: false };
      }

      try {
        const { data: conflicts, error } = await supabase
          .from('appointments')
          .select(`
            id,
            title,
            start_time,
            end_time,
            status,
            client_id,
            provider_id,
            clients!client_id(first_name, last_name),
            users!provider_id(first_name, last_name)
          `)
          .or(`provider_id.eq.${providerId},client_id.eq.${clientId}`)
          .not('status', 'in', '(cancelled,no_show)')
          .gte('end_time', startTime)
          .lte('start_time', endTime)
          .neq('id', appointmentId || 'none');

        if (error) {
          console.error('Conflict check error:', error);
          // Don't throw error, just return no conflicts to avoid blocking the UI
          return { conflicts: [], hasConflicts: false };
        }

        const conflictDetails = conflicts?.map(conflict => {
          const isProviderConflict = conflict.provider_id === providerId;
          const isClientConflict = conflict.client_id === clientId;
          
          return {
            ...conflict,
            conflictType: isProviderConflict ? 'provider_overlap' : 'client_overlap',
            message: isProviderConflict 
              ? `Provider already has an appointment at this time`
              : `Client already has an appointment at this time`
          };
        }) || [];

        return {
          conflicts: conflictDetails,
          hasConflicts: conflictDetails.length > 0
        };
      } catch (error) {
        console.error('Unexpected error in conflict detection:', error);
        return { conflicts: [], hasConflicts: false };
      }
    },
    enabled: !!(providerId && clientId && startTime && endTime),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
