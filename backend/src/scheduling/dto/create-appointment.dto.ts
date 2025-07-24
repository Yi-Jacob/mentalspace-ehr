import { IsString, IsOptional, IsDateString, IsEnum, IsBoolean, IsUUID } from 'class-validator';

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

export enum AppointmentType {
  INITIAL_CONSULTATION = 'initial_consultation',
  FOLLOW_UP = 'follow_up',
  THERAPY_SESSION = 'therapy_session',
  GROUP_THERAPY = 'group_therapy',
  ASSESSMENT = 'assessment',
  MEDICATION_MANAGEMENT = 'medication_management',
  CRISIS_INTERVENTION = 'crisis_intervention',
  OTHER = 'other',
}

export class CreateAppointmentDto {
  @IsUUID()
  clientId: string;

  @IsUUID()
  providerId: string;

  @IsEnum(AppointmentType)
  appointmentType: AppointmentType;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  roomNumber?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @IsOptional()
  @IsString()
  recurringSeriesId?: string;

  @IsOptional()
  @IsUUID()
  createdBy?: string;
} 