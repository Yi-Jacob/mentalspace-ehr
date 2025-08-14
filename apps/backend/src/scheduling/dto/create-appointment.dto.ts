import { IsString, IsOptional, IsDateString, IsEnum, IsBoolean, IsUUID, IsInt, IsNumber } from 'class-validator';

export enum AppointmentStatus {
  PENDING = 'Pending',
  SCHEDULED = 'Scheduled',
  CONFIRMED = 'Confirmed',
  CHECKED_IN = 'Checked In',
  CANCELLED = 'Cancelled',
  COMPLETED = 'Completed',
  NO_SHOW = 'No Show',
}

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

export class CreateAppointmentDto {
  @IsUUID()
  clientId: string;

  @IsOptional()
  @IsUUID()
  providerId?: string; // Made optional since it will be set from JWT token

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

  @IsInt()
  duration: number; // Duration in minutes

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  roomNumber?: string;

  @IsOptional()
  @IsUUID()
  createdBy?: string;

  @IsOptional()
  @IsUUID()
  recurringRuleId?: string;
} 