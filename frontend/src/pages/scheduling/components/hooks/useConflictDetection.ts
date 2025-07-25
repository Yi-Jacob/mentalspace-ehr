
import { useQuery } from '@tanstack/react-query';
import { schedulingService } from '@/services/schedulingService';

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
        const result = await schedulingService.checkConflicts({
          appointmentId,
          providerId,
          clientId,
          startTime,
          endTime,
        });

        return result;
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
