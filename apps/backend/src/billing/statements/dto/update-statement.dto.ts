import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class UpdateStatementDto {
  @IsOptional()
  @IsString()
  statementNumber?: string;

  @IsOptional()
  @IsString()
  clientId?: string;

  @IsOptional()
  @IsDateString()
  statementDate?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsNumber()
  totalAmount?: number;

  @IsOptional()
  @IsNumber()
  previousBalance?: number;

  @IsOptional()
  @IsNumber()
  paymentsReceived?: number;

  @IsOptional()
  @IsNumber()
  adjustments?: number;

  @IsOptional()
  @IsNumber()
  currentBalance?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  deliveryMethod?: string;

  @IsOptional()
  @IsString()
  paymentLink?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
