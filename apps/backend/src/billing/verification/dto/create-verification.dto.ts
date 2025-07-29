import { IsString, IsOptional, IsNumber, IsDateString, IsBoolean, IsArray } from 'class-validator';

export class CreateVerificationDto {
  @IsString()
  clientId: string;

  @IsString()
  insuranceId: string;

  @IsDateString()
  verificationDate: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsBoolean()
  benefitsVerified?: boolean;

  @IsOptional()
  @IsNumber()
  copayAmount?: number;

  @IsOptional()
  @IsNumber()
  deductibleAmount?: number;

  @IsOptional()
  @IsNumber()
  deductibleMet?: number;

  @IsOptional()
  @IsNumber()
  outOfPocketMax?: number;

  @IsOptional()
  @IsNumber()
  outOfPocketMet?: number;

  @IsOptional()
  @IsBoolean()
  authorizationRequired?: boolean;

  @IsOptional()
  @IsString()
  authorizationNumber?: string;

  @IsOptional()
  @IsDateString()
  authorizationExpiry?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  coveredServices?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  excludedServices?: string[];

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDateString()
  nextVerificationDate?: string;
} 