import { IsString, IsOptional, IsDateString, IsEnum, IsBoolean, IsArray, ValidateNested, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

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
  @IsNumber()
  @Min(0)
  @Max(6)
  dayOfWeek?: number; // 0-6 (Sunday-Saturday), required for weekly

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(31)
  dayOfMonth?: number; // 1-31, required for monthly and yearly

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(12)
  month?: number; // 1-12, required for yearly
}

export class CreateRecurringRuleDto {
  @IsEnum(RecurringPattern)
  recurringPattern: RecurringPattern;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  timeSlots: TimeSlotDto[];

  @IsOptional()
  @IsBoolean()
  isBusinessDayOnly?: boolean;
}
