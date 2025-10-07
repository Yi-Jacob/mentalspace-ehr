import { IsOptional, IsObject } from 'class-validator';

export class UpdatePracticeSettingsDto {
  @IsOptional()
  @IsObject()
  practiceInfo?: Record<string, any>;

  @IsOptional()
  @IsObject()
  authSettings?: Record<string, any>;

  @IsOptional()
  @IsObject()
  complianceSettings?: Record<string, any>;

  @IsOptional()
  @IsObject()
  aiSettings?: Record<string, any>;

  @IsOptional()
  @IsObject()
  documentationSettings?: Record<string, any>;

  @IsOptional()
  @IsObject()
  schedulingSettings?: Record<string, any>;

  @IsOptional()
  @IsObject()
  noteSettings?: Record<string, any>;

  @IsOptional()
  @IsObject()
  staffSettings?: Record<string, any>;

  @IsOptional()
  @IsObject()
  clientSettings?: Record<string, any>;
}
