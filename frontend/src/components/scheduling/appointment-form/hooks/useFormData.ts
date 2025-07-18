
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface AppointmentFormData {
  client_id: string;
  provider_id: string;
  appointment_type: 'initial_consultation' | 'follow_up' | 'therapy_session' | 'group_therapy' | 'assessment' | 'medication_management' | 'crisis_intervention' | 'other';
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

interface UseFormDataOptions {
  selectedDate?: Date | null;
  selectedTime?: string | null;
}

export const useFormData = ({ selectedDate, selectedTime }: UseFormDataOptions) => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    client_id: '',
    provider_id: '',
    appointment_type: 'therapy_session',
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

  const updateFormData = (field: keyof AppointmentFormData, value: string | number | boolean | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      client_id: '',
      provider_id: '',
      appointment_type: 'therapy_session',
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
    updateFormData,
    resetForm
  };
};
