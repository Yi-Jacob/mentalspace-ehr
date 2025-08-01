import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

class ErrorHandler {
  handleError(error: AxiosError): Promise<never> {
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      status: error.response?.status || 500,
    };

    if (error.response) {
      // Server responded with error status
      const data = error.response.data as { message?: string } | undefined;
      apiError.message = data?.message || error.message || 'An unexpected error occurred';
      apiError.details = error.response.data;
    } else if (error.request) {
      // Network error or timeout
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        apiError.message = 'Request timed out. The server is taking longer than expected to respond. Please try again.';
        apiError.status = 408; // Request Timeout
        apiError.code = 'TIMEOUT';
      } else {
        apiError.message = 'Network error - please check your connection';
        apiError.status = 0;
      }
    } else {
      // Other error
      apiError.message = error.message;
    }

    // Log error for debugging
    console.error('API Error:', apiError);

    return Promise.reject(apiError);
  }

  isNetworkError(error: any): boolean {
    return error.status === 0 || !error.response;
  }

  isAuthError(error: any): boolean {
    return error.status === 401 || error.status === 403;
  }

  isServerError(error: any): boolean {
    return error.status >= 500;
  }
}

export const errorHandler = new ErrorHandler(); 