import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ClientSelectionSection from './appointment-form/ClientSelectionSection';
import AppointmentTypeSection from './appointment-form/AppointmentTypeSection';
import DateTimeSection from './appointment-form/DateTimeSection';
import LocationSection from './appointment-form/LocationSection';
import ClinicianSection from './appointment-form/ClinicianSection';
import ServiceCodeSection from './appointment-form/ServiceCodeSection';
import DurationSection from './appointment-form/DurationSection';
import FrequencySection from './appointment-form/FrequencySection';
import TelehealthSection from './appointment-form/TelehealthSection';
import AppointmentAlertSection from './appointment-form/AppointmentAlertSection';
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

  const { data: clinicians } = useQuery({
    queryKey: ['users-for-appointments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
          <AppointmentTypeSection
            value={formData.appointment_type}
            onChange={(value) => updateFormData('appointment_type', value)}
          />

          <ClientSelectionSection
            value={formData.client_id}
            onChange={(value) => updateFormData('client_id', value)}
            clients={clients}
          />

          <ClinicianSection
            value={formData.clinician_id}
            onChange={(value) => updateFormData('clinician_id', value)}
            clinicians={clinicians}
          />

          <LocationSection
            location={formData.location}
            roomNumber={formData.room_number}
            onLocationChange={(location) => updateFormData('location', location)}
            onRoomNumberChange={(roomNumber) => updateFormData('room_number', roomNumber)}
          />

          <TelehealthSection
            value={formData.use_telehealth}
            onChange={(value) => updateFormData('use_telehealth', value)}
          />

          <ServiceCodeSection
            value={formData.service_code}
            onChange={(value) => updateFormData('service_code', value)}
          />

          <DateTimeSection
            date={formData.date}
            startTime={formData.start_time}
            endTime={formData.end_time}
            onDateChange={(date) => updateFormData('date', date)}
            onStartTimeChange={(time) => updateFormData('start_time', time)}
            onEndTimeChange={(time) => updateFormData('end_time', time)}
          />

          <DurationSection
            value={formData.duration_minutes}
            onChange={(value) => updateFormData('duration_minutes', value)}
          />

          <FrequencySection
            value={formData.frequency}
            onChange={(value) => updateFormData('frequency', value)}
          />

          <AppointmentAlertSection
            value={formData.appointment_alert}
            onChange={(value) => updateFormData('appointment_alert', value)}
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

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createAppointmentMutation.isPending}>
              {createAppointmentMutation.isPending ? 'Creating...' : 'Save New Appointment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAppointmentModal;
