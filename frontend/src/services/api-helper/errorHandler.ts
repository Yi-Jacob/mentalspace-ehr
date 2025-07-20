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
      apiError.message = error.response.data?.message || error.message;
      apiError.details = error.response.data;
    } else if (error.request) {
      // Network error
      apiError.message = 'Network error - please check your connection';
      apiError.status = 0;
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