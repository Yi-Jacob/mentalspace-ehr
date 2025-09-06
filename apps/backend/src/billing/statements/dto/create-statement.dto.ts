import { IsString, IsNumber, IsOptional, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStatementLineItemDto {
  @IsOptional()
  @IsString()
  claimId?: string;

  @IsOptional()
  @IsString()
  claimLineItemId?: string;

  @IsDateString()
  serviceDate: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  cptCode?: string;

  @IsNumber()
  chargeAmount: number;

  @IsOptional()
  @IsNumber()
  insurancePayment?: number;

  @IsOptional()
  @IsNumber()
  adjustmentAmount?: number;

  @IsNumber()
  patientResponsibility: number;
}

export class CreateStatementDto {
  @IsString()
  statementNumber: string;

  @IsString()
  clientId: string;

  @IsDateString()
  statementDate: string;

  @IsDateString()
  dueDate: string;

  @IsNumber()
  totalAmount: number;

  @IsOptional()
  @IsNumber()
  previousBalance?: number;

  @IsOptional()
  @IsNumber()
  paymentsReceived?: number;

  @IsOptional()
  @IsNumber()
  adjustments?: number;

  @IsNumber()
  currentBalance: number;

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

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStatementLineItemDto)
  lineItems?: CreateStatementLineItemDto[];
}

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

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStatementLineItemDto)
  lineItems?: CreateStatementLineItemDto[];
}

export class UpdateStatementLineItemDto {
  @IsOptional()
  @IsString()
  claimId?: string;

  @IsOptional()
  @IsString()
  claimLineItemId?: string;

  @IsOptional()
  @IsDateString()
  serviceDate?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  cptCode?: string;

  @IsOptional()
  @IsNumber()
  chargeAmount?: number;

  @IsOptional()
  @IsNumber()
  insurancePayment?: number;

  @IsOptional()
  @IsNumber()
  adjustmentAmount?: number;

  @IsOptional()
  @IsNumber()
  patientResponsibility?: number;
}
