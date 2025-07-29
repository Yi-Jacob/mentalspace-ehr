
import React from 'react';
import { Dialog, DialogContent } from '@/components/basic/dialog';
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
        className="max-w-5xl h-[90vh] bg-white border-0 shadow-2xl rounded-2xl p-0 flex flex-col"
        aria-describedby="create-appointment-description"
      >
        {/* Modern gradient background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-white to-blue-50/60 pointer-events-none rounded-2xl" />
        
        {/* Fixed Header */}
        <div className="relative flex-shrink-0">
          <CreateAppointmentModalHeader onClose={handleClose} />
        </div>

        <div id="create-appointment-description" className="sr-only">
          Create a new appointment by filling out the form below. All required fields must be completed.
        </div>

        {/* Scrollable content area */}
        <div className="relative flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto px-8 pb-6">
            <form onSubmit={handleSubmit} className="space-y-8" noValidate>
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
            </form>
          </div>
        </div>

        {/* Fixed footer */}
        <div className="relative flex-shrink-0 border-t border-gray-200/60 bg-white/95 backdrop-blur-sm px-8">
          <CreateAppointmentModalFooter
            onClose={handleClose}
            onSubmit={handleSubmit}
            canSubmit={canSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAppointmentModal;
