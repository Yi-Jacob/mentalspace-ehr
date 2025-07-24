import { IsString, IsOptional, IsNumber, IsDateString, IsArray } from 'class-validator';

export class CreateClaimDto {
  @IsString()
  claimNumber: string;

  @IsString()
  clientId: string;

  @IsString()
  providerId: string;

  @IsOptional()
  @IsString()
  payerId?: string;

  @IsDateString()
  serviceDate: string;

  @IsOptional()
  @IsDateString()
  submissionDate?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsNumber()
  totalAmount: number;

  @IsOptional()
  @IsNumber()
  paidAmount?: number;

  @IsOptional()
  @IsNumber()
  patientResponsibility?: number;

  @IsOptional()
  @IsString()
  authorizationNumber?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  diagnosisCodes?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  procedureCodes?: string[];

  @IsOptional()
  @IsString()
  placeOfService?: string;

  @IsOptional()
  @IsString()
  claimFrequency?: string;

  @IsOptional()
  @IsString()
  batchId?: string;

  @IsOptional()
  @IsString()
  clearinghouseId?: string;

  @IsOptional()
  @IsString()
  submissionMethod?: string;

  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @IsOptional()
  @IsString()
  denialReason?: string;

  @IsOptional()
  @IsString()
  notes?: string;
} 