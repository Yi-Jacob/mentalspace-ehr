
import React from 'react';
import { Dialog, DialogContent } from '@/components/basic/dialog';
import PageHeader from '@/components/basic/PageHeader';
import { useAppointmentForm } from './appointment-form/hooks/useAppointmentForm';
import { useConflictDetection } from './hooks/useConflictDetection';
import CreateAppointmentFormContent from './appointment-form/CreateAppointmentFormContent';
import CreateAppointmentModalFooter from './appointment-form/CreateAppointmentModalFooter';
import ConflictAndErrorAlerts from './appointment-form/ConflictAndErrorAlerts';
import { Calendar } from 'lucide-react';

interface CreateAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate?: Date | null;
  selectedTime?: string | null;
  preselectedClientId?: string;
  preselectedClientName?: string;
  defaultClientId?: string;
  defaultProviderId?: string;
  defaultIsTelehealth?: boolean;
  defaultNotes?: string;
  waitlistEntryId?: string;
  onAppointmentCreated?: () => void;
}

const CreateAppointmentModal: React.FC<CreateAppointmentModalProps> = ({
  open,
  onOpenChange,
  selectedDate,
  selectedTime,
  preselectedClientId,
  preselectedClientName,
  defaultClientId,
  defaultProviderId,
  defaultIsTelehealth,
  defaultNotes,
  waitlistEntryId,
  onAppointmentCreated
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
      onAppointmentCreated?.();
    },
    selectedDate,
    selectedTime,
    preselectedClientId: defaultClientId || preselectedClientId,
    defaultProviderId,
    defaultIsTelehealth,
    defaultNotes,
    waitlistEntryId
  });

  const startDateTime = formData.date && formData.start_time 
    ? (() => {
        // Parse date and time as local to avoid timezone issues
        const dateParts = formData.date.split('-');
        const timeParts = formData.start_time.split(':');
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1; // months are 0-indexed
        const day = parseInt(dateParts[2]);
        const hours = parseInt(timeParts[0]);
        const minutes = parseInt(timeParts[1]);
        return new Date(year, month, day, hours, minutes).toISOString();
      })()
    : '';
  const endDateTime = formData.date && formData.start_time && formData.duration_minutes
    ? (() => {
        // Parse date and time as local to avoid timezone issues
        const dateParts = formData.date.split('-');
        const timeParts = formData.start_time.split(':');
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1; // months are 0-indexed
        const day = parseInt(dateParts[2]);
        const hours = parseInt(timeParts[0]);
        const minutes = parseInt(timeParts[1]);
        const startDate = new Date(year, month, day, hours, minutes);
        return new Date(startDate.getTime() + formData.duration_minutes * 60000).toISOString();
      })()
    : '';

  const { data: conflictData, isLoading: isCheckingConflicts } = useConflictDetection({
    providerId: '', // Will be set from JWT token in backend
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
        className="max-w-6xl h-[95vh] bg-white border-0 shadow-2xl rounded-2xl p-0 flex flex-col"
        aria-describedby="create-appointment-description"
      >
        {/* Modern gradient background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-white to-blue-50/60 pointer-events-none rounded-2xl" />
        
        {/* Page Header */}
        <div className="relative flex-shrink-0 px-8 pt-6">
          <PageHeader
            icon={Calendar}
            title="Create New Appointment"
            description="Schedule a new appointment with your client. Fill in the details below to get started."
            className="mb-0"
          />
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
                preselectedClientId={preselectedClientId}
                preselectedClientName={preselectedClientName}
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
