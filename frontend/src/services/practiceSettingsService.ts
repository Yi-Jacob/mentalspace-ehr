import { apiClient } from './api-helper/client';

export interface PracticeSettings {
  id?: string;
  userId?: string;
  practiceName?: string;
  practiceAddress?: Record<string, any>;
  practiceContact?: Record<string, any>;
  businessHours?: Record<string, any>;
  securitySettings?: Record<string, any>;
  portalSettings?: Record<string, any>;
  schedulingSettings?: Record<string, any>;
  documentationSettings?: Record<string, any>;
  billingSettings?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

// Practice Settings Service
export class PracticeSettingsService {
  private baseUrl = '/practice-settings';

  // Get current user's practice settings
  async getPracticeSettings(): Promise<PracticeSettings | null> {
    const response = await apiClient.get<PracticeSettings>(this.baseUrl);
    return response.data;
  }

  // Create or update practice settings
  async upsertPracticeSettings(data: PracticeSettings): Promise<PracticeSettings> {
    const response = await apiClient.post<PracticeSettings>(this.baseUrl, data);
    return response.data;
  }

  // Update practice settings
  async updatePracticeSettings(data: PracticeSettings): Promise<PracticeSettings> {
    const response = await apiClient.patch<PracticeSettings>(this.baseUrl, data);
    return response.data;
  }
}

export const practiceSettingsService = new PracticeSettingsService(); 