import { IsString, IsOptional, IsDateString, IsNumber, IsBoolean } from 'class-validator';

export class CreateProviderCompensationDto {
  @IsString()
  providerId: string;

  @IsString()
  compensationType: string;

  @IsOptional()
  @IsNumber()
  baseSessionRate?: number;

  @IsOptional()
  @IsNumber()
  baseHourlyRate?: number;

  @IsOptional()
  @IsNumber()
  experienceTier?: number;

  @IsOptional()
  @IsBoolean()
  isOvertimeEligible?: boolean;

  @IsOptional()
  @IsNumber()
  eveningDifferential?: number;

  @IsOptional()
  @IsNumber()
  weekendDifferential?: number;

  @IsDateString()
  effectiveDate: string;

  @IsOptional()
  @IsDateString()
  expirationDate?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  createdBy?: string;
} 