import { AccountTodoItem, PatientTodoItem, AppointmentTodoItem, NoteTodoItem } from '../types/todoTypes';
import { apiClient } from './api-helper/client';

class TodoService {

  async getAccountTodos(): Promise<AccountTodoItem[]> {
    const response = await apiClient.get<AccountTodoItem[]>('/todos/account');
    return response.data;
  }

  async getPatientTodos(): Promise<PatientTodoItem[]> {
    const response = await apiClient.get<PatientTodoItem[]>('/todos/patients');
    return response.data;
  }

  async getAppointmentTodos(): Promise<AppointmentTodoItem[]> {
    const response = await apiClient.get<AppointmentTodoItem[]>('/todos/appointments');
    return response.data;
  }

  async getNoteTodos(): Promise<NoteTodoItem[]> {
    const response = await apiClient.get<NoteTodoItem[]>('/todos/notes');
    return response.data;
  }
}

export const todoService = new TodoService();
export default todoService;
