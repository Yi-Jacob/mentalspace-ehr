
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { schedulingService } from '@/services/schedulingService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

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
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentData: AppointmentData) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const startDateTime = new Date(appointmentData.date);
      const [startHour, startMinute] = appointmentData.start_time.split(':');
      startDateTime.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);

      const endDateTime = new Date(appointmentData.date);
      const [endHour, endMinute] = appointmentData.end_time.split(':');
      endDateTime.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

      return await schedulingService.createAppointment({
        clientId: appointmentData.client_id,
        providerId: user.id,
        appointmentType: appointmentData.appointment_type,
        title: appointmentData.title || undefined,
        location: appointmentData.location || undefined,
        roomNumber: appointmentData.room_number || undefined,
        notes: appointmentData.notes || undefined,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
      });
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
      console.error('Error creating appointment:', error);
      toast({
        title: 'Error',
        description: 'Failed to create appointment. Please try again.',
        variant: 'destructive',
      });
    },
  });
};
