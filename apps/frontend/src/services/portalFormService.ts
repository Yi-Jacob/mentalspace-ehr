import { apiClient } from './api-helper/client';
import { PortalForm, PortalFormResponse, CreatePortalFormDto, UpdatePortalFormDto, SubmitPortalFormResponseDto } from '@/types/portalFormType';

class PortalFormService {
  private baseUrl = '/portal-forms';

  async getAllPortalForms(): Promise<PortalForm[]> {
    const response = await apiClient.get<PortalForm[]>(this.baseUrl);
    return response.data;
  }

  async getShareablePortalForms(): Promise<PortalForm[]> {
    const response = await apiClient.get<PortalForm[]>(`${this.baseUrl}/shareable`);
    return response.data;
  }

  async getPortalFormById(id: string): Promise<PortalForm> {
    const response = await apiClient.get<PortalForm>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async createPortalForm(data: CreatePortalFormDto): Promise<PortalForm> {
    const response = await apiClient.post<PortalForm>(this.baseUrl, data);
    return response.data;
  }

  async updatePortalForm(id: string, data: UpdatePortalFormDto): Promise<PortalForm> {
    const response = await apiClient.put<PortalForm>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async deletePortalForm(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async submitPortalFormResponse(id: string, data: SubmitPortalFormResponseDto): Promise<PortalFormResponse> {
    const response = await apiClient.post<PortalFormResponse>(`${this.baseUrl}/responses/${id}`, data);
    return response.data;
  }

  async getPortalFormResponseById(responseId: string): Promise<PortalFormResponse> {
    const response = await apiClient.get<PortalFormResponse>(`${this.baseUrl}/responses/${responseId}`);
    return response.data;
  }
}

export const portalFormService = new PortalFormService();
