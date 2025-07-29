import { IsString, IsOptional, IsNumber, IsDateString, IsBoolean } from 'class-validator';

export class CreateFeeScheduleDto {
  @IsString()
  payerId: string;

  @IsString()
  cptCode: string;

  @IsNumber()
  feeAmount: number;

  @IsDateString()
  effectiveDate: string;

  @IsOptional()
  @IsDateString()
  expirationDate?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
} 