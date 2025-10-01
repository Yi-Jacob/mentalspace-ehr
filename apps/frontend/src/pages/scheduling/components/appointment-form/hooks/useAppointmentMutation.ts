
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { schedulingService } from '@/services/schedulingService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { AppointmentTypeValue } from '@/types/scheduleType';

interface AppointmentData {
  clientId: string;
  appointmentType: AppointmentTypeValue;
  title?: string | null;
  description?: string | null;
  cptCode?: string | null;
  location?: string | null;
  roomNumber?: string | null;
  noteId?: string | null;
  isTelehealth?: boolean;
  startTime: string;
  duration: number;
  // Recurring appointment fields
  recurringPattern?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  recurringTimeSlots?: any[];
  isBusinessDayOnly?: boolean;
}

export const useAppointmentMutation = (onSuccess: () => void, waitlistEntryId?: string) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentData: AppointmentData) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const appointment = await schedulingService.createAppointment({
        clientId: appointmentData.clientId,
        appointmentType: appointmentData.appointmentType,
        cptCode: appointmentData.cptCode || undefined,
        title: appointmentData.title || undefined,
        description: appointmentData.description || undefined,
        location: appointmentData.location || undefined,
        roomNumber: appointmentData.roomNumber || undefined,
        noteId: appointmentData.noteId || undefined,
        isTelehealth: appointmentData.isTelehealth,
        startTime: appointmentData.startTime,
        duration: appointmentData.duration,
        recurringPattern: appointmentData.recurringPattern,
        recurringTimeSlots: appointmentData.recurringTimeSlots,
        isBusinessDayOnly: appointmentData.isBusinessDayOnly,
      });

      // If this appointment was created from a waitlist entry, fulfill the waitlist
      if (waitlistEntryId && appointment.id) {
        await schedulingService.fulfillWaitlistEntry(waitlistEntryId, appointment.id);
      }

      return appointment;
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
