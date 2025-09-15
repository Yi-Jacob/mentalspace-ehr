import { apiClient } from './api-helper/client';
import { AppointmentTypeValue } from '@/types/scheduleType';

export interface Appointment {
  id: string;
  clientId: string;
  providerId: string;
  appointmentType: AppointmentTypeValue;
  title?: string;
  description?: string;
  startTime: string;
  duration: number;
  status: string;
  location?: string;
  roomNumber?: string;
  recurringRuleId?: string;
  createdAt: string;
  updatedAt: string;
  clients: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface CreateAppointmentData {
  clientId: string;
  appointmentType: AppointmentTypeValue;
  title?: string;
  description?: string;
  cptCode?: string;
  startTime: string;
  duration: number;
  location?: string;
  roomNumber?: string;
  // Recurring appointment fields
  recurringPattern?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  recurringTimeSlots?: TimeSlot[];
  isBusinessDayOnly?: boolean;
}

export interface UpdateAppointmentData {
  id: string;
  title?: string;
  description?: string;
  startTime?: string;
  duration?: number;
  location?: string;
  roomNumber?: string;
  status?: string;
}

export interface QueryAppointmentsParams {
  clientId?: string;
  providerId?: string;
  status?: string;
  appointmentType?: AppointmentTypeValue;
  startDate?: string;
  endDate?: string;
  search?: string;
  viewType?: 'day' | 'week' | 'month';
}

export interface ConflictCheckParams {
  appointmentId?: string;
  providerId: string;
  clientId: string;
  startTime: string;
  endTime: string;
}

export interface ConflictResult {
  conflicts: Appointment[];
  hasConflicts: boolean;
}

export interface WaitlistEntry {
  id: string;
  clientId: string;
  providerId: string;
  preferredDate: string;
  preferredTimeStart?: string;
  preferredTimeEnd?: string;
  appointmentType: AppointmentTypeValue;
  notes?: string;
  priority: number;
  createdAt: string;
  notifiedAt: string;
  isFulfilled: boolean;
  fulfilledAppointmentId?: string;
  clients?: {
    firstName: string;
    lastName: string;
  };
  staff?: {
    firstName: string;
    lastName: string;
  };
}

export interface CreateWaitlistData {
  clientId: string;
  providerId: string;
  preferredDate: string;
  preferredTimeStart?: string;
  preferredTimeEnd?: string;
  appointmentType: AppointmentTypeValue;
  notes?: string;
  priority?: number;
}

export interface ProviderSchedule {
  id: string;
  providerId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  breakStartTime?: string;
  breakEndTime?: string;
  effectiveFrom: string;
  effectiveUntil?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScheduleData {
  providerId?: string; // Made optional since it's set in backend
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isAvailable?: boolean;
  breakStartTime?: string;
  breakEndTime?: string;
  effectiveFrom?: string;
  effectiveUntil?: string;
  status?: string;
}

export interface CreateScheduleExceptionData {
  providerId?: string; // Made optional since it's set in backend
  exceptionDate: string;
  startTime?: string;
  endTime?: string;
  isUnavailable?: boolean;
  reason?: string;
}

export interface ScheduleException {
  id: string;
  providerId: string;
  exceptionDate: string;
  startTime?: string;
  endTime?: string;
  isUnavailable?: boolean;
  reason?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  time: string;
  dayOfWeek?: number; // 0-6 (Sunday-Saturday)
  dayOfMonth?: number; // 1-31
  month?: number; // 1-12
}

class SchedulingService {
  // Appointment methods
  async createAppointment(data: CreateAppointmentData): Promise<Appointment> {
    const response = await apiClient.post<Appointment>('/scheduling/appointments', data);
    return response.data;
  }

  async getAppointments(params?: QueryAppointmentsParams): Promise<Appointment[]> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const response = await apiClient.get<Appointment[]>(`/scheduling/appointments?${queryParams.toString()}`);
    return response.data;
  }

  async getAppointment(id: string): Promise<Appointment> {
    const response = await apiClient.get<Appointment>(`/scheduling/appointments/${id}`);
    return response.data;
  }

  async updateAppointment(id: string, data: UpdateAppointmentData): Promise<Appointment> {
    const response = await apiClient.patch<Appointment>(`/scheduling/appointments/${id}`, data);
    return response.data;
  }

  async updateAppointmentStatus(id: string, status: string): Promise<Appointment> {
    const response = await apiClient.patch<Appointment>(`/scheduling/appointments/${id}/status`, { status });
    return response.data;
  }

  async deleteAppointment(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/scheduling/appointments/${id}`);
    return response.data;
  }

  // Conflict detection
  async checkConflicts(params: ConflictCheckParams): Promise<ConflictResult> {
    const response = await apiClient.post<ConflictResult>('/scheduling/conflicts/check', params);
    return response.data;
  }

  // Waitlist methods
  async createWaitlistEntry(data: CreateWaitlistData): Promise<WaitlistEntry> {
    const response = await apiClient.post<WaitlistEntry>('/scheduling/waitlist', data);
    return response.data;
  }

  async getWaitlistEntries(): Promise<WaitlistEntry[]> {
    const response = await apiClient.get<WaitlistEntry[]>('/scheduling/waitlist');
    return response.data;
  }

  // Provider schedule methods
  async createProviderSchedule(data: CreateScheduleData): Promise<ProviderSchedule> {
    const response = await apiClient.post<ProviderSchedule>('/scheduling/schedules', data);
    return response.data;
  }

  async createProviderSchedules(schedules: CreateScheduleData[]): Promise<{ message: string; count: number }> {
    const response = await apiClient.post<{ message: string; count: number }>('/scheduling/schedules/bulk', schedules);
    return response.data;
  }

  async updateProviderSchedules(schedules: CreateScheduleData[]): Promise<{ message: string; count: number }> {
    const response = await apiClient.patch<{ message: string; count: number }>('/scheduling/schedules/bulk', schedules);
    return response.data;
  }

  async deleteAllProviderSchedules(): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>('/scheduling/schedules/all');
    return response.data;
  }

  async getProviderSchedules(providerId?: string): Promise<ProviderSchedule[]> {
    const queryParams = providerId ? `?providerId=${providerId}` : '';
    const response = await apiClient.get<ProviderSchedule[]>(`/scheduling/schedules${queryParams}`);
    return response.data;
  }

  async getScheduleExceptions(providerId?: string): Promise<ScheduleException[]> {
    const queryParams = providerId ? `?providerId=${providerId}` : '';
    const response = await apiClient.get<ScheduleException[]>(`/scheduling/schedules/exceptions${queryParams}`);
    return response.data;
  }

  async createScheduleException(data: CreateScheduleExceptionData): Promise<ScheduleException> {
    const response = await apiClient.post<ScheduleException>('/scheduling/schedules/exceptions', data);
    return response.data;
  }

  async updateScheduleException(id: string, data: CreateScheduleExceptionData): Promise<ScheduleException> {
    const response = await apiClient.patch<ScheduleException>(`/scheduling/schedules/exceptions/${id}`, data);
    return response.data;
  }

  async deleteScheduleException(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/scheduling/schedules/exceptions/${id}`);
    return response.data;
  }
}

export const schedulingService = new SchedulingService(); 