import { apiClient } from './api-helper/client';

export interface ProductivityGoal {
  id: string;
  userId: string;
  goalType: string;
  targetValue: number;
  currentValue?: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductivityGoalRequest {
  goalType: string;
  targetValue: number;
  currentValue?: number;
  date?: string;
}

export interface UpdateProductivityGoalRequest {
  goalType?: string;
  targetValue?: number;
  currentValue?: number;
  date?: string;
}

// Productivity Goals Service
export class ProductivityGoalsService {
  private baseUrl = '/productivity-goals';

  // Get all productivity goals for the current user
  async getGoals(date?: string): Promise<ProductivityGoal[]> {
    const queryParams = new URLSearchParams();
    if (date) queryParams.append('date', date);

    const url = `${this.baseUrl}?${queryParams.toString()}`;
    const response = await apiClient.get<ProductivityGoal[]>(url);
    return response.data;
  }

  // Get single goal by ID
  async getGoal(id: string): Promise<ProductivityGoal> {
    const response = await apiClient.get<ProductivityGoal>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // Create new goal
  async createGoal(data: CreateProductivityGoalRequest): Promise<ProductivityGoal> {
    const response = await apiClient.post<ProductivityGoal>(this.baseUrl, data);
    return response.data;
  }

  // Update existing goal
  async updateGoal(id: string, data: UpdateProductivityGoalRequest): Promise<ProductivityGoal> {
    const response = await apiClient.patch<ProductivityGoal>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  // Delete goal
  async deleteGoal(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }
}

export const productivityGoalsService = new ProductivityGoalsService(); 