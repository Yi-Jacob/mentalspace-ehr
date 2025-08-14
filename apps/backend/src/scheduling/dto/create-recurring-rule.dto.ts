import { IsString, IsOptional, IsDateString, IsEnum, IsBoolean, IsArray, IsJSON } from 'class-validator';

export enum RecurringPattern {
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
  YEARLY = 'Yearly',
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
  @IsJSON()
  timeSlots: any[]; // Array of time slots

  @IsOptional()
  @IsBoolean()
  isBusinessDayOnly?: boolean;
}
