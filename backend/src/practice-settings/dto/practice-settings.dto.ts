import { IsString, IsOptional, IsObject } from 'class-validator';

export class PracticeSettingsDto {
  @IsOptional()
  @IsString()
  practiceName?: string;

  @IsOptional()
  @IsObject()
  practiceAddress?: Record<string, any>;

  @IsOptional()
  @IsObject()
  practiceContact?: Record<string, any>;

  @IsOptional()
  @IsObject()
  businessHours?: Record<string, any>;

  @IsOptional()
  @IsObject()
  securitySettings?: Record<string, any>;

  @IsOptional()
  @IsObject()
  portalSettings?: Record<string, any>;

  @IsOptional()
  @IsObject()
  schedulingSettings?: Record<string, any>;

  @IsOptional()
  @IsObject()
  documentationSettings?: Record<string, any>;

  @IsOptional()
  @IsObject()
  billingSettings?: Record<string, any>;
} 