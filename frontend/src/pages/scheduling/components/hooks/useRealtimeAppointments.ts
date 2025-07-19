
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRealtimeAppointments = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    console.log('Setting up realtime subscription for appointments');
    
    const channel = supabase
      .channel('appointments-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'appointments'
        },
        (payload) => {
          console.log('New appointment created:', payload);
          queryClient.invalidateQueries({ queryKey: ['appointments'] });
          queryClient.invalidateQueries({ queryKey: ['appointments-management'] });
          
          toast({
            title: 'New Appointment',
            description: 'A new appointment has been created',
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'appointments'
        },
        (payload) => {
          console.log('Appointment updated:', payload);
          queryClient.invalidateQueries({ queryKey: ['appointments'] });
          queryClient.invalidateQueries({ queryKey: ['appointments-management'] });
          
          toast({
            title: 'Appointment Updated',
            description: 'An appointment has been updated',
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'appointments'
        },
        (payload) => {
          console.log('Appointment deleted:', payload);
          queryClient.invalidateQueries({ queryKey: ['appointments'] });
          queryClient.invalidateQueries({ queryKey: ['appointments-management'] });
          
          toast({
            title: 'Appointment Deleted',
            description: 'An appointment has been deleted',
          });
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    return () => {
      console.log('Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);
};
