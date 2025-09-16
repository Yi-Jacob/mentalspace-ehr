
import React from 'react';
import ClientSelectionSection from './ClientSelectionSection';
import DateTimeSection from './DateTimeSection';
import AppointmentDetailsSection from './AppointmentDetailsSection';
import RecurringSection from './RecurringSection';
import { format } from 'date-fns';
import { AppointmentType } from '@/types/enums/scheduleEnum';

interface AppointmentFormData {
  client_id: string;
  appointment_type: AppointmentType;
  cptCode: string;
  title: string;
  description: string;
  date: string;
  start_time: string;
  duration_minutes: number;
  location: string;
  room_number: string;
  recurring_period: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  recurring_rule_id?: string;
}

interface FormErrors {
  client_id?: string;
  start_time?: string;
  date?: string;
  title?: string;
  description?: string;
  cptCode?: string;
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
      <AppointmentDetailsSection
        appointmentType={formData.appointment_type}
        onAppointmentTypeChange={(value) => updateFormData('appointment_type', value)}
        durationValue={formData.duration_minutes}
        onDurationChange={(value) => updateFormData('duration_minutes', value)}
        cptCode={formData.cptCode}
        onCptCodeChange={(value) => updateFormData('cptCode', value)}
        cptCodeError={errors.cptCode}
        title={formData.title}
        description={formData.description}
        onTitleChange={(value) => updateFormData('title', value)}
        onDescriptionChange={(value) => updateFormData('description', value)}
        titleError={errors.title}
        descriptionError={errors.description}
        location={formData.location}
        roomNumber={formData.room_number}
        onLocationChange={(value) => updateFormData('location', value)}
        onRoomNumberChange={(value) => updateFormData('room_number', value)}
      />

      {/* Date & Time */}
      <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/60 rounded-2xl p-6 border border-blue-200/30 shadow-sm">
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
          <h3 className="text-lg font-semibold text-gray-800">Date & Time</h3>
        </div>
        <DateTimeSection
          date={new Date(formData.date)}
          startTime={formData.start_time}
          onDateChange={(value) => updateFormData('date', format(value, 'yyyy-MM-dd'))}
          onStartTimeChange={(value) => updateFormData('start_time', value)}
          errors={{
            date: errors.date,
            start_time: errors.start_time
          }}
        />
      </div>

      {/* Recurring Configuration */}
      <div className="bg-gradient-to-r from-purple-50/80 to-pink-50/60 rounded-2xl p-6 border border-purple-200/30 shadow-sm">
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full" />
          <h3 className="text-lg font-semibold text-gray-800">Recurring Configuration</h3>
        </div>

        <RecurringSection
          recurring_period={formData.recurring_period}
          onRecurringPeriodChange={(value) => {
            updateFormData('recurring_period', value)
          }}
          onRecurringDataChange={(recurringData) => {
            const recurringDataString = JSON.stringify(recurringData);
            // Store in a way that doesn't interfere with the existing form structure
            (formData as any)._recurringData = recurringDataString;
          }}
        />
      </div>
    </div>
  );
};

export default CreateAppointmentFormContent;
