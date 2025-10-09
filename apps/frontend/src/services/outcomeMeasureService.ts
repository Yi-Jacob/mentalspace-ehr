import { apiClient } from './api-helper/client';
import { 
  OutcomeMeasure, 
  CreateOutcomeMeasureDto, 
  UpdateOutcomeMeasureDto,
  OutcomeMeasureResponse 
} from '@/types/outcomeMeasureType';

class OutcomeMeasureService {
  private baseUrl = '/outcome-measures';

  async getAllOutcomeMeasures(): Promise<OutcomeMeasure[]> {
    const response = await apiClient.get<OutcomeMeasure[]>(this.baseUrl);
    return response.data;
  }

  async getOutcomeMeasureById(measureId: string): Promise<OutcomeMeasure> {
    const response = await apiClient.get<OutcomeMeasure>(`${this.baseUrl}/${measureId}`);
    return response.data;
  }

  async createOutcomeMeasure(data: CreateOutcomeMeasureDto): Promise<OutcomeMeasure> {
    const response = await apiClient.post<OutcomeMeasure>(this.baseUrl, data);
    return response.data;
  }

  async updateOutcomeMeasure(measureId: string, data: UpdateOutcomeMeasureDto): Promise<OutcomeMeasure> {
    const response = await apiClient.put<OutcomeMeasure>(`${this.baseUrl}/${measureId}`, data);
    return response.data;
  }

  async deleteOutcomeMeasure(measureId: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`${this.baseUrl}/${measureId}`);
    return response.data;
  }

  async getOutcomeMeasureResponse(responseId: string): Promise<OutcomeMeasureResponse> {
    const response = await apiClient.get<OutcomeMeasureResponse>(`${this.baseUrl}/responses/${responseId}`);
    return response.data;
  }

  async submitOutcomeMeasureResponse(clientFileId: string, responses: any): Promise<OutcomeMeasureResponse> {
    const response = await apiClient.post<OutcomeMeasureResponse>(`${this.baseUrl}/responses`, {
      clientFileId,
      responses
    });
    return response.data;
  }
}

export const outcomeMeasureService = new OutcomeMeasureService();
