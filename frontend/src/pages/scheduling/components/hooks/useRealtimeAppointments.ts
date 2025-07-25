
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export const useRealtimeAppointments = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log('Setting up polling for appointments');
    
    // Set up polling every 30 seconds to refresh appointment data
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointments-management'] });
    }, 30000);

    return () => {
      console.log('Cleaning up polling interval');
      clearInterval(interval);
    };
  }, [queryClient]);
};
