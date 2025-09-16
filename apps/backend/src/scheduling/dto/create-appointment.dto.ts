import { IsString, IsOptional, IsUUID, IsEnum, IsDateString, IsInt, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

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
  INTAKE_SESSION = 'Intake session',
  FOLLOW_UP = 'Follow-up',
  THERAPY_SESSION = 'Therapy Session',
  GROUP_THERAPY = 'Group Therapy',
  ASSESSMENT = 'Assessment',
  MEDICATION_MANAGEMENT = 'Medication Management',
  CRISIS_INTERVENTION = 'Crisis Intervention',
  OTHER = 'Other',
}

export enum RecurringPattern {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export class TimeSlotDto {
  @IsString()
  time: string; // Format: "HH:MM"

  @IsOptional()
  @IsInt()
  dayOfWeek?: number; // 0-6 (Sunday-Saturday), required for weekly

  @IsOptional()
  @IsInt()
  dayOfMonth?: number; // 1-31, required for monthly and yearly

  @IsOptional()
  @IsInt()
  month?: number; // 1-12, required for yearly
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
  cptCode?: string;

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

  // Recurring appointment fields
  @IsOptional()
  @IsEnum(RecurringPattern)
  recurringPattern?: RecurringPattern;

  @IsOptional()
  @IsDateString()
  recurringEndDate?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  recurringTimeSlots?: TimeSlotDto[];

  @IsOptional()
  @IsBoolean()
  isBusinessDayOnly?: boolean;
} 