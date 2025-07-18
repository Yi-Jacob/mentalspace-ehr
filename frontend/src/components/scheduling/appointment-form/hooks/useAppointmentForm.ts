
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
    isValidating, 
    setIsValidating, 
    validateForm, 
    clearFieldError, 
    setGeneralError, 
    clearAllErrors 
  } = useFormValidation();

  const mutation = useAppointmentMutation(onSuccess);

  const updateFormDataWithErrorClear = (field: keyof typeof formData, value: string | number | boolean | Date) => {
    updateFormData(field, value);
    clearFieldError(field as any);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);
    
    try {
      if (!validateForm(formData)) {
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
      setGeneralError('Failed to create appointment. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const resetFormWithErrors = () => {
    resetForm();
    clearAllErrors();
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
