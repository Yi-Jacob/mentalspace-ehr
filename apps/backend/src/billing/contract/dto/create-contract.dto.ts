import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateContractDto {
  @IsString()
  payerId: string;

  @IsString()
  contractName: string;

  @IsOptional()
  @IsString()
  contractNumber?: string;

  @IsDateString()
  effectiveDate: string;

  @IsOptional()
  @IsDateString()
  expirationDate?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  reimbursementRate?: number;

  @IsOptional()
  @IsString()
  contractTerms?: string;
} 