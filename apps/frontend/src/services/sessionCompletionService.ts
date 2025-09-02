import { apiClient } from './api-helper/client';

export interface SessionCompletion {
  id: string;
  appointmentId: string;
  providerId: string;
  clientId: string;
  sessionType: string;
  durationMinutes: number;
  sessionDate: string;
  noteId?: string;
  isNoteSigned: boolean;
  noteSignedAt?: string;
  isLocked: boolean;
  lockedAt?: string;
  calculatedAmount?: number;
  payPeriodWeek: string;
  isPaid: boolean;
  supervisorOverrideBy?: string;
  supervisorOverrideReason?: string;
  supervisorOverrideAt?: string;
  deadline?: string;
  deadlineStatus?: {
    status: 'pending' | 'met' | 'overdue' | 'urgent';
    deadline: string;
    isOverdue: boolean;
  };
  client: {
    firstName: string;
    lastName: string;
  };
  provider?: {
    firstName: string;
    lastName: string;
  };
}

export interface CreateSessionCompletionDto {
  appointmentId: string;
  providerId: string;
  clientId: string;
  sessionType: string;
  durationMinutes: number;
  sessionDate: string;
}

export interface UpdateSessionCompletionDto {
  sessionType?: string;
  durationMinutes?: number;
  sessionDate?: string;
  noteId?: string;
  isNoteSigned?: boolean;
  noteSignedAt?: string;
  isLocked?: boolean;
  lockedAt?: string;
  calculatedAmount?: number;
  payPeriodWeek?: string;
  isPaid?: boolean;
  supervisorOverrideBy?: string;
  supervisorOverrideReason?: string;
  supervisorOverrideAt?: string;
}

class SessionCompletionService {
  private baseUrl = '/compliance/session-completion';

  // Get all session completions with optional filters
  async getAllSessionCompletions(
    status?: string,
    providerId?: string,
    clientId?: string
  ): Promise<SessionCompletion[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (providerId) params.append('providerId', providerId);
    if (clientId) params.append('clientId', clientId);

    const url = `${this.baseUrl}?${params.toString()}`;
    const response = await apiClient.get<SessionCompletion[]>(url);
    return response.data;
  }

  // Get session completion by ID
  async getSessionCompletionById(id: string): Promise<SessionCompletion> {
    const response = await apiClient.get<SessionCompletion>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // Create new session completion
  async createSessionCompletion(data: CreateSessionCompletionDto): Promise<SessionCompletion> {
    const response = await apiClient.post<SessionCompletion>(this.baseUrl, data);
    return response.data;
  }

  // Update session completion
  async updateSessionCompletion(id: string, data: UpdateSessionCompletionDto): Promise<SessionCompletion> {
    const response = await apiClient.put<SessionCompletion>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  // Delete session completion
  async deleteSessionCompletion(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }

  // Sign note for session
  async signNote(id: string, signedBy: string): Promise<SessionCompletion> {
    const response = await apiClient.post<SessionCompletion>(`${this.baseUrl}/${id}/sign-note`, { signedBy });
    return response.data;
  }

  // Get sessions with deadlines (for compliance page)
  async getSessionsWithDeadlines(providerId?: string): Promise<SessionCompletion[]> {
    const params = new URLSearchParams();
    if (providerId) params.append('providerId', providerId);
    
    const url = `${this.baseUrl}/with-deadlines${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiClient.get<SessionCompletion[]>(url);
    return response.data;
  }

  // Mark session as completed (note signed)
  async markSessionAsCompleted(id: string): Promise<SessionCompletion> {
    const response = await apiClient.post<SessionCompletion>(`${this.baseUrl}/${id}/mark-completed`, {});
    return response.data;
  }

  // Lock session
  async lockSession(id: string, lockedBy: string, reason?: string): Promise<SessionCompletion> {
    const response = await apiClient.post<SessionCompletion>(`${this.baseUrl}/${id}/lock-session`, { lockedBy, reason });
    return response.data;
  }

  // Supervisor override
  async supervisorOverride(id: string, overrideBy: string, reason: string): Promise<SessionCompletion> {
    const response = await apiClient.post<SessionCompletion>(`${this.baseUrl}/${id}/supervisor-override`, { overrideBy, reason });
    return response.data;
  }

  // Create session completion from appointment
  async createFromAppointment(appointmentId: string): Promise<SessionCompletion> {
    const response = await apiClient.post<SessionCompletion>(`${this.baseUrl}/from-appointment/${appointmentId}`);
    return response.data;
  }

  // Bulk create session completions from appointments
  async bulkCreateFromAppointments(appointmentIds: string[]): Promise<Array<{
    appointmentId: string;
    success: boolean;
    session?: SessionCompletion;
    error?: string;
  }>> {
    const response = await apiClient.post<Array<{
      appointmentId: string;
      success: boolean;
      session?: SessionCompletion;
      error?: string;
    }>>(`${this.baseUrl}/bulk-from-appointments`, { appointmentIds });
    return response.data;
  }
}

export const sessionCompletionService = new SessionCompletionService();
