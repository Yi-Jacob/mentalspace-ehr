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
  SCHEDULED = 'Scheduled',
  CONFIRMED = 'Confirmed',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  NO_SHOW = 'No Show'
}
