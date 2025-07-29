import { IsString, IsOptional, IsDateString, IsNumber, IsBoolean } from 'class-validator';

export class CreateComplianceDeadlineDto {
  @IsString()
  providerId: string;

  @IsString()
  deadlineType: string;

  @IsDateString()
  deadlineDate: string;

  @IsOptional()
  @IsBoolean()
  isMet?: boolean;

  @IsOptional()
  @IsNumber()
  notesPending?: number;

  @IsOptional()
  @IsNumber()
  notesCompleted?: number;

  @IsOptional()
  @IsBoolean()
  reminderSent24h?: boolean;

  @IsOptional()
  @IsBoolean()
  reminderSent48h?: boolean;

  @IsOptional()
  @IsBoolean()
  reminderSent72h?: boolean;

  @IsOptional()
  @IsBoolean()
  supervisorNotified?: boolean;
} 