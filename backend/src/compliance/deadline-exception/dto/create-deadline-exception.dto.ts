import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateDeadlineExceptionDto {
  @IsString()
  providerId: string;

  @IsString()
  sessionCompletionId: string;

  @IsDateString()
  requestedExtensionUntil: string;

  @IsString()
  reason: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  reviewedBy?: string;

  @IsOptional()
  @IsDateString()
  reviewedAt?: string;

  @IsOptional()
  @IsString()
  reviewNotes?: string;
} 