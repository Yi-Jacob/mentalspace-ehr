import { IsOptional, IsString, IsDateString, IsEnum, IsUUID, IsIn } from 'class-validator';
import { AppointmentStatus, AppointmentType } from './create-appointment.dto';

export class QueryAppointmentsDto {
  @IsOptional()
  @IsUUID()
  clientId?: string;

  @IsOptional()
  @IsUUID()
  providerId?: string;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsOptional()
  @IsEnum(AppointmentType)
  appointmentType?: AppointmentType;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['day', 'week', 'month'])
  viewType?: 'day' | 'week' | 'month';
} 