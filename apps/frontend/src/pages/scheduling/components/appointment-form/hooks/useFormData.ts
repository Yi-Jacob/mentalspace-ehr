
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface AppointmentFormData {
  client_id: string;
  appointment_type: 'initial_consultation' | 'follow_up' | 'therapy_session' | 'group_therapy' | 'assessment' | 'medication_management' | 'crisis_intervention' | 'other';
  title: string;
  description: string;
  date: string;
  start_time: string;
  duration_minutes: number;
  location: string;
  room_number: string;
  recurring_period: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  recurring_rule_id?: string;
}

interface UseFormDataOptions {
  selectedDate?: Date | null;
  selectedTime?: string | null;
}

export const useFormData = ({ selectedDate, selectedTime }: UseFormDataOptions) => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    client_id: '',
    appointment_type: 'therapy_session',
    title: '',
    description: '',
    date: format(selectedDate || new Date(), 'yyyy-MM-dd'),
    start_time: selectedTime || '09:00',
    duration_minutes: 60,
    location: '',
    room_number: '',
    recurring_period: 'none'
  });

  // Update form data when selectedDate or selectedTime changes
  useEffect(() => {
    if (selectedDate) {
      setFormData(prev => ({ ...prev, date: format(selectedDate, 'yyyy-MM-dd') }));
    }
    if (selectedTime) {
      setFormData(prev => ({ 
        ...prev, 
        start_time: selectedTime
      }));
    }
  }, [selectedDate, selectedTime]);

  const updateFormData = (field: keyof AppointmentFormData, value: string | number | boolean | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      client_id: '',
      appointment_type: 'therapy_session',
      title: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      start_time: '09:00',
      duration_minutes: 60,
      location: '',
      room_number: '',
      recurring_period: 'none'
    });
  };

  return {
    formData,
    setFormData,
    updateFormData,
    resetForm
  };
};
