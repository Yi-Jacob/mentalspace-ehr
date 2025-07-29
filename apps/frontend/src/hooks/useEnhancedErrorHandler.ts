
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { APIError, APIErrorType } from '@/services/api-helper/apiErrorTypes';
import { APIErrorClassifier } from '@/services/api-helper/apiErrorClassifier';
import { RetryUtility, RetryConfig, DEFAULT_RETRY_CONFIG } from '@/services/api-helper/retryUtils';
import { errorLogger } from '@/utils/errorLogging';

interface UseEnhancedErrorHandlerOptions {
  component?: string;
  retryConfig?: Partial<RetryConfig>;
  showToastOnError?: boolean;
}

export const useEnhancedErrorHandler = (options: UseEnhancedErrorHandlerOptions = {}) => {
  const { component, retryConfig = {}, showToastOnError = true } = options;
  const { toast } = useToast();
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const finalRetryConfig = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };

  const getErrorSeverity = useCallback((errorType: APIErrorType): 'low' | 'medium' | 'high' | 'critical' => {
    switch (errorType) {
      case APIErrorType.AUTHENTICATION_ERROR:
      case APIErrorType.AUTHORIZATION_ERROR:
        return 'critical';
      case APIErrorType.SERVER_ERROR:
      case APIErrorType.DATABASE_ERROR:
        return 'high';
      case APIErrorType.VALIDATION_ERROR:
      case APIErrorType.NOT_FOUND_ERROR:
        return 'medium';
      default:
        return 'low';
    }
  }, []);

  const getErrorTitle = useCallback((errorType: APIErrorType): string => {
    switch (errorType) {
      case APIErrorType.NETWORK_ERROR:
        return 'Connection Error';
      case APIErrorType.TIMEOUT_ERROR:
        return 'Request Timeout';
      case APIErrorType.AUTHENTICATION_ERROR:
        return 'Authentication Error';
      case APIErrorType.AUTHORIZATION_ERROR:
        return 'Permission Denied';
      case APIErrorType.VALIDATION_ERROR:
        return 'Invalid Data';
      case APIErrorType.NOT_FOUND_ERROR:
        return 'Not Found';
      case APIErrorType.RATE_LIMIT_ERROR:
        return 'Rate Limit Exceeded';
      case APIErrorType.SERVER_ERROR:
        return 'Server Error';
      case APIErrorType.DATABASE_ERROR:
        return 'Database Error';
      default:
        return 'Error';
    }
  }, []);

  const getToastConfig = useCallback((apiError: APIError) => {
    const baseConfig = {
      variant: 'destructive' as const,
      title: getErrorTitle(apiError.type),
      description: apiError.message,
    };

    // Add retry suggestion for retryable errors
    if (apiError.retryable && retryCount < finalRetryConfig.maxRetries) {
      baseConfig.description += ' The system will automatically retry this operation.';
    }

    return baseConfig;
  }, [getErrorTitle, retryCount, finalRetryConfig.maxRetries]);

  const showErrorToast = useCallback((apiError: APIError) => {
    const toastConfig = getToastConfig(apiError);
    toast(toastConfig);
  }, [toast, getToastConfig]);

  const handleError = useCallback((error: any, context?: string, showToast = showToastOnError) => {
    const apiError = APIErrorClassifier.classifyError(error, context);
    
    // Log the error
    errorLogger.logError(apiError, {
      component,
      action: context,
      metadata: {
        errorType: apiError.type,
        statusCode: apiError.statusCode,
        retryable: apiError.retryable,
      },
    }, getErrorSeverity(apiError.type));

    // Show appropriate toast notification
    if (showToast) {
      showErrorToast(apiError);
    }

    return apiError;
  }, [component, showToastOnError, getErrorSeverity, showErrorToast]);

  const handleAPIError = useCallback((error: any, endpoint: string, method: string) => {
    const apiError = APIErrorClassifier.classifyError(error, endpoint, method);
    
    errorLogger.logAPIError(error, endpoint, method, {
      component,
      metadata: { 
        errorType: apiError.type,
        retryCount 
      },
    });

    showErrorToast(apiError);
    return apiError;
  }, [component, retryCount, showErrorToast]);

  const executeWithRetry = useCallback(async <T>(
    operation: () => Promise<T>,
    operationName?: string,
    customRetryConfig?: Partial<RetryConfig>
  ): Promise<T> => {
    const config = { ...finalRetryConfig, ...customRetryConfig };
    setIsRetrying(true);
    setRetryCount(0);

    try {
      const result = await RetryUtility.executeWithRetry(
        async () => {
          setRetryCount(prev => prev + 1);
          return await operation();
        },
        config,
        operationName
      );

      setRetryCount(0);
      return result;
    } catch (error) {
      const apiError = handleError(error, operationName, true);
      throw apiError;
    } finally {
      setIsRetrying(false);
    }
  }, [finalRetryConfig, handleError]);

  return {
    handleError,
    handleAPIError,
    executeWithRetry,
    isRetrying,
    retryCount,
    canRetry: retryCount < finalRetryConfig.maxRetries,
    maxRetries: finalRetryConfig.maxRetries,
  };
};
