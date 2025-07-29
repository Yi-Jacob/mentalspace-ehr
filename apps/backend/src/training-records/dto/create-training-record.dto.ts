import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsDateString } from 'class-validator';

export enum TrainingStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
}

export class CreateTrainingRecordDto {
  @IsString()
  @IsNotEmpty()
  trainingTitle: string;

  @IsString()
  @IsNotEmpty()
  trainingType: string;

  @IsOptional()
  @IsString()
  providerOrganization?: string;

  @IsOptional()
  @IsDateString()
  completionDate?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  @IsNumber()
  hoursCompleted?: number;

  @IsOptional()
  @IsString()
  certificateNumber?: string;

  @IsEnum(TrainingStatus)
  status: TrainingStatus;

  @IsOptional()
  @IsString()
  notes?: string;
} 