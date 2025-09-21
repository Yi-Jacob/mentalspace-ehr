export enum TodoType {
  ACCOUNT = 'account',
  PATIENT = 'patient',
  APPOINTMENT = 'appointment',
  NOTE = 'note'
}

export enum TodoPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum TodoStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum UserRole {
  ADMIN = 'admin',
  SUPERVISOR = 'supervisor',
  CLINICIAN = 'clinician',
  STAFF = 'staff',
  CLIENT = 'client'
}

export enum NoteStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  SIGNED = 'signed',
  LOCKED = 'locked',
  CO_SIGNED = 'co_signed'
}

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show'
}
