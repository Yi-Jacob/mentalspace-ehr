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
    { value: AppointmentType.INTAKE_SESSION, label: 'Intake Session' },
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
    { value: AppointmentStatus.SCHEDULED, label: 'Scheduled' },
    { value: AppointmentStatus.CONFIRMED, label: 'Confirmed' },
    { value: AppointmentStatus.CHECKED_IN, label: 'Checked In' },
    { value: AppointmentStatus.COMPLETED, label: 'Completed' },
    { value: AppointmentStatus.CANCELLED, label: 'Cancelled' },
    { value: AppointmentStatus.NO_SHOW, label: 'No Show' },
  ];
};

// Appointment interfaces
export interface Appointment {
  id: string;
  clientId: string;
  providerId: string;
  appointmentType: AppointmentTypeValue;
  cptCode?: string;
  title?: string;
  description?: string;
  startTime: string;
  duration: number;
  status: string;
  location?: string;
  roomNumber?: string;
  noteId?: string;
  isTelehealth: boolean;
  hasSession: boolean;
  isNoteSigned: boolean;
  noteSignedAt?: string;
  isLocked: boolean;
  lockedAt?: string;
  calculatedAmount?: number;
  payPeriodWeek?: string;
  isPaid: boolean;
  supervisorOverrideBy?: string;
  supervisorOverrideReason?: string;
  supervisorOverrideAt?: string;
  googleMeetLink?: string;
  recurringRuleId?: string;
  createdAt: string;
  updatedAt: string;
  clients: {
    id: string;
    firstName: string;
    lastName: string;
  };
  note?: {
    id: string;
    title: string;
    noteType: string;
    status: string;
  };
}

export interface CreateAppointmentData {
  clientId: string;
  appointmentType: AppointmentTypeValue;
  title?: string;
  description?: string;
  cptCode?: string;
  startTime: string;
  duration: number;
  location?: string;
  roomNumber?: string;
  noteId?: string;
  isTelehealth?: boolean;
  hasSession?: boolean;
  // Recurring appointment fields
  recurringPattern?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  recurringTimeSlots?: TimeSlot[];
  isBusinessDayOnly?: boolean;
}

export interface UpdateAppointmentData {
  id: string;
  title?: string;
  description?: string;
  cptCode?: string;
  startTime?: string;
  duration?: number;
  location?: string;
  roomNumber?: string;
  noteId?: string;
  isTelehealth?: boolean;
  hasSession?: boolean;
  status?: string;
}

export interface QueryAppointmentsParams {
  clientId?: string;
  providerId?: string;
  status?: string;
  appointmentType?: AppointmentTypeValue;
  startDate?: string;
  endDate?: string;
  search?: string;
  viewType?: 'day' | 'week' | 'month';
  hasSession?: boolean;
}

export interface ConflictCheckParams {
  appointmentId?: string;
  clientId: string;
  startTime: string;
  endTime: string;
}

export interface ConflictResult {
  conflicts: Appointment[];
  hasConflicts: boolean;
}

// Waitlist interfaces
export interface WaitlistEntry {
  id: string;
  clientId: string;
  providerId: string;
  preferredDate: string;
  preferredTimeStart?: string;
  notes?: string;
  isTelehealth: boolean;
  createdAt: string;
  isFulfilled: boolean;
  clients?: {
    firstName: string;
    lastName: string;
  };
  users?: {
    firstName: string;
    lastName: string;
  };
}

export interface CreateWaitlistData {
  clientId: string;
  providerId: string;
  preferredDate: string;
  preferredTimeStart?: string;
  notes?: string;
  isTelehealth?: boolean;
}

// Provider schedule interfaces
export interface ProviderSchedule {
  id: string;
  providerId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  breakStartTime?: string;
  breakEndTime?: string;
  effectiveFrom: string;
  effectiveUntil?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScheduleData {
  providerId?: string; // Made optional since it's set in backend
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isAvailable?: boolean;
  breakStartTime?: string;
  breakEndTime?: string;
  effectiveFrom?: string;
  effectiveUntil?: string;
  status?: string;
}

export interface CreateScheduleExceptionData {
  providerId?: string; // Made optional since it's set in backend
  exceptionDate: string;
  startTime?: string;
  endTime?: string;
  isUnavailable?: boolean;
  reason?: string;
}

export interface ScheduleException {
  id: string;
  providerId: string;
  exceptionDate: string;
  startTime?: string;
  endTime?: string;
  isUnavailable?: boolean;
  reason?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Time slot interface
export interface TimeSlot {
  time: string;
  dayOfWeek?: number; // 0-6 (Sunday-Saturday)
  dayOfMonth?: number; // 1-31
  month?: number; // 1-12
}