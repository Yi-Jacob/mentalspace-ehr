// Security utilities for authentication, authorization, and data protection

export interface SecurityEvent {
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: Record<string, any>;
  timestamp: number;
  userId?: string;
}

export interface SecurityConfig {
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordMinLength: number;
  requireMFA: boolean;
  auditLogging: boolean;
}

class SecurityService {
  private events: SecurityEvent[] = [];
  private config: SecurityConfig = {
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireMFA: false,
    auditLogging: true
  };

  // Log security event
  logSecurityEvent(event: Omit<SecurityEvent, 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: Date.now()
    };

    this.events.push(securityEvent);
    this.sendSecurityEvent(securityEvent);
  }

  // Validate password strength
  validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < this.config.passwordMinLength) {
      errors.push(`Password must be at least ${this.config.passwordMinLength} characters long`);
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Check session validity
  isSessionValid(): boolean {
    const lastActivity = localStorage.getItem('lastActivity');
    if (!lastActivity) return false;

    const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
    return timeSinceLastActivity < this.config.sessionTimeout;
  }

  // Update session activity
  updateSessionActivity(): void {
    localStorage.setItem('lastActivity', Date.now().toString());
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    return !!token && this.isSessionValid();
  }

  // Get user role
  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user?.role || null;
  }

  // Check if user has permission
  hasPermission(permission: string): boolean {
    const role = this.getUserRole();
    if (!role) return false;

    const rolePermissions = this.getRolePermissions(role);
    return rolePermissions.includes(permission);
  }

  // Sanitize data for logging (remove sensitive information)
  sanitizeData(data: any): any {
    const sensitiveFields = ['password', 'token', 'ssn', 'credit_card', 'bank_account'];
    
    if (typeof data === 'object' && data !== null) {
      const sanitized = { ...data };
      
      for (const field of sensitiveFields) {
        if (sanitized[field]) {
          sanitized[field] = '[REDACTED]';
        }
      }
      
      return sanitized;
    }
    
    return data;
  }

  // Encrypt sensitive data (basic implementation)
  encryptData(data: string): string {
    // In a real implementation, use proper encryption
    return btoa(data);
  }

  // Decrypt sensitive data (basic implementation)
  decryptData(encryptedData: string): string {
    // In a real implementation, use proper decryption
    return atob(encryptedData);
  }

  // Generate secure token
  generateSecureToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Validate token format
  validateTokenFormat(token: string): boolean {
    // Basic token validation
    return token.length >= 32 && /^[a-zA-Z0-9]+$/.test(token);
  }

  // Get security events
  getSecurityEvents(): SecurityEvent[] {
    return [...this.events];
  }

  // Clear security events
  clearSecurityEvents(): void {
    this.events = [];
  }

  // Update security configuration
  updateConfig(newConfig: Partial<SecurityConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Get current user from localStorage
  private getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Get role permissions
  private getRolePermissions(role: string): string[] {
    const permissions: Record<string, string[]> = {
      admin: ['read', 'write', 'delete', 'manage_users', 'view_audit_logs'],
      provider: ['read', 'write', 'manage_clients', 'view_reports'],
      staff: ['read', 'write', 'limited_access'],
      viewer: ['read']
    };

    return permissions[role] || [];
  }

  // Send security event to monitoring service
  private sendSecurityEvent(event: SecurityEvent): void {
    if (!this.config.auditLogging) return;

    // In a real implementation, send to security monitoring service
    console.log('Security Event:', this.sanitizeData(event));
  }
}

export const securityService = new SecurityService(); 