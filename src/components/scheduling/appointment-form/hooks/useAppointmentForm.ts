
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface AppointmentFormData {
  client_id: string;
  appointment_type: 'initial_consultation' | 'follow_up' | 'therapy_session' | 'group_therapy' | 'assessment' | 'medication_management' | 'crisis_intervention' | 'other';
  title: string;
  date: Date;
  start_time: string;
  end_time: string;
  location: string;
  room_number: string;
  notes: string;
}

export const useAppointmentForm = (selectedDate?: Date | null, selectedTime?: string | null) => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    client_id: '',
    appointment_type: 'follow_up',
    title: '',
    date: new Date(),
    start_time: '09:00',
    end_time: '10:00',
    location: '',
    room_number: '',
    notes: ''
  });

  // Update form data when selectedDate or selectedTime changes
  useEffect(() => {
    if (selectedDate) {
      setFormData(prev => ({ ...prev, date: selectedDate }));
    }
    if (selectedTime) {
      const startTime = format(new Date(`2000-01-01T${selectedTime}`), 'HH:mm');
      const endDate = new Date(`2000-01-01T${selectedTime}`);
      endDate.setHours(endDate.getHours() + 1); // Default to 1 hour duration
      const endTime = format(endDate, 'HH:mm');
      
      setFormData(prev => ({ 
        ...prev, 
        start_time: startTime,
        end_time: endTime
      }));
    }
  }, [selectedDate, selectedTime]);

  const updateFormData = (field: keyof AppointmentFormData, value: string | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      client_id: '',
      appointment_type: 'follow_up',
      title: '',
      date: new Date(),
      start_time: '09:00',
      end_time: '10:00',
      location: '',
      room_number: '',
      notes: ''
    });
  };

  return {
    formData,
    updateFormData,
    resetForm
  };
};
