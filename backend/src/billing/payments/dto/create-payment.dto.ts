import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  paymentNumber: string;

  @IsString()
  clientId: string;

  @IsOptional()
  @IsString()
  claimId?: string;

  @IsOptional()
  @IsString()
  payerId?: string;

  @IsDateString()
  paymentDate: string;

  @IsString()
  paymentMethod: string;

  @IsNumber()
  paymentAmount: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  referenceNumber?: string;

  @IsOptional()
  @IsString()
  creditCardLastFour?: string;

  @IsOptional()
  @IsString()
  paymentProcessor?: string;

  @IsOptional()
  @IsNumber()
  processingFee?: number;

  @IsOptional()
  @IsNumber()
  netAmount?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  processedBy?: string;
} 