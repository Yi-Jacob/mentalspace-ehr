
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
import { Calendar, Clock, Sparkles } from 'lucide-react';

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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto border-0 shadow-2xl bg-gradient-to-br from-white to-blue-50/30">
        <DialogHeader className="pb-6 border-b border-gradient-to-r from-blue-200 to-purple-200">
          <DialogTitle className="flex items-center space-x-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
              <Sparkles className="h-6 w-6" />
            </div>
            <span>Create New Appointment</span>
          </DialogTitle>
          {selectedDate && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2 bg-blue-50 p-3 rounded-lg">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="font-medium">
                Scheduled for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                {selectedTime && (
                  <>
                    <Clock className="h-4 w-4 inline ml-2 mr-1 text-blue-500" />
                    {format(new Date(`2000-01-01T${selectedTime}`), 'h:mm a')}
                  </>
                )}
              </span>
            </div>
          )}
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-6">
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
              <Label htmlFor="title" className="text-sm font-semibold text-gray-700">Title (Optional)</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateFormData('title', e.target.value)}
                placeholder="Appointment title"
                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createAppointmentMutation.isPending}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:transform-none disabled:hover:scale-100"
            >
              {createAppointmentMutation.isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Creating...</span>
                </div>
              ) : (
                'Save New Appointment'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAppointmentModal;
