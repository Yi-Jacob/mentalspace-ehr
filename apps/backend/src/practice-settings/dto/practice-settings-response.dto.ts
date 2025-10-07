export class PracticeSettingsResponseDto {
  id: string;
  practiceInfo?: Record<string, any>;
  authSettings?: Record<string, any>;
  complianceSettings?: Record<string, any>;
  aiSettings?: Record<string, any>;
  documentationSettings?: Record<string, any>;
  schedulingSettings?: Record<string, any>;
  noteSettings?: Record<string, any>;
  staffSettings?: Record<string, any>;
  clientSettings?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
