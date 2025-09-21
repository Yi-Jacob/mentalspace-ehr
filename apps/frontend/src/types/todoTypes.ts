export interface TodoItem {
  id: string;
  type: TodoType;
  title: string;
  description: string;
  priority: TodoPriority;
  status: TodoStatus;
  dueDate?: Date;
  assignedTo?: string;
  assignedToName?: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

export interface AccountTodoItem extends TodoItem {
  type: 'account';
  userId: string;
  userName: string;
  missingFields: string[];
  userType: 'staff' | 'client';
}

export interface PatientTodoItem extends TodoItem {
  type: 'patient';
  clientId: string;
  clientName: string;
  missingFields: string[];
  assignedClinicianId?: string;
  assignedClinicianName?: string;
}

export interface AppointmentTodoItem extends TodoItem {
  type: 'appointment';
  appointmentId: string;
  clientId: string;
  clientName: string;
  providerId: string;
  providerName: string;
  appointmentDate: Date;
  appointmentType: string;
  status: string;
}

export interface NoteTodoItem extends TodoItem {
  type: 'note';
  noteId: string;
  clientId: string;
  clientName: string;
  providerId: string;
  providerName: string;
  noteType: string;
  noteStatus: string;
  sessionDate: Date;
  daysOverdue?: number;
}

export type TodoType = 'account' | 'patient' | 'appointment' | 'note';

export type TodoPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TodoStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface TodoFilters {
  type?: TodoType;
  priority?: TodoPriority;
  status?: TodoStatus;
  assignedTo?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface TodoStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
  byType: Record<TodoType, number>;
  byPriority: Record<TodoPriority, number>;
}
