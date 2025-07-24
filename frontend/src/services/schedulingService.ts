import { apiClient } from './api-helper/client';

export interface Appointment {
  id: string;
  clientId: string;
  providerId: string;
  appointmentType: string;
  title?: string;
  description?: string;
  startTime: string;
  endTime: string;
  status: string;
  location?: string;
  roomNumber?: string;
  notes?: string;
  isRecurring?: boolean;
  recurringSeriesId?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
  cancelledBy?: string;
  cancellationReason?: string;
  noShowReason?: string;
  checkedInAt?: string;
  completedAt?: string;
  clients?: {
    firstName: string;
    lastName: string;
  };
  users?: {
    firstName: string;
    lastName: string;
  };
}

export interface CreateAppointmentData {
  clientId: string;
  providerId: string;
  appointmentType: string;
  title?: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  roomNumber?: string;
  notes?: string;
  isRecurring?: boolean;
  recurringSeriesId?: string;
  createdBy?: string;
}

export interface UpdateAppointmentData {
  id: string;
  title?: string;
  startTime?: string;
  endTime?: string;
  status?: string;
  location?: string;
  roomNumber?: string;
  notes?: string;
  appointmentType?: string;
}

export interface QueryAppointmentsParams {
  clientId?: string;
  providerId?: string;
  status?: string;
  appointmentType?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  viewType?: 'day' | 'week' | 'month' | 'list';
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
  appointmentType: string;
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
  users?: {
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
  appointmentType: string;
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
  providerId: string;
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

export interface ScheduleException {
  id: string;
  providerId: string;
  exceptionDate: string;
  exceptionType: string;
  startTime?: string;
  endTime?: string;
  isAvailable: boolean;
  reason?: string;
  createdAt: string;
  updatedAt: string;
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

  async getProviderSchedules(providerId?: string): Promise<ProviderSchedule[]> {
    const queryParams = providerId ? `?providerId=${providerId}` : '';
    const response = await apiClient.get<ProviderSchedule[]>(`/scheduling/schedules${queryParams}`);
    return response.data;
  }

  async getScheduleExceptions(): Promise<ScheduleException[]> {
    const response = await apiClient.get<ScheduleException[]>('/scheduling/schedules/exceptions');
    return response.data;
  }
}

export const schedulingService = new SchedulingService(); 