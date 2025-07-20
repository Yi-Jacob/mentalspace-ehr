import { z } from 'zod';
import { apiClient } from './client';
import { errorHandler } from './errorHandler';

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
      // Log to console for now, could be sent to external service
      console.log('API Request Log:', {
        ...requestData,
        timestamp: new Date().toISOString()
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
      // Input validation
      if (config.validation) {
        const validation = this.middleware.validate(config.validation.data, config.validation.schema);
        if (!validation.success) {
          statusCode = 400;
          throw new Error(JSON.stringify(validation.errors));
        }
      }

      // Execute the API call
      result = await operation();

      // Log successful request
      await this.middleware.logRequest({
        method: config.method,
        url: config.endpoint,
        statusCode,
        responseTime: Date.now() - startTime
      });

      return result;
    } catch (err) {
      error = err;
      statusCode = err.status || 500;

      // Log failed request
      await this.middleware.logRequest({
        method: config.method,
        url: config.endpoint,
        statusCode,
        responseTime: Date.now() - startTime,
        errorMessage: err.message
      });

      throw err;
    }
  }
} 