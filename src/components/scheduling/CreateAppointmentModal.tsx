
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ClientSelectionSection from './appointment-form/ClientSelectionSection';
import AppointmentTypeSection from './appointment-form/AppointmentTypeSection';
import DateTimeSection from './appointment-form/DateTimeSection';
import LocationSection from './appointment-form/LocationSection';
import { useAppointmentForm } from './appointment-form/hooks/useAppointmentForm';
import { useAppointmentMutation } from './appointment-form/hooks/useAppointmentMutation';

interface CreateAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate?: Date | null;
  selectedTime?: string | null;
}

const CreateAppointmentModal: React.FC<CreateAppointmentModalProps> = ({
  open,
  onOpenChange,
  selectedDate,
  selectedTime
}) => {
  const { toast } = useToast();
  const { formData, updateFormData, resetForm } = useAppointmentForm(selectedDate, selectedTime);

  const { data: clients } = useQuery({
    queryKey: ['clients-for-appointments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('id, first_name, last_name')
        .eq('is_active', true)
        .order('last_name');
      
      if (error) throw error;
      return data;
    },
  });

  const handleSuccess = () => {
    onOpenChange(false);
    resetForm();
  };

  const createAppointmentMutation = useAppointmentMutation(handleSuccess);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.client_id) {
      toast({
        title: 'Validation Error',
        description: 'Please select a client',
        variant: 'destructive',
      });
      return;
    }

    createAppointmentMutation.mutate({
      client_id: formData.client_id,
      appointment_type: formData.appointment_type,
      title: formData.title || null,
      location: formData.location || null,
      room_number: formData.room_number || null,
      notes: formData.notes || null,
      date: formData.date,
      start_time: formData.start_time,
      end_time: formData.end_time
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Appointment</DialogTitle>
          {selectedDate && (
            <p className="text-sm text-gray-600">
              Scheduled for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              {selectedTime && ` at ${format(new Date(`2000-01-01T${selectedTime}`), 'h:mm a')}`}
            </p>
          )}
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <ClientSelectionSection
            value={formData.client_id}
            onChange={(value) => updateFormData('client_id', value)}
            clients={clients}
          />

          <AppointmentTypeSection
            value={formData.appointment_type}
            onChange={(value) => updateFormData('appointment_type', value)}
          />

          <div className="space-y-2">
            <Label htmlFor="title">Title (Optional)</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => updateFormData('title', e.target.value)}
              placeholder="Appointment title"
            />
          </div>

          <DateTimeSection
            date={formData.date}
            startTime={formData.start_time}
            endTime={formData.end_time}
            onDateChange={(date) => updateFormData('date', date)}
            onStartTimeChange={(time) => updateFormData('start_time', time)}
            onEndTimeChange={(time) => updateFormData('end_time', time)}
          />

          <LocationSection
            location={formData.location}
            roomNumber={formData.room_number}
            onLocationChange={(location) => updateFormData('location', location)}
            onRoomNumberChange={(roomNumber) => updateFormData('room_number', roomNumber)}
          />

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => updateFormData('notes', e.target.value)}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createAppointmentMutation.isPending}>
              {createAppointmentMutation.isPending ? 'Creating...' : 'Create Appointment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAppointmentModal;
