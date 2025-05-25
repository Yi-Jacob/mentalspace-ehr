
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { errorLogger } from '@/services/errorLogging';

interface UseErrorHandlerOptions {
  maxRetries?: number;
  retryDelay?: number;
  component?: string;
}

export const useErrorHandler = (options: UseErrorHandlerOptions = {}) => {
  const { maxRetries = 3, retryDelay = 1000, component } = options;
  const { toast } = useToast();
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleError = useCallback((error: any, context?: string, showToast = true) => {
    const errorMessage = error?.message || 'An unexpected error occurred';
    
    // Log the error
    errorLogger.logError(
      error instanceof Error ? error : new Error(errorMessage),
      {
        component,
        action: context,
        metadata: {
          retryCount,
          isRetrying,
        },
      },
      'medium'
    );

    // Show toast notification
    if (showToast) {
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, [component, retryCount, isRetrying, toast]);

  const handleAPIError = useCallback((error: any, endpoint: string, method: string) => {
    errorLogger.logAPIError(error, endpoint, method, {
      component,
      metadata: { retryCount },
    });

    toast({
      title: 'Network Error',
      description: `Failed to ${method.toLowerCase()} data. Please check your connection and try again.`,
      variant: 'destructive',
    });
  }, [component, retryCount, toast]);

  const retry = useCallback(async (fn: () => Promise<any>): Promise<any> => {
    if (retryCount >= maxRetries) {
      throw new Error(`Maximum retry attempts (${maxRetries}) exceeded`);
    }

    setIsRetrying(true);
    setRetryCount(prev => prev + 1);

    try {
      await new Promise(resolve => setTimeout(resolve, retryDelay * retryCount));
      const result = await fn();
      setRetryCount(0);
      setIsRetrying(false);
      return result;
    } catch (error) {
      setIsRetrying(false);
      if (retryCount < maxRetries - 1) {
        return retry(fn);
      }
      throw error;
    }
  }, [retryCount, maxRetries, retryDelay]);

  const reset = useCallback(() => {
    setRetryCount(0);
    setIsRetrying(false);
  }, []);

  return {
    handleError,
    handleAPIError,
    retry,
    reset,
    retryCount,
    isRetrying,
    canRetry: retryCount < maxRetries,
  };
};
