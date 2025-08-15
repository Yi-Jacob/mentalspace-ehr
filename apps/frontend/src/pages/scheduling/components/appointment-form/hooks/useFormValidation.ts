
import { useState } from 'react';
import { AppointmentTypeValue } from '@/types/scheduleType';

interface FormErrors {
  client_id?: string;
  start_time?: string;
  date?: string;
  title?: string;
  description?: string;
  general?: string;
}

interface AppointmentFormData {
  client_id: string;
  appointment_type: AppointmentTypeValue;
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

export const useFormValidation = () => {
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (formData: AppointmentFormData): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.client_id.trim()) {
      newErrors.client_id = 'Client selection is required';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    if (!formData.start_time) {
      newErrors.start_time = 'Start time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearErrors = () => {
    setErrors({});
  };

  const setFieldError = (field: keyof FormErrors, message: string) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  };

  const clearFieldError = (field: keyof FormErrors) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  return {
    errors,
    validateForm,
    clearErrors,
    setFieldError,
    clearFieldError,
  };
};
