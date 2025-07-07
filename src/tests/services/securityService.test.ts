import { describe, it, expect, vi, beforeEach } from 'vitest';
import { securityService } from '@/services/securityService';
import { supabase } from '@/integrations/supabase/client';

// Mock the supabase client
vi.mock('@/integrations/supabase/client');

describe('SecurityService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('logSecurityEvent', () => {
    it('should log security events successfully', async () => {
      const mockRpc = vi.fn().mockResolvedValue({ data: null, error: null });
      vi.mocked(supabase.rpc).mockImplementation(mockRpc);

      await securityService.logSecurityEvent({
        action: 'login_attempt',
        resource_type: 'authentication',
        severity: 'info'
      });

      expect(mockRpc).toHaveBeenCalledWith('log_security_event', {
        p_action: 'login_attempt',
        p_resource_type: 'authentication',
        p_resource_id: null,
        p_details: {},
        p_severity: 'info',
        p_status: 'success'
      });
    });

    it('should handle logging errors gracefully', async () => {
      const mockRpc = vi.fn().mockRejectedValue(new Error('Database error'));
      vi.mocked(supabase.rpc).mockImplementation(mockRpc);

      // Should not throw
      await expect(securityService.logSecurityEvent({
        action: 'test_action',
        resource_type: 'test'
      })).resolves.toBeUndefined();
    });
  });

  describe('logHIPAAAccess', () => {
    it('should log HIPAA access correctly', async () => {
      const mockRpc = vi.fn().mockResolvedValue({ data: null, error: null });
      vi.mocked(supabase.rpc).mockImplementation(mockRpc);

      await securityService.logHIPAAAccess({
        patient_id: 'patient-123',
        access_type: 'view',
        purpose: 'Medical review'
      });

      expect(mockRpc).toHaveBeenCalledWith('log_hipaa_access', {
        p_patient_id: 'patient-123',
        p_access_type: 'view',
        p_data_accessed: null,
        p_purpose: 'Medical review'
      });
    });
  });

  describe('anonymizeData', () => {
    it('should anonymize sensitive fields correctly', () => {
      const testData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone_number: '555-123-4567',
        date_of_birth: '1990-01-01',
        public_field: 'This should not be anonymized'
      };

      const anonymized = securityService.anonymizeData(testData, 'clients');

      expect(anonymized.first_name).toBe('J***');
      expect(anonymized.last_name).toBe('D**');
      expect(anonymized.email).toBe('j***********@example.com');
      expect(anonymized.phone_number).toBe('*******4567');
      expect(anonymized.date_of_birth).toBe('1990-**-**');
      expect(anonymized.public_field).toBe('This should not be anonymized');
    });

    it('should handle empty or null values', () => {
      const testData = {
        first_name: '',
        last_name: null,
        email: undefined,
        phone_number: '123'
      };

      const anonymized = securityService.anonymizeData(testData, 'clients');

      expect(anonymized.first_name).toBe('');
      expect(anonymized.last_name).toBe(null);
      expect(anonymized.email).toBe(undefined);
      expect(anonymized.phone_number).toBe('***');
    });
  });

  describe('hasPermission', () => {
    it('should check permissions correctly', async () => {
      const mockRpc = vi.fn().mockResolvedValue({ data: true, error: null });
      vi.mocked(supabase.rpc).mockImplementation(mockRpc);
      
      // Mock getCurrentUserId
      const mockAuth = vi.fn().mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null
      });
      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: 'internal-user-123' },
              error: null
            })
          })
        })
      });
      
      vi.mocked(supabase.auth.getUser).mockImplementation(mockAuth);
      vi.mocked(supabase.from).mockImplementation(mockFrom);

      const hasPermission = await securityService.hasPermission(
        'patient_records',
        'read',
        'all'
      );

      expect(hasPermission).toBe(true);
      expect(mockRpc).toHaveBeenCalledWith('has_permission', {
        _user_id: 'internal-user-123',
        _category: 'patient_records',
        _action: 'read',
        _scope: 'all'
      });
    });

    it('should return false on permission check errors', async () => {
      const mockRpc = vi.fn().mockResolvedValue({ 
        data: null, 
        error: { message: 'Permission denied' } 
      });
      vi.mocked(supabase.rpc).mockImplementation(mockRpc);

      const hasPermission = await securityService.hasPermission(
        'admin_panel',
        'access'
      );

      expect(hasPermission).toBe(false);
    });
  });

  describe('validateSession', () => {
    it('should validate active sessions', () => {
      const futureDate = new Date(Date.now() + 3600000).toISOString();
      const mockSessionData = {
        expires_at: futureDate,
        user: { id: 'user-123' }
      };

      // Mock localStorage
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: vi.fn().mockReturnValue(JSON.stringify(mockSessionData))
        },
        writable: true
      });

      const isValid = securityService.validateSession();
      expect(isValid).toBe(true);
    });

    it('should invalidate expired sessions', () => {
      const pastDate = new Date(Date.now() - 3600000).toISOString();
      const mockSessionData = {
        expires_at: pastDate,
        user: { id: 'user-123' }
      };

      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: vi.fn().mockReturnValue(JSON.stringify(mockSessionData))
        },
        writable: true
      });

      const isValid = securityService.validateSession();
      expect(isValid).toBe(false);
    });

    it('should handle missing session data', () => {
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: vi.fn().mockReturnValue(null)
        },
        writable: true
      });

      const isValid = securityService.validateSession();
      expect(isValid).toBe(false);
    });
  });

  describe('checkRateLimit', () => {
    it('should allow requests within rate limit', async () => {
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: vi.fn().mockReturnValue(null),
          setItem: vi.fn()
        },
        writable: true
      });

      const allowed = await securityService.checkRateLimit('test_action', 10);
      expect(allowed).toBe(true);
    });

    it('should block requests exceeding rate limit', async () => {
      const rateLimitData = {
        count: 15,
        window: Date.now()
      };

      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: vi.fn().mockReturnValue(JSON.stringify(rateLimitData)),
          setItem: vi.fn()
        },
        writable: true
      });

      const allowed = await securityService.checkRateLimit('test_action', 10);
      expect(allowed).toBe(false);
    });
  });
});