import { TodoItem, TodoFilters, TodoStats, AccountTodoItem, PatientTodoItem, AppointmentTodoItem, NoteTodoItem } from '../types/todoTypes';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class TodoService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getTodos(filters?: TodoFilters): Promise<TodoItem[]> {
    const queryParams = new URLSearchParams();
    
    if (filters?.type) queryParams.append('type', filters.type);
    if (filters?.priority) queryParams.append('priority', filters.priority);
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.assignedTo) queryParams.append('assignedTo', filters.assignedTo);
    if (filters?.dateRange) {
      queryParams.append('startDate', filters.dateRange.start.toISOString());
      queryParams.append('endDate', filters.dateRange.end.toISOString());
    }

    const queryString = queryParams.toString();
    const endpoint = `/api/todos${queryString ? `?${queryString}` : ''}`;
    
    return this.request<TodoItem[]>(endpoint);
  }

  async getAccountTodos(): Promise<AccountTodoItem[]> {
    return this.request<AccountTodoItem[]>('/api/todos/account');
  }

  async getPatientTodos(): Promise<PatientTodoItem[]> {
    return this.request<PatientTodoItem[]>('/api/todos/patients');
  }

  async getAppointmentTodos(): Promise<AppointmentTodoItem[]> {
    return this.request<AppointmentTodoItem[]>('/api/todos/appointments');
  }

  async getNoteTodos(): Promise<NoteTodoItem[]> {
    return this.request<NoteTodoItem[]>('/api/todos/notes');
  }

  async getTodoStats(): Promise<TodoStats> {
    return this.request<TodoStats>('/api/todos/stats');
  }

  async updateTodoStatus(todoId: string, status: string): Promise<TodoItem> {
    return this.request<TodoItem>(`/api/todos/${todoId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async markTodoComplete(todoId: string): Promise<TodoItem> {
    return this.request<TodoItem>(`/api/todos/${todoId}/complete`, {
      method: 'PATCH',
    });
  }

  async deleteTodo(todoId: string): Promise<void> {
    return this.request<void>(`/api/todos/${todoId}`, {
      method: 'DELETE',
    });
  }
}

export const todoService = new TodoService();
export default todoService;
