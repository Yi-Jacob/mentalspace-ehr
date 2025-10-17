
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { schedulingService } from '@/services/schedulingService';
import { useToast } from '@/hooks/use-toast';
import { AppointmentType, AppointmentStatus } from '@/types/enums/scheduleEnum';
import { AppointmentTypeValue, AppointmentStatusValue } from '@/types/scheduleType';

interface UpdateAppointmentData {
  id: string;
  appointment_type?: AppointmentTypeValue;
  title?: string;
  description?: string;
  cptCode?: string;
  start_time?: string;
  end_time?: string;
  status?: AppointmentStatusValue;
  client_id?: string;
  location?: string;
  room_number?: string;
  noteId?: string;
  isTelehealth?: boolean;
  duration?: number;
  // Recurring appointment fields
  recurringPattern?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  recurringTimeSlots?: Array<{
    time: string;
    dayOfWeek?: number;
    dayOfMonth?: number;
    month?: number;
  }>;
  isBusinessDayOnly?: boolean;
  recurringEndDate?: string;
}

export const useAppointmentMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateAppointment = useMutation({
    mutationFn: async (data: UpdateAppointmentData) => {
      
      // Validate required fields
      if (!data.id) {
        throw new Error('Appointment ID is required');
      }

      // Build the complete update data object with all fields
      const updateData: any = {
        title: data.title,
        description: data.description,
        appointmentType: data.appointment_type,
        cptCode: data.cptCode,
        status: data.status,
        location: data.location,
        roomNumber: data.room_number,
        noteId: data.noteId,
        isTelehealth: data.isTelehealth,
        startTime: data.start_time,
        duration: data.duration,
        clientId: data.client_id
      };

      // Handle recurring appointment fields - send them together
      if (data.recurringPattern && data.recurringTimeSlots) {
        updateData.recurringPattern = data.recurringPattern;
        updateData.recurringTimeSlots = data.recurringTimeSlots;
        updateData.isBusinessDayOnly = data.isBusinessDayOnly ?? true;
        updateData.recurringEndDate = data.recurringEndDate;
      }

      // Remove undefined fields to avoid sending them
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      return await schedulingService.updateAppointment(data.id, updateData);
    },
    onSuccess: (data: any) => {
      // Check if this was a recurring rule update
      if (data?.updatedRecurringRule) {
        toast({
          title: 'Recurring Rule Updated',
          description: data.message || 'Recurring rule updated successfully',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Appointment updated successfully',
        });
      }
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
    mutationFn: async ({ id, status }: { id: string; status: AppointmentStatusValue }) => {
      
      if (!id || !status) {
        throw new Error('Appointment ID and status are required');
      }

      const validStatuses = Object.values(AppointmentStatus);
      if (!validStatuses.includes(status as any)) {
        throw new Error(`Invalid status: ${status}`);
      }

      const updateData: any = { 
        status,
        updated_at: new Date().toISOString()
      };

      // Add timestamp fields for specific statuses
      if (status === AppointmentStatus.COMPLETED) {
        updateData.completed_at = new Date().toISOString();
      }

      if (status === AppointmentStatus.CANCELLED) {
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
