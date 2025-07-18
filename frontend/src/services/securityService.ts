import { supabase } from '@/integrations/supabase/client';
import { ENV_CONFIG } from './environmentConfig';
import { productionLogger } from './productionLogging';

interface SecurityAuditLog {
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: Record<string, any>;
  severity?: 'info' | 'warning' | 'critical';
  status?: 'success' | 'failure' | 'blocked';
}

interface HIPAAAccessLog {
  patient_id: string;
  access_type: 'view' | 'create' | 'update' | 'delete' | 'export';
  data_accessed?: string;
  purpose?: string;
}

export class SecurityService {
  private static instance: SecurityService;
  
  public static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  // Security audit logging
  async logSecurityEvent(event: SecurityAuditLog): Promise<void> {
    try {
      await supabase.rpc('log_security_event', {
        p_action: event.action,
        p_resource_type: event.resource_type,
        p_resource_id: event.resource_id || null,
        p_details: event.details || {},
        p_severity: event.severity || 'info',
        p_status: event.status || 'success'
      });

      productionLogger.info('Security event logged', event);
    } catch (error) {
      productionLogger.error('Failed to log security event', error);
    }
  }

  // HIPAA access logging
  async logHIPAAAccess(access: HIPAAAccessLog): Promise<void> {
    try {
      await supabase.rpc('log_hipaa_access', {
        p_patient_id: access.patient_id,
        p_access_type: access.access_type,
        p_data_accessed: access.data_accessed || null,
        p_purpose: access.purpose || null
      });

      productionLogger.info('HIPAA access logged', access);
    } catch (error) {
      productionLogger.error('Failed to log HIPAA access', error);
    }
  }

  // Enhanced permission checking
  async hasPermission(
    category: string, 
    action: string, 
    scope: string = 'all'
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('has_permission', {
        _user_id: await this.getCurrentUserId(),
        _category: category,
        _action: action,
        _scope: scope
      });

      if (error) {
        this.logSecurityEvent({
          action: 'permission_check_failed',
          resource_type: 'permissions',
          details: { category, action, scope, error: error.message },
          severity: 'warning',
          status: 'failure'
        });
        return false;
      }

      return data || false;
    } catch (error) {
      productionLogger.error('Permission check error', error);
      return false;
    }
  }

  // Patient access control with HIPAA logging
  async checkPatientAccess(
    patientId: string, 
    accessType: HIPAAAccessLog['access_type'],
    purpose?: string
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('can_access_patient_enhanced', {
        _user_id: await this.getCurrentUserId(),
        _client_id: patientId,
        _access_type: accessType
      });

      const hasAccess = data || false;

      // Always log the access attempt
      await this.logHIPAAAccess({
        patient_id: patientId,
        access_type: accessType,
        purpose: purpose || `${accessType} access check`
      });

      if (!hasAccess) {
        await this.logSecurityEvent({
          action: 'unauthorized_patient_access_attempt',
          resource_type: 'patient_records',
          resource_id: patientId,
          details: { access_type: accessType, purpose },
          severity: 'warning',
          status: 'blocked'
        });
      }

      return hasAccess;
    } catch (error) {
      productionLogger.error('Patient access check error', error);
      return false;
    }
  }

  // Data anonymization for HIPAA compliance
  anonymizeData<T extends Record<string, any>>(data: T, tableName: string): T {
    const sensitiveFields = this.getSensitiveFields(tableName);
    const anonymized = { ...data } as any;

    for (const field of sensitiveFields) {
      if (anonymized[field]) {
        switch (field) {
          case 'first_name':
          case 'last_name':
            anonymized[field] = this.anonymizeName(anonymized[field]);
            break;
          case 'email':
            anonymized[field] = this.anonymizeEmail(anonymized[field]);
            break;
          case 'phone_number':
            anonymized[field] = this.anonymizePhone(anonymized[field]);
            break;
          case 'date_of_birth':
            anonymized[field] = this.anonymizeDate(anonymized[field]);
            break;
          default:
            anonymized[field] = '[REDACTED]';
        }
      }
    }

    return anonymized as T;
  }

  // Get sensitive fields for a table
  private getSensitiveFields(tableName: string): string[] {
    const fieldMappings: Record<string, string[]> = {
      clients: ['first_name', 'last_name', 'email', 'date_of_birth'],
      client_phone_numbers: ['phone_number'],
      client_insurance: ['policy_number'],
      clinical_notes: ['content'],
      users: ['email', 'first_name', 'last_name']
    };

    return fieldMappings[tableName] || [];
  }

  // Anonymization helpers
  private anonymizeName(name: string): string {
    if (!name || name.length === 0) return name;
    return name.charAt(0) + '*'.repeat(name.length - 1);
  }

  private anonymizeEmail(email: string): string {
    if (!email || !email.includes('@')) return '[REDACTED]';
    const [local, domain] = email.split('@');
    return local.charAt(0) + '*'.repeat(Math.max(0, local.length - 1)) + '@' + domain;
  }

  private anonymizePhone(phone: string): string {
    if (!phone) return phone;
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length >= 4) {
      return '*'.repeat(cleaned.length - 4) + cleaned.slice(-4);
    }
    return '*'.repeat(cleaned.length);
  }

  private anonymizeDate(date: string): string {
    if (!date) return date;
    const d = new Date(date);
    if (isNaN(d.getTime())) return '[REDACTED]';
    return d.getFullYear() + '-**-**';
  }

  // Security headers for production
  getSecurityHeaders(): Record<string, string> {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': this.getCSPHeader(),
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': this.getPermissionsPolicy()
    };
  }

  private getCSPHeader(): string {
    const isProduction = ENV_CONFIG.app.environment === 'production';
    
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Vite needs unsafe-eval in dev
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      `connect-src 'self' ${ENV_CONFIG.supabase.url} https://*.supabase.co`,
      "font-src 'self' data:",
      "object-src 'none'",
      "media-src 'self'",
      "frame-src 'none'",
      isProduction ? "upgrade-insecure-requests" : ""
    ].filter(Boolean).join('; ');
  }

  private getPermissionsPolicy(): string {
    return [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=()',
      'usb=()',
      'accelerometer=()',
      'gyroscope=()',
      'magnetometer=()'
    ].join(', ');
  }

  // Session security
  validateSession(): boolean {
    try {
      const sessionData = localStorage.getItem('mentalspace-auth');
      if (!sessionData) return false;

      const session = JSON.parse(sessionData);
      if (!session?.expires_at) return false;

      const expiresAt = new Date(session.expires_at);
      const now = new Date();

      if (now >= expiresAt) {
        this.logSecurityEvent({
          action: 'session_expired',
          resource_type: 'authentication',
          severity: 'info'
        });
        return false;
      }

      return true;
    } catch (error) {
      productionLogger.error('Session validation error', error);
      return false;
    }
  }

  // Rate limiting check
  async checkRateLimit(action: string, limit: number = 10): Promise<boolean> {
    const key = `rate_limit_${await this.getCurrentUserId()}_${action}`;
    const now = Date.now();
    const window = 60000; // 1 minute window

    try {
      const stored = localStorage.getItem(key);
      const data = stored ? JSON.parse(stored) : { count: 0, window: now };

      // Reset if window expired
      if (now - data.window > window) {
        data.count = 0;
        data.window = now;
      }

      data.count++;
      localStorage.setItem(key, JSON.stringify(data));

      if (data.count > limit) {
        await this.logSecurityEvent({
          action: 'rate_limit_exceeded',
          resource_type: 'api',
          details: { action, count: data.count, limit },
          severity: 'warning',
          status: 'blocked'
        });
        return false;
      }

      return true;
    } catch (error) {
      productionLogger.error('Rate limit check error', error);
      return true; // Fail open
    }
  }

  private async getCurrentUserId(): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', user?.id)
      .single();
    
    return userData?.id || '';
  }
}

export const securityService = SecurityService.getInstance();