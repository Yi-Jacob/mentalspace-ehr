
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useAppointmentMutation } from './useAppointmentMutation';

interface AppointmentFormData {
  client_id: string;
  provider_id: string;
  appointment_type: 'initial_consultation' | 'follow_up' | 'therapy_session' | 'group_therapy' | 'assessment' | 'medication_management' | 'crisis_intervention' | 'other';
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  location: string;
  room_number: string;
  clinician_id: string;
  service_code: string;
  frequency: 'one_time' | 'weekly' | 'biweekly' | 'monthly';
  use_telehealth: boolean;
  appointment_alert: string;
  notes: string;
}

interface UseAppointmentFormOptions {
  onSuccess: () => void;
  selectedDate?: Date | null;
  selectedTime?: string | null;
}

export const useAppointmentForm = ({ onSuccess, selectedDate, selectedTime }: UseAppointmentFormOptions) => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    client_id: '',
    provider_id: '',
    appointment_type: 'therapy_session',
    title: '',
    date: format(selectedDate || new Date(), 'yyyy-MM-dd'),
    start_time: selectedTime || '09:00',
    end_time: '10:00',
    duration_minutes: 45,
    location: '',
    room_number: '',
    clinician_id: '',
    service_code: '',
    frequency: 'one_time',
    use_telehealth: false,
    appointment_alert: '',
    notes: ''
  });

  const mutation = useAppointmentMutation(onSuccess);

  // Update form data when selectedDate or selectedTime changes
  useEffect(() => {
    if (selectedDate) {
      setFormData(prev => ({ ...prev, date: format(selectedDate, 'yyyy-MM-dd') }));
    }
    if (selectedTime) {
      const startTime = format(new Date(`2000-01-01T${selectedTime}`), 'HH:mm');
      const endDate = new Date(`2000-01-01T${selectedTime}`);
      endDate.setMinutes(endDate.getMinutes() + formData.duration_minutes);
      const endTime = format(endDate, 'HH:mm');
      
      setFormData(prev => ({ 
        ...prev, 
        start_time: startTime,
        end_time: endTime
      }));
    }
  }, [selectedDate, selectedTime, formData.duration_minutes]);

  // Update end time when duration changes
  useEffect(() => {
    const startDate = new Date(`2000-01-01T${formData.start_time}`);
    startDate.setMinutes(startDate.getMinutes() + formData.duration_minutes);
    const endTime = format(startDate, 'HH:mm');
    setFormData(prev => ({ ...prev, end_time: endTime }));
  }, [formData.duration_minutes, formData.start_time]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const appointmentData = {
      client_id: formData.client_id,
      appointment_type: formData.appointment_type,
      title: formData.title || null,
      location: formData.location || null,
      room_number: formData.room_number || null,
      notes: formData.notes || null,
      date: new Date(formData.date),
      start_time: formData.start_time,
      end_time: formData.end_time,
    };

    await mutation.mutateAsync(appointmentData);
  };

  const resetForm = () => {
    setFormData({
      client_id: '',
      provider_id: '',
      appointment_type: 'therapy_session',
      title: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      start_time: '09:00',
      end_time: '09:45',
      duration_minutes: 45,
      location: '',
      room_number: '',
      clinician_id: '',
      service_code: '',
      frequency: 'one_time',
      use_telehealth: false,
      appointment_alert: '',
      notes: ''
    });
  };

  return {
    formData,
    setFormData,
    handleSubmit,
    isSubmitting: mutation.isPending,
    resetForm
  };
};
