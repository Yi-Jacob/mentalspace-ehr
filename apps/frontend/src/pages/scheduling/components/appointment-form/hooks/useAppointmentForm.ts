
import { useState } from 'react';
import { useAppointmentMutation } from './useAppointmentMutation';
import { useFormData } from './useFormData';
import { useFormValidation } from './useFormValidation';

interface UseAppointmentFormOptions {
  onSuccess: () => void;
  selectedDate?: Date | null;
  selectedTime?: string | null;
}

export const useAppointmentForm = ({ onSuccess, selectedDate, selectedTime }: UseAppointmentFormOptions) => {
  const { formData, setFormData, updateFormData, resetForm } = useFormData({ selectedDate, selectedTime });
  const { 
    errors, 
    validateForm, 
    clearErrors, 
    setFieldError
  } = useFormValidation();
  
  const [isValidating, setIsValidating] = useState(false);

  const mutation = useAppointmentMutation(onSuccess);

  const updateFormDataWithErrorClear = (field: keyof typeof formData, value: string | number | boolean | Date) => {
    updateFormData(field, value);
    // Clear field error if it exists
    if (errors[field as keyof typeof errors]) {
      setFieldError(field as keyof typeof errors, '');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);
    
    try {
      if (!validateForm(formData)) {
        setIsValidating(false);
        return;
      }

      // Prepare appointment data for the API
      const appointmentData = {
        clientId: formData.client_id,
        appointmentType: formData.appointment_type,
        title: formData.title || undefined,
        description: formData.description || undefined,
        startTime: new Date(`${formData.date}T${formData.start_time}`).toISOString(),
        duration: formData.duration_minutes,
        location: formData.location || undefined,
        roomNumber: formData.room_number || undefined,
        recurringRuleId: formData.recurring_rule_id || undefined,
      };

      await mutation.mutateAsync(appointmentData);
    } catch (error) {
      console.error('Form submission error:', error);
      setFieldError('general', 'Failed to create appointment. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const resetFormWithErrors = () => {
    resetForm();
    clearErrors();
  };

  return {
    formData,
    updateFormData: updateFormDataWithErrorClear,
    setFormData,
    handleSubmit,
    isSubmitting: mutation.isPending || isValidating,
    resetForm: resetFormWithErrors,
    errors,
    isValid: Object.keys(errors).length === 0,
    validateForm: () => validateForm(formData)
  };
};
