import { IsString, IsOptional, IsDateString, IsBoolean, IsUUID } from 'class-validator';

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
  notes?: string;

  @IsOptional()
  @IsBoolean()
  isTelehealth?: boolean;
} 