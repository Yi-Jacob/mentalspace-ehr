import { IsString, IsOptional, IsDateString, IsEnum, IsInt, Min, Max, IsUUID } from 'class-validator';
import { AppointmentType } from './create-appointment.dto';

export class CreateWaitlistDto {
  @IsUUID()
  clientId: string;

  @IsUUID()
  providerId: string;

  @IsDateString()
  preferredDate: string;

  @IsOptional()
  @IsString()
  preferredTimeStart?: string;

  @IsOptional()
  @IsString()
  preferredTimeEnd?: string;

  @IsEnum(AppointmentType)
  appointmentType: AppointmentType;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  priority?: number;
} 