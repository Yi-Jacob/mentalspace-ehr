
import { useState } from 'react';
import { useAppointmentMutation } from './useAppointmentMutation';
import { useFormData } from './useFormData';
import { useFormValidation } from './useFormValidation';

interface UseAppointmentFormOptions {
  onSuccess: () => void;
  selectedDate?: Date | null;
  selectedTime?: string | null;
  preselectedClientId?: string;
  defaultProviderId?: string;
  defaultIsTelehealth?: boolean;
  defaultNotes?: string;
  waitlistEntryId?: string;
}

export const useAppointmentForm = ({ 
  onSuccess, 
  selectedDate, 
  selectedTime, 
  preselectedClientId,
  defaultProviderId,
  defaultIsTelehealth,
  defaultNotes,
  waitlistEntryId
}: UseAppointmentFormOptions) => {
  const { formData, setFormData, updateFormData, resetForm } = useFormData({ 
    selectedDate, 
    selectedTime, 
    preselectedClientId,
    defaultProviderId,
    defaultIsTelehealth,
    defaultNotes
  });
  const { 
    errors, 
    validateForm, 
    clearErrors, 
    setFieldError
  } = useFormValidation();
  
  const [isValidating, setIsValidating] = useState(false);

  const mutation = useAppointmentMutation(onSuccess, waitlistEntryId);

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

      // Prepare recurring information if needed
      let recurringData = {};
      
      if (formData.recurring_period !== 'none' && formData.recurring_period !== 'custom') {
        // Parse date and time as local to avoid timezone issues
        const dateParts = formData.date.split('-');
        const timeParts = formData.start_time.split(':');
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1; // months are 0-indexed
        const day = parseInt(dateParts[2]);
        const hours = parseInt(timeParts[0]);
        const minutes = parseInt(timeParts[1]);
        const startDate = new Date(year, month, day, hours, minutes);
        
        // For recurring patterns, send the pattern and timeslots
        recurringData = {
          recurringPattern: formData.recurring_period,
          recurringTimeSlots: [{
            time: formData.start_time,
            ...(formData.recurring_period === 'weekly' && { dayOfWeek: startDate.getDay() }),
            ...(formData.recurring_period === 'monthly' && { dayOfMonth: startDate.getDate() }),
            ...(formData.recurring_period === 'yearly' && { 
              month: startDate.getMonth() + 1,
              dayOfMonth: startDate.getDate()
            })
          }],
          isBusinessDayOnly: true
        };
      } else if (formData.recurring_period === 'custom' && (formData as any)._recurringData) {
        try {
          // Parse the stored recurring data
          const parsedRecurringData = JSON.parse((formData as any)._recurringData);
          recurringData = {
            recurringPattern: parsedRecurringData.recurringPattern,
            recurringTimeSlots: parsedRecurringData.recurringTimeSlots,
            isBusinessDayOnly: parsedRecurringData.isBusinessDayOnly
          };
        } catch (error) {
          console.error('Error parsing recurring data:', error);
        }
      }

      // Prepare appointment data for the API
      const appointmentData = {
        clientId: formData.client_id,
        appointmentType: formData.appointment_type,
        cptCode: formData.cptCode || undefined,
        title: formData.title || undefined,
        description: formData.description || undefined,
        startTime: (() => {
          // Parse date and time as local to avoid timezone issues
          const dateParts = formData.date.split('-');
          const timeParts = formData.start_time.split(':');
          const year = parseInt(dateParts[0]);
          const month = parseInt(dateParts[1]) - 1; // months are 0-indexed
          const day = parseInt(dateParts[2]);
          const hours = parseInt(timeParts[0]);
          const minutes = parseInt(timeParts[1]);
          return new Date(year, month, day, hours, minutes).toISOString();
        })(),
        duration: formData.duration_minutes,
        location: formData.location || undefined,
        roomNumber: formData.room_number || undefined,
        noteId: formData.noteId || undefined,
        isTelehealth: formData.isTelehealth,
        hasSession: formData.hasSession || false,
        ...recurringData
      };
      
      // Send to backend - the backend will handle creating all recurring appointments
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
