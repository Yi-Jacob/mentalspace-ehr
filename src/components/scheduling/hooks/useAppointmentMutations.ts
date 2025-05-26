
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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
      const { data: result, error } = await supabase
        .from('appointments')
        .update({
          title: data.title,
          start_time: data.start_time,
          end_time: data.end_time,
          status: data.status,
          location: data.location,
          room_number: data.room_number,
          notes: data.notes,
          appointment_type: data.appointment_type,
          updated_at: new Date().toISOString()
        })
        .eq('id', data.id)
        .select()
        .single();

      if (error) {
        console.error('Update error:', error);
        throw error;
      }
      return result;
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
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointmentId);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }
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
      const { data, error } = await supabase
        .from('appointments')
        .update({ 
          status,
          updated_at: new Date().toISOString(),
          ...(status === 'completed' && { completed_at: new Date().toISOString() }),
          ...(status === 'checked_in' && { checked_in_at: new Date().toISOString() })
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Status update error:', error);
        throw error;
      }
      return data;
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
