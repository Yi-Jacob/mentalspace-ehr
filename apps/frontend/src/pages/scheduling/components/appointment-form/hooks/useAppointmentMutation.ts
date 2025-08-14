
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { schedulingService } from '@/services/schedulingService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface AppointmentData {
  clientId: string;
  appointmentType: 'initial_consultation' | 'follow_up' | 'therapy_session' | 'group_therapy' | 'assessment' | 'medication_management' | 'crisis_intervention' | 'other';
  title?: string | null;
  description?: string | null;
  location?: string | null;
  roomNumber?: string | null;
  startTime: string;
  duration: number;
  recurringRuleId?: string | null;
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

      return await schedulingService.createAppointment({
        clientId: appointmentData.clientId,
        providerId: user.id,
        appointmentType: appointmentData.appointmentType,
        title: appointmentData.title || undefined,
        description: appointmentData.description || undefined,
        location: appointmentData.location || undefined,
        roomNumber: appointmentData.roomNumber || undefined,
        startTime: appointmentData.startTime,
        duration: appointmentData.duration,
        recurringRuleId: appointmentData.recurringRuleId || undefined,
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
