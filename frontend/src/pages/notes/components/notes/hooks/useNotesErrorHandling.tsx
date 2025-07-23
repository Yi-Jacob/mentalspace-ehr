
import React from 'react';
import { useEnhancedErrorHandler } from '@/hooks/useEnhancedErrorHandler';

export const useNotesErrorHandling = () => {
  const { 
    handleError, 
    handleAPIError, 
    executeWithRetry, 
    retryCount, 
    canRetry,
    isRetrying 
  } = useEnhancedErrorHandler({
    component: 'NotesList',
    retryConfig: { 
      maxRetries: 3,
      baseDelay: 1000,
      timeoutMs: 15000 
    }
  });

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'object' && error !== null && 'message' in error) {
      return String((error as any).message);
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'An unknown error occurred while loading clinical notes';
  };

  const handleRetry = async (refetch: () => Promise<any>) => {
    console.log('=== MANUAL RETRY INITIATED ===');
    console.log('Retry attempt:', retryCount + 1);
    
    try {
      await executeWithRetry(
        () => {
          console.log('Executing refetch...');
          return refetch();
        },
        'Load Clinical Notes'
      );
      console.log('✅ Manual retry successful');
    } catch (retryError) {
      console.error('❌ Manual retry failed:', retryError);
      const errorObj = retryError instanceof Error 
        ? retryError 
        : new Error(getErrorMessage(retryError));
      
      handleAPIError(errorObj, '/clinical-notes', 'GET');
    }
  };

  return {
    handleError,
    handleAPIError,
    executeWithRetry,
    retryCount,
    canRetry,
    isRetrying,
    getErrorMessage,
    handleRetry
  };
};
