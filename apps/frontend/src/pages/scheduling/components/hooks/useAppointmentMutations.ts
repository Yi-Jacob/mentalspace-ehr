
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { schedulingService } from '@/services/schedulingService';
import { useToast } from '@/hooks/use-toast';

interface UpdateAppointmentData {
  id: string;
  title?: string;
  start_time?: string;
  end_time?: string;
  status?: string;
  location?: string;
  room_number?: string;
  notes?: string;
  appointment_type?: string;
}

export const useAppointmentMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateAppointment = useMutation({
    mutationFn: async (data: UpdateAppointmentData) => {
      console.log('Updating appointment:', data);
      
      // Validate required fields
      if (!data.id) {
        throw new Error('Appointment ID is required');
      }

      const updateData: any = {
        title: data.title,
        location: data.location,
        room_number: data.room_number,
        notes: data.notes,
        updated_at: new Date().toISOString()
      };

      // Only include these fields if they're provided and valid
      if (data.start_time) {
        updateData.start_time = data.start_time;
      }
      
      if (data.end_time) {
        updateData.end_time = data.end_time;
      }

      if (data.status) {
        const validStatuses = ['scheduled', 'confirmed', 'checked_in', 'in_progress', 'completed', 'cancelled', 'no_show', 'rescheduled'];
        if (validStatuses.includes(data.status)) {
          updateData.status = data.status;
        } else {
          throw new Error(`Invalid status: ${data.status}`);
        }
      }

      if (data.appointment_type) {
        const validTypes = ['initial_consultation', 'follow_up', 'therapy_session', 'group_therapy', 'assessment', 'medication_management', 'crisis_intervention', 'other'];
        if (validTypes.includes(data.appointment_type)) {
          updateData.appointment_type = data.appointment_type;
        } else {
          throw new Error(`Invalid appointment type: ${data.appointment_type}`);
        }
      }

      return await schedulingService.updateAppointment(data.id, updateData);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Appointment updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointments-management'] });
    },
    onError: (error: any) => {
      console.error('Error updating appointment:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update appointment',
        variant: 'destructive',
      });
    },
  });

  const deleteAppointment = useMutation({
    mutationFn: async (appointmentId: string) => {
      console.log('Deleting appointment:', appointmentId);
      
      if (!appointmentId) {
        throw new Error('Appointment ID is required');
      }

      await schedulingService.deleteAppointment(appointmentId);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Appointment deleted successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointments-management'] });
    },
    onError: (error: any) => {
      console.error('Error deleting appointment:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete appointment',
        variant: 'destructive',
      });
    },
  });

  const updateAppointmentStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      console.log('Updating appointment status:', { id, status });
      
      if (!id || !status) {
        throw new Error('Appointment ID and status are required');
      }

      const validStatuses = ['scheduled', 'confirmed', 'checked_in', 'in_progress', 'completed', 'cancelled', 'no_show', 'rescheduled'];
      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status: ${status}`);
      }

      const updateData: any = { 
        status,
        updated_at: new Date().toISOString()
      };

      // Add timestamp fields for specific statuses
      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }
      
      if (status === 'checked_in') {
        updateData.checked_in_at = new Date().toISOString();
      }

      if (status === 'cancelled') {
        updateData.cancelled_at = new Date().toISOString();
      }

      return await schedulingService.updateAppointmentStatus(id, status);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Appointment status updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointments-management'] });
    },
    onError: (error: any) => {
      console.error('Error updating appointment status:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update appointment status',
        variant: 'destructive',
      });
    },
  });

  return {
    updateAppointment,
    deleteAppointment,
    updateAppointmentStatus,
  };
};
