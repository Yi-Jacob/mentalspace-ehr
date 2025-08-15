export enum AppointmentType {
  INITIAL_CONSULTATION = 'Initial Consultation',
  FOLLOW_UP = 'Follow-up',
  THERAPY_SESSION = 'Therapy Session',
  GROUP_THERAPY = 'Group Therapy',
  ASSESSMENT = 'Assessment',
  MEDICATION_MANAGEMENT = 'Medication Management',
  CRISIS_INTERVENTION = 'Crisis Intervention',
  OTHER = 'Other',
}

export enum AppointmentStatus {
  PENDING = 'Pending',
  SCHEDULED = 'Scheduled',
  CONFIRMED = 'Confirmed',
  CHECKED_IN = 'Checked In',
  CANCELLED = 'Cancelled',
  COMPLETED = 'Completed',
  NO_SHOW = 'No Show',
}
