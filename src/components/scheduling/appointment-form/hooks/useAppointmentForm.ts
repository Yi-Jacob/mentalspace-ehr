
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useAppointmentMutation } from './useAppointmentMutation';

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

interface UseAppointmentFormOptions {
  onSuccess: () => void;
  selectedDate?: Date | null;
  selectedTime?: string | null;
}

interface FormErrors {
  client_id?: string;
  start_time?: string;
  end_time?: string;
  date?: string;
  general?: string;
}

export const useAppointmentForm = ({ onSuccess, selectedDate, selectedTime }: UseAppointmentFormOptions) => {
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

  const [errors, setErrors] = useState<FormErrors>({});
  const [isValidating, setIsValidating] = useState(false);

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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.client_id.trim()) {
      newErrors.client_id = 'Client selection is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.start_time) {
      newErrors.start_time = 'Start time is required';
    }

    if (!formData.end_time) {
      newErrors.end_time = 'End time is required';
    }

    // Validate that end time is after start time
    if (formData.start_time && formData.end_time) {
      const startTime = new Date(`2000-01-01T${formData.start_time}`);
      const endTime = new Date(`2000-01-01T${formData.end_time}`);
      
      if (endTime <= startTime) {
        newErrors.end_time = 'End time must be after start time';
      }
    }

    // Validate date is not in the past
    if (formData.date) {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = 'Cannot schedule appointments in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateFormData = (field: keyof AppointmentFormData, value: string | number | boolean | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear specific field error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);
    
    try {
      if (!validateForm()) {
        setIsValidating(false);
        return;
      }

      const appointmentData = {
        client_id: formData.client_id,
        appointment_type: formData.appointment_type,
        location: formData.location || null,
        room_number: formData.room_number || null,
        notes: formData.notes || null,
        date: new Date(formData.date),
        start_time: formData.start_time,
        end_time: formData.end_time,
      };

      await mutation.mutateAsync(appointmentData);
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ general: 'Failed to create appointment. Please try again.' });
    } finally {
      setIsValidating(false);
    }
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
    setErrors({});
  };

  return {
    formData,
    updateFormData,
    setFormData,
    handleSubmit,
    isSubmitting: mutation.isPending || isValidating,
    resetForm,
    errors,
    isValid: Object.keys(errors).length === 0,
    validateForm
  };
};
