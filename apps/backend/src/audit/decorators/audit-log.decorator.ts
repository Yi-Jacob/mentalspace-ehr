import { SetMetadata } from '@nestjs/common';

export const AUDIT_LOG_KEY = 'audit_log';

export interface AuditLogOptions {
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'ACCESS';
  resource: string;
  description?: string;
  includeRequestBody?: boolean;
  includeResponseBody?: boolean;
  includeOldValues?: boolean;
  includeNewValues?: boolean;
}

/**
 * Decorator to automatically log audit events for controller methods
 */
export const AuditLog = (options: AuditLogOptions) => SetMetadata(AUDIT_LOG_KEY, options);
