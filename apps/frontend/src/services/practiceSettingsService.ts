import { apiClient } from './api-helper/client';

export interface PracticeSettings {
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
  createdAt: string;
  updatedAt: string;
}

export interface UpdatePracticeSettingsRequest {
  practiceInfo?: Record<string, any>;
  authSettings?: Record<string, any>;
  complianceSettings?: Record<string, any>;
  aiSettings?: Record<string, any>;
  documentationSettings?: Record<string, any>;
  schedulingSettings?: Record<string, any>;
  noteSettings?: Record<string, any>;
  staffSettings?: Record<string, any>;
  clientSettings?: Record<string, any>;
}

export class PracticeSettingsService {
  private static readonly BASE_URL = '/practice-settings';

  static async getPracticeSettings(): Promise<PracticeSettings> {
    const response = await apiClient.get<PracticeSettings>(this.BASE_URL);
    return response.data;
  }

  static async updatePracticeSettings(
    settings: UpdatePracticeSettingsRequest
  ): Promise<PracticeSettings> {
    const response = await apiClient.put<PracticeSettings>(this.BASE_URL, settings);
    return response.data;
  }

  static async getSchedulingSettings(): Promise<{
    startWorkTime: string;
    endWorkTime: string;
    lunchStartTime: string;
    lunchEndTime: string;
  }> {
    const settings = await this.getPracticeSettings();
    const schedulingSettings = settings.schedulingSettings || {};
    
    return {
      startWorkTime: schedulingSettings.startWorkTime || '09:00',
      endWorkTime: schedulingSettings.endWorkTime || '17:00',
      lunchStartTime: schedulingSettings.lunchStartTime || '12:00',
      lunchEndTime: schedulingSettings.lunchEndTime || '13:00',
    };
  }
}
