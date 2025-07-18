
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
    <div className="space-y-10">
      {/* Client Selection - Priority section */}
      <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/60 rounded-2xl p-6 border border-blue-200/30 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
          <h3 className="text-lg font-semibold text-gray-800">Client Information</h3>
        </div>
        <ClientSelectionSection 
          value={formData.client_id}
          onChange={(value) => updateFormData('client_id', value)}
          error={errors.client_id}
        />
      </div>

      {/* Appointment Details */}
      <div className="bg-gradient-to-r from-emerald-50/80 to-green-50/60 rounded-2xl p-6 border border-emerald-200/30 shadow-sm">
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-2 h-6 bg-gradient-to-b from-emerald-500 to-green-600 rounded-full" />
          <h3 className="text-lg font-semibold text-gray-800">Appointment Details</h3>
        </div>
        
        <div className="space-y-6">
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
        </div>
      </div>

      {/* Professional Details */}
      <div className="bg-gradient-to-r from-purple-50/80 to-pink-50/60 rounded-2xl p-6 border border-purple-200/30 shadow-sm">
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full" />
          <h3 className="text-lg font-semibold text-gray-800">Professional Details</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ClinicianSection
            value={formData.clinician_id}
            onChange={(value) => updateFormData('clinician_id', value)}
          />

          <ServiceCodeSection
            value={formData.service_code}
            onChange={(value) => updateFormData('service_code', value)}
          />
        </div>
      </div>

      {/* Session Configuration */}
      <div className="bg-gradient-to-r from-orange-50/80 to-amber-50/60 rounded-2xl p-6 border border-orange-200/30 shadow-sm">
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-2 h-6 bg-gradient-to-b from-orange-500 to-amber-600 rounded-full" />
          <h3 className="text-lg font-semibold text-gray-800">Session Configuration</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      </div>

      {/* Location & Additional Information */}
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-teal-50/80 to-cyan-50/60 rounded-2xl p-6 border border-teal-200/30 shadow-sm">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-2 h-6 bg-gradient-to-b from-teal-500 to-cyan-600 rounded-full" />
            <h3 className="text-lg font-semibold text-gray-800">Location</h3>
          </div>
          
          <LocationSection
            location={formData.location}
            roomNumber={formData.room_number}
            onLocationChange={(value) => updateFormData('location', value)}
            onRoomNumberChange={(value) => updateFormData('room_number', value)}
          />
        </div>

        <AppointmentAlertSection
          value={formData.appointment_alert}
          onChange={(value) => updateFormData('appointment_alert', value)}
        />
      </div>
    </div>
  );
};

export default CreateAppointmentFormContent;
