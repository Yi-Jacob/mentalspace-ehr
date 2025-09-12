import { apiClient } from './api-helper/client';

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  userRole?: string;
  action: string;
  resource: string;
  resourceId?: string;
  description: string;
  ipAddress?: string;
  userAgent?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
  oldValues?: any;
  newValues?: any;
  createdAt: string;
}

export interface AuditLogFilters {
  userId?: string;
  action?: string;
  resource?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface AuditLogResponse {
  logs: AuditLog[];
  total: number;
}

export interface AuditStats {
  period: string;
  totalLogs: number;
  actionCounts: Record<string, number>;
  resourceCounts: Record<string, number>;
  deviceTypeCounts: Record<string, number>;
  browserCounts: Record<string, number>;
  osCounts: Record<string, number>;
  userCounts: Array<{ email: string; count: number }>;
}

class AuditService {
  private baseUrl = '/audit';

  /**
   * Get audit logs with filtering and pagination
   */
  async getAuditLogs(filters: AuditLogFilters = {}): Promise<AuditLogResponse> {
    const params = new URLSearchParams();
    
    if (filters.userId) params.append('userId', filters.userId);
    if (filters.action) params.append('action', filters.action);
    if (filters.resource) params.append('resource', filters.resource);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.offset) params.append('offset', filters.offset.toString());

    const response = await apiClient.get(`${this.baseUrl}/logs?${params.toString()}`);
    return response.data;
  }

  /**
   * Get audit statistics
   */
  async getAuditStats(days: number = 30): Promise<AuditStats> {
    const response = await apiClient.get(`${this.baseUrl}/stats?days=${days}`);
    return response.data;
  }

  /**
   * Export audit logs to CSV
   */
  async exportAuditLogs(filters: AuditLogFilters = {}): Promise<Blob> {
    const params = new URLSearchParams();
    
    if (filters.userId) params.append('userId', filters.userId);
    if (filters.action) params.append('action', filters.action);
    if (filters.resource) params.append('resource', filters.resource);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);

    const response = await apiClient.get(`${this.baseUrl}/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  }

  /**
   * Get unique values for filter dropdowns
   */
  async getFilterOptions(): Promise<{
    actions: string[];
    resources: string[];
    users: string[];
  }> {
    const stats = await this.getAuditStats(365); // Get data for the last year
    
    return {
      actions: Object.keys(stats.actionCounts),
      resources: Object.keys(stats.resourceCounts),
      users: stats.userCounts.map(user => user.email),
    };
  }
}

export const auditService = new AuditService();
