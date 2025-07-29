import { IsString, IsDateString, IsOptional, IsUUID } from 'class-validator';

export class CheckConflictsDto {
  @IsOptional()
  @IsUUID()
  appointmentId?: string;

  @IsUUID()
  providerId: string;

  @IsUUID()
  clientId: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;
} 