import { IsString, IsOptional, IsDateString, IsNumber, IsBoolean } from 'class-validator';

export class CreateTimeEntryDto {
  @IsString()
  userId: string;

  @IsDateString()
  entryDate: string;

  @IsDateString()
  clockInTime: string;

  @IsOptional()
  @IsDateString()
  clockOutTime?: string;

  @IsOptional()
  @IsDateString()
  breakStartTime?: string;

  @IsOptional()
  @IsDateString()
  breakEndTime?: string;

  @IsOptional()
  @IsNumber()
  totalHours?: number;

  @IsOptional()
  @IsNumber()
  regularHours?: number;

  @IsOptional()
  @IsNumber()
  overtimeHours?: number;

  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;

  @IsOptional()
  @IsString()
  approvedBy?: string;

  @IsOptional()
  @IsDateString()
  approvedAt?: string;

  @IsOptional()
  @IsString()
  notes?: string;
} 