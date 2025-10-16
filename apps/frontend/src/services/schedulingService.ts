import { apiClient } from './api-helper/client';
import {
  Appointment,
  CreateAppointmentData,
  UpdateAppointmentData,
  QueryAppointmentsParams,
  ConflictCheckParams,
  ConflictResult,
  WaitlistEntry,
  CreateWaitlistData,
  ProviderSchedule,
  CreateScheduleData,
  CreateScheduleExceptionData,
  ScheduleException,
  TimeSlot
} from '@/types/scheduleType';

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

  async getClientAppointments(clientId: string): Promise<Appointment[]> {
    const response = await apiClient.get<Appointment[]>(`/scheduling/appointments/client/${clientId}`);
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

  async cancelWaitlistEntry(waitlistId: string): Promise<void> {
    await apiClient.delete(`/scheduling/waitlist/${waitlistId}`);
  }

  async fulfillWaitlistEntry(waitlistId: string, appointmentId: string): Promise<void> {
    await apiClient.patch(`/scheduling/waitlist/${waitlistId}/fulfill`, { appointmentId });
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

  // Session management methods
  async signNote(appointmentId: string, signedBy?: string): Promise<Appointment> {
    const response = await apiClient.post<Appointment>(`/scheduling/appointments/${appointmentId}/sign-note`, { 
      signedBy: signedBy || 'current-user' 
    });
    return response.data;
  }

  async lockSession(appointmentId: string, lockedBy?: string, reason?: string): Promise<Appointment> {
    const response = await apiClient.post<Appointment>(`/scheduling/appointments/${appointmentId}/lock-session`, { 
      lockedBy: lockedBy || 'current-user',
      reason: reason || 'Session locked by provider'
    });
    return response.data;
  }

  async supervisorOverride(appointmentId: string, overrideBy?: string, reason?: string): Promise<Appointment> {
    const response = await apiClient.post<Appointment>(`/scheduling/appointments/${appointmentId}/supervisor-override`, { 
      overrideBy: overrideBy || 'current-user',
      reason: reason || 'Session unlocked by supervisor'
    });
    return response.data;
  }
}

export const schedulingService = new SchedulingService(); 