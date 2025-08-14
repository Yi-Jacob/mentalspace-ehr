
import React from 'react';
import ClientSelectionSection from './ClientSelectionSection';
import DateTimeSection from './DateTimeSection';
import AppointmentTypeSection from './AppointmentTypeSection';
import LocationSection from './LocationSection';
import DurationSection from './DurationSection';
import RecurringSection from './RecurringSection';
import { format } from 'date-fns';

interface AppointmentFormData {
  client_id: string;
  appointment_type: 'initial_consultation' | 'follow_up' | 'therapy_session' | 'group_therapy' | 'assessment' | 'medication_management' | 'crisis_intervention' | 'other';
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
            onAppointmentTypeChange={(value) => updateFormData('appointment_type', value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => updateFormData('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter appointment title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter appointment description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>
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

          <DurationSection
            value={formData.duration_minutes}
            onChange={(value) => updateFormData('duration_minutes', value)}
          />
        </div>
      </div>

      {/* Recurring Configuration */}
      <div className="bg-gradient-to-r from-purple-50/80 to-pink-50/60 rounded-2xl p-6 border border-purple-200/30 shadow-sm">
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full" />
          <h3 className="text-lg font-semibold text-gray-800">Recurring Configuration</h3>
        </div>
        
        <RecurringSection
          recurring_period={formData.recurring_period}
          onRecurringPeriodChange={(value) => updateFormData('recurring_period', value)}
        />
      </div>

      {/* Location & Additional Information */}
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
    </div>
  );
};

export default CreateAppointmentFormContent;
