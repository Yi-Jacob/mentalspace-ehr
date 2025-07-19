
import { useState } from 'react';

interface FormErrors {
  client_id?: string;
  start_time?: string;
  end_time?: string;
  date?: string;
  general?: string;
}

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

export const useFormValidation = () => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [isValidating, setIsValidating] = useState(false);

  const validateForm = (formData: AppointmentFormData): boolean => {
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

  const clearFieldError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const setGeneralError = (message: string) => {
    setErrors(prev => ({ ...prev, general: message }));
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  return {
    errors,
    isValidating,
    setIsValidating,
    validateForm,
    clearFieldError,
    setGeneralError,
    clearAllErrors
  };
};
