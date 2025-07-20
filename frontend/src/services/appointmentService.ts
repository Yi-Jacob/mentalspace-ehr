import { apiClient } from './api-helper/client';

// Types
export interface Appointment {
  id: string;
  client_id: string;
  provider_id: string;
  start_time: string;
  end_time: string;
  appointment_type: AppointmentType;
  title?: string;
  notes?: string;
  location?: string;
  status: AppointmentStatus;
  created_at: string;
  updated_at: string;
}

export type AppointmentType = 
  | 'Initial Consultation'
  | 'Follow-up'
  | 'Therapy Session'
  | 'Assessment'
  | 'Group Session';

export type AppointmentStatus = 
  | 'scheduled'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export interface CreateAppointmentRequest {
  client_id: string;
  provider_id: string;
  start_time: string;
  end_time: string;
  appointment_type: AppointmentType;
  title?: string;
  notes?: string;
  location?: string;
}

export interface UpdateAppointmentRequest {
  start_time?: string;
  end_time?: string;
  appointment_type?: AppointmentType;
  title?: string;
  notes?: string;
  location?: string;
  status?: AppointmentStatus;
}

// Appointment Service
export class AppointmentService {
  private baseUrl = '/appointments';

  // Get all appointments
  async getAppointments(params?: {
    page?: number;
    limit?: number;
    clientId?: string;
    providerId?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<Appointment[]> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.clientId) queryParams.append('clientId', params.clientId);
    if (params?.providerId) queryParams.append('providerId', params.providerId);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params?.dateTo) queryParams.append('dateTo', params.dateTo);

    const url = `${this.baseUrl}?${queryParams.toString()}`;
    return apiClient.get<Appointment[]>(url);
  }

  // Get single appointment by ID
  async getAppointment(id: string): Promise<Appointment> {
    return apiClient.get<Appointment>(`${this.baseUrl}/${id}`);
  }

  // Create new appointment
  async createAppointment(data: CreateAppointmentRequest): Promise<Appointment> {
    return apiClient.post<Appointment>(this.baseUrl, data);
  }

  // Update existing appointment
  async updateAppointment(id: string, data: UpdateAppointmentRequest): Promise<Appointment> {
    return apiClient.put<Appointment>(`${this.baseUrl}/${id}`, data);
  }

  // Delete appointment
  async deleteAppointment(id: string): Promise<void> {
    return apiClient.delete(`${this.baseUrl}/${id}`);
  }

  // Get appointments by client
  async getClientAppointments(clientId: string, params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<Appointment[]> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);

    const url = `${this.baseUrl}/client/${clientId}?${queryParams.toString()}`;
    return apiClient.get<Appointment[]>(url);
  }

  // Get appointments by provider
  async getProviderAppointments(providerId: string, params?: {
    page?: number;
    limit?: number;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<Appointment[]> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params?.dateTo) queryParams.append('dateTo', params.dateTo);

    const url = `${this.baseUrl}/provider/${providerId}?${queryParams.toString()}`;
    return apiClient.get<Appointment[]>(url);
  }

  // Confirm appointment
  async confirmAppointment(id: string): Promise<Appointment> {
    return apiClient.patch<Appointment>(`${this.baseUrl}/${id}/confirm`, {});
  }

  // Cancel appointment
  async cancelAppointment(id: string, reason?: string): Promise<Appointment> {
    return apiClient.patch<Appointment>(`${this.baseUrl}/${id}/cancel`, { reason });
  }

  // Reschedule appointment
  async rescheduleAppointment(id: string, newStartTime: string, newEndTime: string): Promise<Appointment> {
    return apiClient.patch<Appointment>(`${this.baseUrl}/${id}/reschedule`, {
      start_time: newStartTime,
      end_time: newEndTime
    });
  }
}

export const appointmentService = new AppointmentService(); 