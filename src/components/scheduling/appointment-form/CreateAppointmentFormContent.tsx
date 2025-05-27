
import React from 'react';
import ClientSelectionSection from './ClientSelectionSection';
import DateTimeSection from './DateTimeSection';
import AppointmentTypeSection from './AppointmentTypeSection';
import LocationSection from './LocationSection';
import ClinicianSection from './ClinicianSection';
import ServiceCodeSection from './ServiceCodeSection';
import DurationSection from './DurationSection';
import FrequencySection from './FrequencySection';
import TelehealthSection from './TelehealthSection';
import AppointmentAlertSection from './AppointmentAlertSection';
import { format } from 'date-fns';

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

interface FormErrors {
  client_id?: string;
  start_time?: string;
  end_time?: string;
  date?: string;
  general?: string;
}

interface CreateAppointmentFormContentProps {
  formData: AppointmentFormData;
  updateFormData: (field: keyof AppointmentFormData, value: string | number | boolean | Date) => void;
  errors: FormErrors;
}

const CreateAppointmentFormContent: React.FC<CreateAppointmentFormContentProps> = ({
  formData,
  updateFormData,
  errors
}) => {
  return (
    <div className="space-y-6">
      <ClientSelectionSection 
        value={formData.client_id}
        onChange={(value) => updateFormData('client_id', value)}
        error={errors.client_id}
      />

      <AppointmentTypeSection
        appointment_type={formData.appointment_type}
        notes={formData.notes}
        onAppointmentTypeChange={(value) => updateFormData('appointment_type', value)}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ClinicianSection
          value={formData.clinician_id}
          onChange={(value) => updateFormData('clinician_id', value)}
        />

        <ServiceCodeSection
          value={formData.service_code}
          onChange={(value) => updateFormData('service_code', value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DurationSection
          value={formData.duration_minutes}
          onChange={(value) => updateFormData('duration_minutes', value)}
        />

        <FrequencySection
          value={formData.frequency}
          onChange={(value) => updateFormData('frequency', value)}
        />

        <div className="flex items-end">
          <TelehealthSection
            value={formData.use_telehealth}
            onChange={(value) => updateFormData('use_telehealth', value)}
          />
        </div>
      </div>

      <LocationSection
        location={formData.location}
        roomNumber={formData.room_number}
        onLocationChange={(value) => updateFormData('location', value)}
        onRoomNumberChange={(value) => updateFormData('room_number', value)}
      />

      <AppointmentAlertSection
        value={formData.appointment_alert}
        onChange={(value) => updateFormData('appointment_alert', value)}
      />
    </div>
  );
};

export default CreateAppointmentFormContent;
