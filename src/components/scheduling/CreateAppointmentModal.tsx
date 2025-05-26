
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, AlertTriangle, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAppointmentForm } from './appointment-form/hooks/useAppointmentForm';
import { useConflictDetection } from './hooks/useConflictDetection';
import ClientSelectionSection from './appointment-form/ClientSelectionSection';
import DateTimeSection from './appointment-form/DateTimeSection';
import AppointmentTypeSection from './appointment-form/AppointmentTypeSection';
import LocationSection from './appointment-form/LocationSection';
import { format } from 'date-fns';

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
        className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50/30"
        aria-describedby="create-appointment-description"
      >
        <DialogHeader className="pb-6">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center space-x-3 text-2xl font-bold">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg text-white">
                <Plus className="h-6 w-6" />
              </div>
              <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Create New Appointment
              </span>
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div id="create-appointment-description" className="sr-only">
          Create a new appointment by filling out the form below. All required fields must be completed.
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* General Error Alert */}
          {errors.general && (
            <Alert className="border-red-200 bg-gradient-to-r from-red-50 to-pink-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {errors.general}
              </AlertDescription>
            </Alert>
          )}

          {/* Conflict Warning */}
          {hasConflicts && (
            <Alert className="border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Scheduling Conflict Detected:</strong>
                <ul className="mt-2 space-y-1">
                  {conflictData.conflicts.map((conflict, index) => (
                    <li key={index} className="text-sm">
                      • {conflict.message} ({format(new Date(conflict.start_time), 'HH:mm')} - {format(new Date(conflict.end_time), 'HH:mm')})
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Loading State for Conflict Check */}
          {isCheckingConflicts && formData.client_id && (
            <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                <span className="text-blue-800 text-sm">Checking for scheduling conflicts...</span>
              </div>
            </Alert>
          )}

          <ClientSelectionSection 
            value={formData.client_id}
            onChange={(value) => updateFormData('client_id', value)}
            error={errors.client_id}
          />

          <AppointmentTypeSection
            appointment_type={formData.appointment_type}
            title={formData.title}
            notes={formData.notes}
            onAppointmentTypeChange={(value) => updateFormData('appointment_type', value)}
            onTitleChange={(value) => updateFormData('title', value)}
            onNotesChange={(value) => updateFormData('notes', value)}
          />

          <DateTimeSection
            date={new Date(formData.date)}
            startTime={formData.start_time}
            endTime={formData.end_time}
            onDateChange={(value) => updateFormData('date', format(value, 'yyyy-MM-dd'))}
            onStartTimeChange={(value) => updateFormData('start_time', value)}
            onEndTimeChange={(value) => updateFormData('end_time', value)}
            errors={{
              date: errors.date,
              start_time: errors.start_time,
              end_time: errors.end_time
            }}
          />

          <LocationSection
            location={formData.location}
            roomNumber={formData.room_number}
            onLocationChange={(value) => updateFormData('location', value)}
            onRoomNumberChange={(value) => updateFormData('room_number', value)}
          />

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!canSubmit}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Calendar className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Creating...' : 'Create Appointment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAppointmentModal;
