import { apiClient } from './api-helper/client';

export interface TimeEntry {
  id: string;
  userId: string;
  entryDate: string;
  clockInTime: string;
  clockOutTime?: string;
  breakStartTime?: string;
  breakEndTime?: string;
  totalHours?: number;
  regularHours?: number;
  overtimeHours?: number;
  isApproved?: boolean;
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    firstName: string;
    lastName: string;
  };
  approvedByUser?: {
    firstName: string;
    lastName: string;
  };
}

export interface ComplianceDeadline {
  id: string;
  providerId: string;
  deadlineType: string;
  deadlineDate: string;
  isMet?: boolean;
  notesPending?: number;
  notesCompleted?: number;
  reminderSent24h?: boolean;
  reminderSent48h?: boolean;
  reminderSent72h?: boolean;
  supervisorNotified?: boolean;
  createdAt: string;
  updatedAt: string;
  provider?: {
    firstName: string;
    lastName: string;
  };
}

export interface SessionCompletion {
  id: string;
  appointmentId: string;
  providerId: string;
  clientId: string;
  sessionType: string;
  durationMinutes: number;
  sessionDate: string;
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
  createdAt: string;
  updatedAt: string;
  provider?: {
    firstName: string;
    lastName: string;
  };
  client?: {
    firstName: string;
    lastName: string;
  };
}

export interface ProviderCompensation {
  id: string;
  providerId: string;
  compensationType: string;
  baseSessionRate?: number;
  baseHourlyRate?: number;
  experienceTier?: number;
  isOvertimeEligible?: boolean;
  eveningDifferential?: number;
  weekendDifferential?: number;
  effectiveDate: string;
  expirationDate?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  provider?: {
    firstName: string;
    lastName: string;
  };
  createdByUser?: {
    firstName: string;
    lastName: string;
  };
}

export interface DeadlineException {
  id: string;
  providerId: string;
  sessionCompletionId: string;
  requestedExtensionUntil: string;
  reason: string;
  status?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
  provider?: {
    firstName: string;
    lastName: string;
  };
  reviewedByUser?: {
    firstName: string;
    lastName: string;
  };
}

export interface CreateTimeEntryData {
  userId: string;
  entryDate: string;
  clockInTime: string;
  clockOutTime?: string;
  breakStartTime?: string;
  breakEndTime?: string;
  totalHours?: number;
  regularHours?: number;
  overtimeHours?: number;
  isApproved?: boolean;
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
}

export interface CreateComplianceDeadlineData {
  providerId: string;
  deadlineType: string;
  deadlineDate: string;
  isMet?: boolean;
  notesPending?: number;
  notesCompleted?: number;
  reminderSent24h?: boolean;
  reminderSent48h?: boolean;
  reminderSent72h?: boolean;
  supervisorNotified?: boolean;
}

export interface CreateSessionCompletionData {
  appointmentId: string;
  providerId: string;
  clientId: string;
  sessionType: string;
  durationMinutes: number;
  sessionDate: string;
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

export interface CreateProviderCompensationData {
  providerId: string;
  compensationType: string;
  baseSessionRate?: number;
  baseHourlyRate?: number;
  experienceTier?: number;
  isOvertimeEligible?: boolean;
  eveningDifferential?: number;
  weekendDifferential?: number;
  effectiveDate: string;
  expirationDate?: string;
  isActive?: boolean;
  createdBy?: string;
}

export interface CreateDeadlineExceptionData {
  providerId: string;
  sessionCompletionId: string;
  requestedExtensionUntil: string;
  reason: string;
  status?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

// Time Tracking API
export const timeTrackingApi = {
  getAll: async (date?: string, userId?: string): Promise<TimeEntry[]> => {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (userId) params.append('userId', userId);
    
    const response = await apiClient.get(`/compliance/time-tracking?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<TimeEntry> => {
    const response = await apiClient.get(`/compliance/time-tracking/${id}`);
    return response.data;
  },

  create: async (data: CreateTimeEntryData): Promise<TimeEntry> => {
    const response = await apiClient.post('/compliance/time-tracking', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateTimeEntryData>): Promise<TimeEntry> => {
    const response = await apiClient.put(`/compliance/time-tracking/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/compliance/time-tracking/${id}`);
  },

  clockIn: async (userId: string): Promise<TimeEntry> => {
    const response = await apiClient.post('/compliance/time-tracking/clock-in', { userId });
    return response.data;
  },

  clockOut: async (id: string): Promise<TimeEntry> => {
    const response = await apiClient.post(`/compliance/time-tracking/${id}/clock-out`);
    return response.data;
  },

  approve: async (id: string, approvedBy: string): Promise<TimeEntry> => {
    const response = await apiClient.post(`/compliance/time-tracking/${id}/approve`, { approvedBy });
    return response.data;
  },
};

// Compliance Deadlines API
export const complianceDeadlinesApi = {
  getAll: async (status?: string, providerId?: string): Promise<ComplianceDeadline[]> => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (providerId) params.append('providerId', providerId);
    
    const response = await apiClient.get(`/compliance/deadlines?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<ComplianceDeadline> => {
    const response = await apiClient.get(`/compliance/deadlines/${id}`);
    return response.data;
  },

  create: async (data: CreateComplianceDeadlineData): Promise<ComplianceDeadline> => {
    const response = await apiClient.post('/compliance/deadlines', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateComplianceDeadlineData>): Promise<ComplianceDeadline> => {
    const response = await apiClient.put(`/compliance/deadlines/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/compliance/deadlines/${id}`);
  },

  markAsMet: async (id: string): Promise<ComplianceDeadline> => {
    const response = await apiClient.post(`/compliance/deadlines/${id}/mark-met`);
    return response.data;
  },

  sendReminders: async (): Promise<{ message: string; remindersSent: any[] }> => {
    const response = await apiClient.post('/compliance/deadlines/send-reminders');
    return response.data;
  },
};

// Session Completions API
export const sessionCompletionsApi = {
  getAll: async (status?: string, providerId?: string, clientId?: string): Promise<SessionCompletion[]> => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (providerId) params.append('providerId', providerId);
    if (clientId) params.append('clientId', clientId);
    
    const response = await apiClient.get(`/compliance/session-completions?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<SessionCompletion> => {
    const response = await apiClient.get(`/compliance/session-completions/${id}`);
    return response.data;
  },

  create: async (data: CreateSessionCompletionData): Promise<SessionCompletion> => {
    const response = await apiClient.post('/compliance/session-completions', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateSessionCompletionData>): Promise<SessionCompletion> => {
    const response = await apiClient.put(`/compliance/session-completions/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/compliance/session-completions/${id}`);
  },

  signNote: async (id: string, signedBy: string): Promise<SessionCompletion> => {
    const response = await apiClient.post(`/compliance/session-completions/${id}/sign-note`, { signedBy });
    return response.data;
  },

  lockSession: async (id: string, lockedBy: string, reason?: string): Promise<SessionCompletion> => {
    const response = await apiClient.post(`/compliance/session-completions/${id}/lock-session`, { lockedBy, reason });
    return response.data;
  },

  supervisorOverride: async (id: string, overrideBy: string, reason: string): Promise<SessionCompletion> => {
    const response = await apiClient.post(`/compliance/session-completions/${id}/supervisor-override`, { overrideBy, reason });
    return response.data;
  },
};

// Provider Compensation API
export const providerCompensationApi = {
  getAll: async (providerId?: string): Promise<ProviderCompensation[]> => {
    const params = new URLSearchParams();
    if (providerId) params.append('providerId', providerId);
    
    const response = await apiClient.get(`/compliance/provider-compensation?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<ProviderCompensation> => {
    const response = await apiClient.get(`/compliance/provider-compensation/${id}`);
    return response.data;
  },

  create: async (data: CreateProviderCompensationData): Promise<ProviderCompensation> => {
    const response = await apiClient.post('/compliance/provider-compensation', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateProviderCompensationData>): Promise<ProviderCompensation> => {
    const response = await apiClient.put(`/compliance/provider-compensation/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/compliance/provider-compensation/${id}`);
  },

  getSessionMultipliers: async (providerId?: string): Promise<any[]> => {
    const params = new URLSearchParams();
    if (providerId) params.append('providerId', providerId);
    
    const response = await apiClient.get(`/compliance/provider-compensation/session-multipliers?${params.toString()}`);
    return response.data;
  },
};

// Deadline Exceptions API
export const deadlineExceptionsApi = {
  getAll: async (status?: string, providerId?: string): Promise<DeadlineException[]> => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (providerId) params.append('providerId', providerId);
    
    const response = await apiClient.get(`/compliance/deadline-exceptions?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<DeadlineException> => {
    const response = await apiClient.get(`/compliance/deadline-exceptions/${id}`);
    return response.data;
  },

  create: async (data: CreateDeadlineExceptionData): Promise<DeadlineException> => {
    const response = await apiClient.post('/compliance/deadline-exceptions', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateDeadlineExceptionData>): Promise<DeadlineException> => {
    const response = await apiClient.put(`/compliance/deadline-exceptions/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/compliance/deadline-exceptions/${id}`);
  },

  approve: async (id: string, reviewedBy: string, reviewNotes?: string): Promise<DeadlineException> => {
    const response = await apiClient.post(`/compliance/deadline-exceptions/${id}/approve`, { reviewedBy, reviewNotes });
    return response.data;
  },

  reject: async (id: string, reviewedBy: string, reviewNotes?: string): Promise<DeadlineException> => {
    const response = await apiClient.post(`/compliance/deadline-exceptions/${id}/reject`, { reviewedBy, reviewNotes });
    return response.data;
  },
};

// General Compliance API
export const complianceApi = {
  getDashboard: async (): Promise<any> => {
    const response = await apiClient.get('/compliance/dashboard');
    return response.data;
  },

  getOverview: async (): Promise<any> => {
    const response = await apiClient.get('/compliance/overview');
    return response.data;
  },
}; 