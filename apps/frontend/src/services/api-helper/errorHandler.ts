import { AxiosError } from 'axios';
import { authService } from '../authService';

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

      // Handle 401 Unauthorized errors - automatic logout
      if (error.response.status === 401) {
        console.warn('Authentication token expired or invalid. Logging out...');
        this.handleAuthenticationError();
      }
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

  private handleAuthenticationError() {
    // Clear authentication data
    authService.removeToken();
    authService.removeUser();
    
    // Dispatch a custom event to notify the auth context
    window.dispatchEvent(new CustomEvent('auth:force-logout'));
    
    // Redirect to login page
    window.location.href = '/auth/login';
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