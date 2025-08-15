import { AppointmentType } from './enums/scheduleEnum';

export type AppointmentTypeValue = string;

// Helper function to get all appointment type values
export const getAppointmentTypeValues = (): AppointmentTypeValue[] => {
  return Object.values(AppointmentType);
};

// Helper function to get appointment type options for select components
export const getAppointmentTypeOptions = () => {
  return [
    { value: AppointmentType.INITIAL_CONSULTATION, label: 'Initial Consultation' },
    { value: AppointmentType.FOLLOW_UP, label: 'Follow-up' },
    { value: AppointmentType.THERAPY_SESSION, label: 'Therapy Session' },
    { value: AppointmentType.GROUP_THERAPY, label: 'Group Therapy' },
    { value: AppointmentType.ASSESSMENT, label: 'Assessment' },
    { value: AppointmentType.MEDICATION_MANAGEMENT, label: 'Medication Management' },
    { value: AppointmentType.CRISIS_INTERVENTION, label: 'Crisis Intervention' },
    { value: AppointmentType.OTHER, label: 'Other' },
  ];
};
