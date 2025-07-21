import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

// Enhanced validation schemas
export const ClientValidationSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(50),
  last_name: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  date_of_birth: z.string().optional().refine((date) => {
    if (!date) return true;
    const parsedDate = new Date(date);
    const now = new Date();
    const age = now.getFullYear() - parsedDate.getFullYear();
    return age >= 0 && age <= 120;
  }, 'Invalid date of birth'),
  phone_numbers: z.array(z.object({
    phone_number: z.string().regex(/^\+?[\d\s\-\(\)\.]+$/, 'Invalid phone format'),
    phone_type: z.enum(['Mobile', 'Home', 'Work', 'Other']),
    message_preference: z.enum(['No messages', 'Voice messages OK', 'Text messages OK', 'Voice/Text messages OK'])
  })).optional()
});

export const ClinicalNoteValidationSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  content: z.record(z.any()),
  client_id: z.string().uuid('Invalid client ID'),
  note_type: z.enum(['intake', 'progress_note', 'treatment_plan', 'contact_note', 'consultation_note', 'cancellation_note', 'miscellaneous_note']),
  status: z.enum(['draft', 'submitted_for_review', 'signed', 'locked']).optional()
});

export const AppointmentValidationSchema = z.object({
  client_id: z.string().uuid('Invalid client ID'),
  provider_id: z.string().uuid('Invalid provider ID'),
  start_time: z.string().datetime('Invalid start time'),
  end_time: z.string().datetime('Invalid end time'),
  appointment_type: z.enum(['Initial Consultation', 'Follow-up', 'Therapy Session', 'Assessment', 'Group Session']),
  title: z.string().min(1, 'Title is required').max(100).optional(),
  notes: z.string().max(500).optional(),
  location: z.string().max(100).optional()
});

// API Middleware class
export class APIMiddleware {
  private static instance: APIMiddleware;
  
  public static getInstance(): APIMiddleware {
    if (!APIMiddleware.instance) {
      APIMiddleware.instance = new APIMiddleware();
    }
    return APIMiddleware.instance;
  }

  // Rate limiting check
  async checkRateLimit(endpoint: string, identifier?: string): Promise<{ allowed: boolean; error?: string; headers?: Record<string, string> }> {
    try {
      const { data, error } = await supabase.functions.invoke('rate-limiter', {
        body: { 
          identifier: identifier || this.getClientIdentifier(),
          endpoint 
        }
      });

      if (error) {
        console.error('Rate limit check failed:', error);
        return { allowed: true }; // Fail open
      }

      if (data?.error) {
        return { 
          allowed: false, 
          error: data.error,
          headers: {
            'Retry-After': data.retryAfter?.toString() || '900',
            'X-RateLimit-Limit': data.limit?.toString() || '100',
            'X-RateLimit-Remaining': data.remaining?.toString() || '0',
            'X-RateLimit-Reset': data.reset || new Date(Date.now() + 15 * 60 * 1000).toISOString()
          }
        };
      }

      return { 
        allowed: true,
        headers: {
          'X-RateLimit-Limit': data.limit?.toString() || '100',
          'X-RateLimit-Remaining': data.remaining?.toString() || '99',
          'X-RateLimit-Reset': data.reset || new Date(Date.now() + 15 * 60 * 1000).toISOString()
        }
      };
    } catch (error) {
      console.error('Rate limit middleware error:', error);
      return { allowed: true }; // Fail open
    }
  }

  // Input validation
  validate<T>(data: unknown, schema: z.ZodSchema<T>): { success: boolean; data?: T; errors?: Record<string, string> } {
    try {
      const validated = schema.parse(data);
      return { success: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            errors[err.path.join('.')] = err.message;
          }
        });
        return { success: false, errors };
      }
      return { success: false, errors: { general: 'Validation failed' } };
    }
  }

  // Request/Response logging
  async logRequest(requestData: {
    method: string;
    url: string;
    statusCode: number;
    responseTime?: number;
    userId?: string;
    requestBody?: any;
    responseBody?: any;
    errorMessage?: string;
  }): Promise<void> {
    try {
      await supabase.functions.invoke('api-logger', {
        body: {
          ...requestData,
          ipAddress: this.getClientIP(),
          userAgent: navigator.userAgent
        }
      });
    } catch (error) {
      console.error('Failed to log request:', error);
    }
  }

  // Security headers
  getSecurityHeaders(): Record<string, string> {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://wjaccopklttdvnutdmtu.supabase.co;",
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    };
  }

  private getClientIdentifier(): string {
    // Try to get a stable identifier for rate limiting
    if (typeof window !== 'undefined') {
      return window.location.hostname + '-' + (sessionStorage.getItem('session-id') || 'anonymous');
    }
    return 'server-side';
  }

  private getClientIP(): string {
    // In a browser environment, we can't directly get the client IP
    // This would typically be handled by the server/edge function
    return 'client-side';
  }
}

// Request interceptor for automatic middleware application
export class APIRequestInterceptor {
  private middleware = APIMiddleware.getInstance();

  async intercept<T>(
    operation: () => Promise<T>,
    config: {
      endpoint: string;
      method: string;
      validation?: {
        schema: z.ZodSchema;
        data: unknown;
      };
      requireAuth?: boolean;
    }
  ): Promise<T> {
    const startTime = Date.now();
    let result: T;
    let error: any;
    let statusCode = 200;

    try {
      // Rate limiting check
      const rateLimitResult = await this.middleware.checkRateLimit(config.endpoint);
      if (!rateLimitResult.allowed) {
        throw new Error(rateLimitResult.error || 'Rate limit exceeded');
      }

      // Input validation
      if (config.validation) {
        const validation = this.middleware.validate(config.validation.data, config.validation.schema);
        if (!validation.success) {
          statusCode = 400;
          throw new Error(JSON.stringify(validation.errors));
        }
      }

      // Execute operation
      result = await operation();
      
      return result;
    } catch (err: any) {
      error = err;
      statusCode = err.status || err.statusCode || 500;
      throw err;
    } finally {
      // Log request
      const responseTime = Date.now() - startTime;
      await this.middleware.logRequest({
        method: config.method,
        url: config.endpoint,
        statusCode,
        responseTime,
        errorMessage: error?.message
      });
    }
  }
}

