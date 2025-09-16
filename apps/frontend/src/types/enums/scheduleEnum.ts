export enum AppointmentType {
  INTAKE_SESSION = 'Intake session',
  FOLLOW_UP = 'Follow-up',
  THERAPY_SESSION = 'Therapy Session',
  GROUP_THERAPY = 'Group Therapy',
  ASSESSMENT = 'Assessment',
  MEDICATION_MANAGEMENT = 'Medication Management',
  CRISIS_INTERVENTION = 'Crisis Intervention',
  OTHER = 'Other',
}

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
  RESCHEDULED = 'rescheduled',
}
