import { apiClient } from './api-helper/client';

export interface TrainingRecord {
  id: string;
  userId: string;
  trainingTitle: string;
  trainingType: string;
  providerOrganization?: string;
  completionDate?: string;
  expiryDate?: string;
  hoursCompleted?: number;
  certificateNumber?: string;
  status: 'in_progress' | 'completed' | 'expired';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    firstName: string;
    lastName: string;
  };
}

export interface CreateTrainingRecordRequest {
  trainingTitle: string;
  trainingType: string;
  providerOrganization?: string;
  completionDate?: string;
  expiryDate?: string;
  hoursCompleted?: number;
  certificateNumber?: string;
  status: 'in_progress' | 'completed' | 'expired';
  notes?: string;
}

export interface UpdateTrainingRecordRequest {
  trainingTitle?: string;
  trainingType?: string;
  providerOrganization?: string;
  completionDate?: string;
  expiryDate?: string;
  hoursCompleted?: number;
  certificateNumber?: string;
  status?: 'in_progress' | 'completed' | 'expired';
  notes?: string;
}

// Training Records Service
export class TrainingRecordsService {
  private baseUrl = '/training-records';

  // Get all training records
  async getTrainingRecords(): Promise<TrainingRecord[]> {
    const response = await apiClient.get<TrainingRecord[]>(this.baseUrl);
    return response.data;
  }

  // Get single training record by ID
  async getTrainingRecord(id: string): Promise<TrainingRecord> {
    const response = await apiClient.get<TrainingRecord>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // Create new training record
  async createTrainingRecord(data: CreateTrainingRecordRequest): Promise<TrainingRecord> {
    const response = await apiClient.post<TrainingRecord>(this.baseUrl, data);
    return response.data;
  }

  // Update existing training record
  async updateTrainingRecord(id: string, data: UpdateTrainingRecordRequest): Promise<TrainingRecord> {
    const response = await apiClient.patch<TrainingRecord>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  // Delete training record
  async deleteTrainingRecord(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }
}

export const trainingRecordsService = new TrainingRecordsService(); 