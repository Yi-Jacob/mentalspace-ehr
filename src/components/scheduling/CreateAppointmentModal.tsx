
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAppointmentForm } from './appointment-form/hooks/useAppointmentForm';
import { useConflictDetection } from './hooks/useConflictDetection';
import CreateAppointmentModalHeader from './appointment-form/CreateAppointmentModalHeader';
import CreateAppointmentFormContent from './appointment-form/CreateAppointmentFormContent';
import CreateAppointmentModalFooter from './appointment-form/CreateAppointmentModalFooter';
import ConflictAndErrorAlerts from './appointment-form/ConflictAndErrorAlerts';

interface CreateAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate?: Date | null;
  selectedTime?: string | null;
}

const CreateAppointmentModal: React.FC<CreateAppointmentModalProps> = ({
  open,
  onOpenChange,
  selectedDate,
  selectedTime
}) => {
  const { 
    formData, 
    updateFormData, 
    handleSubmit, 
    isSubmitting, 
    resetForm, 
    errors, 
    isValid 
  } = useAppointmentForm({
    onSuccess: () => {
      onOpenChange(false);
      resetForm();
    },
    selectedDate,
    selectedTime
  });

  const startDateTime = formData.date && formData.start_time 
    ? new Date(`${formData.date}T${formData.start_time}`).toISOString()
    : '';
  const endDateTime = formData.date && formData.end_time 
    ? new Date(`${formData.date}T${formData.end_time}`).toISOString()
    : '';

  const { data: conflictData, isLoading: isCheckingConflicts } = useConflictDetection({
    providerId: formData.provider_id || '',
    clientId: formData.client_id,
    startTime: startDateTime,
    endTime: endDateTime
  });

  const handleClose = () => {
    onOpenChange(false);
    resetForm();
  };

  const hasConflicts = conflictData?.hasConflicts;
  const canSubmit = !isSubmitting && !isCheckingConflicts && formData.client_id && !hasConflicts && isValid;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50/30"
        aria-describedby="create-appointment-description"
      >
        <CreateAppointmentModalHeader onClose={handleClose} />

        <div id="create-appointment-description" className="sr-only">
          Create a new appointment by filling out the form below. All required fields must be completed.
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <ConflictAndErrorAlerts
            generalError={errors.general}
            hasConflicts={hasConflicts}
            conflictData={conflictData}
            isCheckingConflicts={isCheckingConflicts}
            clientId={formData.client_id}
          />

          <CreateAppointmentFormContent
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />

          <CreateAppointmentModalFooter
            onClose={handleClose}
            onSubmit={handleSubmit}
            canSubmit={canSubmit}
            isSubmitting={isSubmitting}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAppointmentModal;
