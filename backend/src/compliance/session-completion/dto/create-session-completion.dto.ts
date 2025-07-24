import { IsString, IsOptional, IsDateString, IsNumber, IsBoolean } from 'class-validator';

export class CreateSessionCompletionDto {
  @IsString()
  appointmentId: string;

  @IsString()
  providerId: string;

  @IsString()
  clientId: string;

  @IsString()
  sessionType: string;

  @IsNumber()
  durationMinutes: number;

  @IsDateString()
  sessionDate: string;

  @IsOptional()
  @IsString()
  noteId?: string;

  @IsOptional()
  @IsBoolean()
  isNoteSigned?: boolean;

  @IsOptional()
  @IsDateString()
  noteSignedAt?: string;

  @IsOptional()
  @IsBoolean()
  isLocked?: boolean;

  @IsOptional()
  @IsDateString()
  lockedAt?: string;

  @IsOptional()
  @IsNumber()
  calculatedAmount?: number;

  @IsOptional()
  @IsDateString()
  payPeriodWeek?: string;

  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;

  @IsOptional()
  @IsString()
  supervisorOverrideBy?: string;

  @IsOptional()
  @IsString()
  supervisorOverrideReason?: string;

  @IsOptional()
  @IsDateString()
  supervisorOverrideAt?: string;
} 