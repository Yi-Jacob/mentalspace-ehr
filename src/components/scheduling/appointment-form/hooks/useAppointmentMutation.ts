
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AppointmentData {
  client_id: string;
  appointment_type: 'initial_consultation' | 'follow_up' | 'therapy_session' | 'group_therapy' | 'assessment' | 'medication_management' | 'crisis_intervention' | 'other';
  title?: string | null;
  location?: string | null;
  room_number?: string | null;
  notes?: string | null;
  date: Date;
  start_time: string;
  end_time: string;
}

export const useAppointmentMutation = (onSuccess: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentData: AppointmentData) => {
      const startDateTime = new Date(appointmentData.date);
      const [startHour, startMinute] = appointmentData.start_time.split(':');
      startDateTime.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);

      const endDateTime = new Date(appointmentData.date);
      const [endHour, endMinute] = appointmentData.end_time.split(':');
      endDateTime.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

      const { data, error } = await supabase
        .from('appointments')
        .insert({
          client_id: appointmentData.client_id,
          appointment_type: appointmentData.appointment_type as 'initial_consultation' | 'follow_up' | 'therapy_session' | 'group_therapy' | 'assessment' | 'medication_management' | 'crisis_intervention' | 'other',
          title: appointmentData.title || null,
          location: appointmentData.location || null,
          room_number: appointmentData.room_number || null,
          notes: appointmentData.notes || null,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          status: 'scheduled' as 'scheduled' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Appointment created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create appointment',
        variant: 'destructive',
      });
      console.error('Error creating appointment:', error);
    },
  });
};
