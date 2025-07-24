import { apiClient } from './api-helper/client';

export interface DiagnosisCode {
  id: string;
  code: string;
  description: string;
  category?: string;
  isActive: boolean;
  createdAt: string;
}

class DiagnosesService {
  async getDiagnosisCodes(search?: string): Promise<DiagnosisCode[]> {
    const params = search ? { search } : {};
    const response = await apiClient.get<DiagnosisCode[]>('/diagnoses', { params });
    return response.data;
  }
}

export const diagnosesService = new DiagnosesService(); 