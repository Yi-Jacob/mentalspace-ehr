import { PartialType } from '@nestjs/mapped-types';
import { AppointmentType, CreateAppointmentDto } from './create-appointment.dto';
import { IsOptional, IsEnum, IsDateString, IsString, IsArray, ValidateNested, IsBoolean, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { AppointmentStatus, RecurringPattern, TimeSlotDto } from './create-appointment.dto';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsOptional()
  @IsDateString()
  cancelledDate?: string;

  @IsOptional()
  @IsString()
  cancelledBy?: string;

  @IsOptional()
  @IsString()
  cancelledReason?: string;

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

  @IsOptional()
  @IsNumber()
  calculatedAmount?: number;

  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsEnum(AppointmentType)  
  appointmentType?: AppointmentType;

  @IsOptional()
  @IsString()
  cptCode?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  roomNumber?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  startTime?: string;
} 