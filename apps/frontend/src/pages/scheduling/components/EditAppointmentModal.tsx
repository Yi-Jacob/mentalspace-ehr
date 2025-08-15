
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/basic/dialog';
import { format } from 'date-fns';
import { useAppointmentMutations } from './hooks/useAppointmentMutations';
import { useConflictDetection } from './hooks/useConflictDetection';
import EditAppointmentModalHeader from './edit-appointment-modal/EditAppointmentModalHeader';
import ClientInfoDisplay from './edit-appointment-modal/ClientInfoDisplay';
import ConflictWarning from './edit-appointment-modal/ConflictWarning';
import BasicInfoSection from './edit-appointment-modal/BasicInfoSection';
import DateTimeSection from './edit-appointment-modal/DateTimeSection';
import LocationSection from './edit-appointment-modal/LocationSection';
import NotesSection from './edit-appointment-modal/NotesSection';
import ActionButtons from './edit-appointment-modal/ActionButtons';
import { AppointmentTypeValue } from '@/types/scheduleType';

interface Appointment {
  id: string;
  title?: string;
  client_id: string;
  provider_id: string;
  appointment_type: AppointmentTypeValue;
  start_time: string;
  end_time: string;
  status: string;
  location?: string;
  room_number?: string;
  notes?: string;
  clients?: {
    first_name: string;
    last_name: string;
  };
  users?: {
    first_name: string;
    last_name: string;
  };
}

interface EditAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: {
    id: string;
    client_id: string;
    appointment_type: AppointmentTypeValue;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    status: string;
    location?: string;
    room_number?: string;
    notes?: string;
  } | null;
}

const EditAppointmentModal: React.FC<EditAppointmentModalProps> = ({
  open,
  onOpenChange,
  appointment
}) => {
  const [formData, setFormData] = useState({
    title: '',
    appointment_type: '',
    status: '',
    location: '',
    room_number: '',
    notes: '',
    date: '',
    start_time: '',
    end_time: ''
  });

  const { updateAppointment } = useAppointmentMutations();

  useEffect(() => {
    if (appointment) {
      const startDate = new Date(appointment.start_time);
      const endDate = new Date(appointment.end_time);
      
      setFormData({
        title: appointment.title || '',
        appointment_type: appointment.appointment_type,
        status: appointment.status,
        location: appointment.location || '',
        room_number: appointment.room_number || '',
        notes: appointment.notes || '',
        date: format(startDate, 'yyyy-MM-dd'),
        start_time: format(startDate, 'HH:mm'),
        end_time: format(endDate, 'HH:mm')
      });
    }
  }, [appointment]);

  const startDateTime = formData.date && formData.start_time 
    ? new Date(`${formData.date}T${formData.start_time}`).toISOString()
    : '';
  const endDateTime = formData.date && formData.end_time 
    ? new Date(`${formData.date}T${formData.end_time}`).toISOString()
    : '';

  const { data: conflictData } = useConflictDetection({
    appointmentId: appointment?.id,
    providerId: appointment?.provider_id || '',
    clientId: appointment?.client_id || '',
    startTime: startDateTime,
    endTime: endDateTime
  });

  const handleFormDataChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    if (!appointment) return;

    try {
      await updateAppointment.mutateAsync({
        id: appointment.id,
        title: formData.title,
        appointment_type: formData.appointment_type as any,
        status: formData.status as any,
        location: formData.location,
        room_number: formData.room_number,
        notes: formData.notes,
        start_time: startDateTime,
        end_time: endDateTime
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const clientName = appointment?.clients 
    ? `${appointment.clients.first_name} ${appointment.clients.last_name}`
    : 'Unknown Client';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50/30">
        <EditAppointmentModalHeader />

        <div className="space-y-6">
          <ClientInfoDisplay clientName={clientName} />

          <ConflictWarning conflictData={conflictData} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BasicInfoSection
              formData={formData}
              onFormDataChange={handleFormDataChange}
            />

            <DateTimeSection
              formData={formData}
              onFormDataChange={handleFormDataChange}
            />

            <LocationSection
              formData={formData}
              onFormDataChange={handleFormDataChange}
            />

            <NotesSection
              notes={formData.notes}
              onNotesChange={(notes) => handleFormDataChange('notes', notes)}
            />
          </div>

          <ActionButtons
            onCancel={() => onOpenChange(false)}
            onSave={handleSave}
            isSaving={updateAppointment.isPending}
            hasConflicts={conflictData?.hasConflicts || false}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditAppointmentModal;
