import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentDto } from './create-appointment.dto';
import { IsOptional, IsEnum, IsDateString, IsString, IsArray, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { AppointmentStatus, AppointmentType, RecurringPattern, TimeSlotDto } from './create-appointment.dto';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsOptional()
  @IsDateString()
  cancelledAt?: string;

  @IsOptional()
  @IsString()
  cancelledBy?: string;

  @IsOptional()
  @IsString()
  cancellationReason?: string;

  @IsOptional()
  @IsString()
  noShowReason?: string;

  @IsOptional()
  @IsDateString()
  checkedInAt?: string;

  @IsOptional()
  @IsDateString()
  completedAt?: string;

  // Recurring appointment fields for editing
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