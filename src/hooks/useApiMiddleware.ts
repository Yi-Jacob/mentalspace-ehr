import { useState, useCallback } from 'react';
import { z } from 'zod';
import { APIMiddleware, APIRequestInterceptor, ClientValidationSchema, ClinicalNoteValidationSchema, AppointmentValidationSchema } from '@/services/apiMiddleware';
import { toast } from '@/hooks/use-toast';

export interface ApiCallConfig {
  endpoint: string;
  method: string;
  validation?: {
    schema: z.ZodSchema;
    data: unknown;
  };
  requireAuth?: boolean;
  showToastOnError?: boolean;
  showToastOnSuccess?: boolean;
  successMessage?: string;
}

export const useApiMiddleware = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const interceptor = new APIRequestInterceptor();

  const executeWithMiddleware = useCallback(
    async <T>(
      operation: () => Promise<T>,
      config: ApiCallConfig
    ): Promise<T | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await interceptor.intercept(operation, {
          endpoint: config.endpoint,
          method: config.method,
          validation: config.validation,
          requireAuth: config.requireAuth
        });

        if (config.showToastOnSuccess) {
          toast({
            title: "Success",
            description: config.successMessage || "Operation completed successfully",
          });
        }

        return result;
      } catch (err: any) {
        const errorMessage = err.message || 'An unexpected error occurred';
        setError(errorMessage);

        if (config.showToastOnError !== false) {
          // Handle specific error types
          if (errorMessage.includes('Rate limit exceeded')) {
            toast({
              title: "Rate Limit Exceeded",
              description: "Please wait a moment before trying again.",
              variant: "destructive",
            });
          } else if (errorMessage.includes('Validation failed')) {
            toast({
              title: "Validation Error",
              description: "Please check your input and try again.",
              variant: "destructive",
            });
          } else if (errorMessage.includes('Unauthorized')) {
            toast({
              title: "Authentication Required",
              description: "Please log in to continue.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Error",
              description: errorMessage,
              variant: "destructive",
            });
          }
        }

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [interceptor]
  );

  // Pre-configured hooks for common operations
  const createClient = useCallback(
    async (clientData: unknown) => {
      return executeWithMiddleware(
        async () => {
          // This would be replaced with actual Supabase call
          const { supabase } = await import('@/integrations/supabase/client');
          const { data, error } = await supabase
            .from('clients')
            .insert(clientData as any)
            .select()
            .single();
          
          if (error) throw error;
          return data;
        },
        {
          endpoint: '/rest/v1/clients',
          method: 'POST',
          validation: {
            schema: ClientValidationSchema,
            data: clientData
          },
          requireAuth: true,
          showToastOnSuccess: true,
          successMessage: 'Client created successfully'
        }
      );
    },
    [executeWithMiddleware]
  );

  const createClinicalNote = useCallback(
    async (noteData: unknown) => {
      return executeWithMiddleware(
        async () => {
          const { supabase } = await import('@/integrations/supabase/client');
          const { data, error } = await supabase
            .from('clinical_notes')
            .insert(noteData as any)
            .select()
            .single();
          
          if (error) throw error;
          return data;
        },
        {
          endpoint: '/rest/v1/clinical_notes',
          method: 'POST',
          validation: {
            schema: ClinicalNoteValidationSchema,
            data: noteData
          },
          requireAuth: true,
          showToastOnSuccess: true,
          successMessage: 'Clinical note created successfully'
        }
      );
    },
    [executeWithMiddleware]
  );

  const createAppointment = useCallback(
    async (appointmentData: unknown) => {
      return executeWithMiddleware(
        async () => {
          const { supabase } = await import('@/integrations/supabase/client');
          const { data, error } = await supabase
            .from('appointments')
            .insert(appointmentData as any)
            .select()
            .single();
          
          if (error) throw error;
          return data;
        },
        {
          endpoint: '/rest/v1/appointments',
          method: 'POST',
          validation: {
            schema: AppointmentValidationSchema,
            data: appointmentData
          },
          requireAuth: true,
          showToastOnSuccess: true,
          successMessage: 'Appointment created successfully'
        }
      );
    },
    [executeWithMiddleware]
  );

  const fetchWithRateLimit = useCallback(
    async <T>(operation: () => Promise<T>, endpoint: string) => {
      return executeWithMiddleware(
        operation,
        {
          endpoint,
          method: 'GET',
          requireAuth: true,
          showToastOnError: false // Don't show toast for read operations
        }
      );
    },
    [executeWithMiddleware]
  );

  return {
    isLoading,
    error,
    executeWithMiddleware,
    createClient,
    createClinicalNote,
    createAppointment,
    fetchWithRateLimit,
    clearError: () => setError(null)
  };
};

// Rate limit status hook
export const useRateLimitStatus = () => {
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    limit: number;
    remaining: number;
    reset: string;
  } | null>(null);

  const checkRateLimit = useCallback(async (endpoint: string) => {
    const middleware = APIMiddleware.getInstance();
    const result = await middleware.checkRateLimit(endpoint);
    
    if (result.headers) {
      setRateLimitInfo({
        limit: parseInt(result.headers['X-RateLimit-Limit'] || '100'),
        remaining: parseInt(result.headers['X-RateLimit-Remaining'] || '99'),
        reset: result.headers['X-RateLimit-Reset'] || new Date(Date.now() + 15 * 60 * 1000).toISOString()
      });
    }
    
    return result;
  }, []);

  return {
    rateLimitInfo,
    checkRateLimit
  };
};