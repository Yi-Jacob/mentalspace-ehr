import { apiClient } from './api-helper/client';

export interface QuickAction {
  id: string;
  userId: string;
  actionType: string;
  title: string;
  description?: string;
  priority: number;
  dueDate?: string;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
}

export interface CreateQuickActionRequest {
  actionType: string;
  title: string;
  description?: string;
  priority: number;
  dueDate?: string;
}

// Quick Actions Service
export class QuickActionsService {
  private baseUrl = '/quick-actions';

  // Get all quick actions for the current user
  async getQuickActions(): Promise<QuickAction[]> {
    const response = await apiClient.get<QuickAction[]>(this.baseUrl);
    return response.data;
  }

  // Create new quick action
  async createQuickAction(data: CreateQuickActionRequest): Promise<QuickAction> {
    const response = await apiClient.post<QuickAction>(this.baseUrl, data);
    return response.data;
  }

  // Complete a quick action
  async completeQuickAction(id: string): Promise<QuickAction> {
    const response = await apiClient.post<QuickAction>(`${this.baseUrl}/${id}/complete`);
    return response.data;
  }

  // Delete quick action
  async deleteQuickAction(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }
}

export const quickActionsService = new QuickActionsService(); 