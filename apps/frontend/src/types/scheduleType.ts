import { AppointmentType, AppointmentStatus } from './enums/scheduleEnum';

export type AppointmentTypeValue = string;
export type AppointmentStatusValue = string;

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

// Helper function to get all appointment status values
export const getAppointmentStatusValues = (): AppointmentStatusValue[] => {
  return Object.values(AppointmentStatus);
};

// Helper function to get appointment status options for select components
export const getAppointmentStatusOptions = () => {
  return [
    { value: AppointmentStatus.PENDING, label: 'Pending' },
    { value: AppointmentStatus.SCHEDULED, label: 'Scheduled' },
    { value: AppointmentStatus.CONFIRMED, label: 'Confirmed' },
    { value: AppointmentStatus.CHECKED_IN, label: 'Checked In' },
    { value: AppointmentStatus.COMPLETED, label: 'Completed' },
    { value: AppointmentStatus.CANCELLED, label: 'Cancelled' },
    { value: AppointmentStatus.NO_SHOW, label: 'No Show' },
  ];
};
