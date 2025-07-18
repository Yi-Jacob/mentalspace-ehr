
import { APIError, APIErrorType } from './apiErrorTypes';

export class APIErrorClassifier {
  static classifyError(error: any, endpoint?: string, method?: string): APIError {
    // Network/Connection errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return new APIError({
        type: APIErrorType.NETWORK_ERROR,
        message: 'Unable to connect to the server. Please check your internet connection.',
        endpoint,
        method,
        retryable: true,
        originalError: error
      });
    }

    // Timeout errors
    if (error.name === 'AbortError' || error.message?.includes('timeout')) {
      return new APIError({
        type: APIErrorType.TIMEOUT_ERROR,
        message: 'Request timed out. Please try again.',
        endpoint,
        method,
        retryable: true,
        originalError: error
      });
    }

    // Supabase specific errors
    if (error.code) {
      return this.classifySupabaseError(error, endpoint, method);
    }

    // HTTP status code errors
    if (error.status || error.statusCode) {
      const statusCode = error.status || error.statusCode;
      return this.classifyHTTPError(statusCode, error, endpoint, method);
    }

    // Unknown error
    return new APIError({
      type: APIErrorType.UNKNOWN_ERROR,
      message: error.message || 'An unexpected error occurred',
      endpoint,
      method,
      retryable: false,
      originalError: error
    });
  }

  private static classifySupabaseError(error: any, endpoint?: string, method?: string): APIError {
    const code = error.code;
    const message = error.message || 'Database operation failed';

    switch (code) {
      case 'PGRST116': // Not found
        return new APIError({
          type: APIErrorType.NOT_FOUND_ERROR,
          message: 'The requested resource was not found',
          statusCode: 404,
          endpoint,
          method,
          retryable: false,
          originalError: error
        });

      case 'PGRST301': // Authentication required
      case '23505': // Auth error
        return new APIError({
          type: APIErrorType.AUTHENTICATION_ERROR,
          message: 'Authentication required. Please log in again.',
          statusCode: 401,
          endpoint,
          method,
          retryable: false,
          originalError: error
        });

      case 'PGRST302': // Insufficient privileges
        return new APIError({
          type: APIErrorType.AUTHORIZATION_ERROR,
          message: 'You do not have permission to perform this action',
          statusCode: 403,
          endpoint,
          method,
          retryable: false,
          originalError: error
        });

      case '23502': // Not null violation
      case '23503': // Foreign key violation
      case '23514': // Check violation
        return new APIError({
          type: APIErrorType.VALIDATION_ERROR,
          message: 'Invalid data provided. Please check your input.',
          statusCode: 400,
          endpoint,
          method,
          retryable: false,
          originalError: error
        });

      default:
        return new APIError({
          type: APIErrorType.DATABASE_ERROR,
          message: `Database error: ${message}`,
          endpoint,
          method,
          retryable: true,
          originalError: error
        });
    }
  }

  private static classifyHTTPError(statusCode: number, error: any, endpoint?: string, method?: string): APIError {
    switch (statusCode) {
      case 400:
        return new APIError({
          type: APIErrorType.VALIDATION_ERROR,
          message: 'Invalid request. Please check your input.',
          statusCode,
          endpoint,
          method,
          retryable: false,
          originalError: error
        });

      case 401:
        return new APIError({
          type: APIErrorType.AUTHENTICATION_ERROR,
          message: 'Authentication required. Please log in again.',
          statusCode,
          endpoint,
          method,
          retryable: false,
          originalError: error
        });

      case 403:
        return new APIError({
          type: APIErrorType.AUTHORIZATION_ERROR,
          message: 'You do not have permission to perform this action.',
          statusCode,
          endpoint,
          method,
          retryable: false,
          originalError: error
        });

      case 404:
        return new APIError({
          type: APIErrorType.NOT_FOUND_ERROR,
          message: 'The requested resource was not found.',
          statusCode,
          endpoint,
          method,
          retryable: false,
          originalError: error
        });

      case 429:
        const retryAfter = error.headers?.['retry-after'] ? parseInt(error.headers['retry-after']) * 1000 : 5000;
        return new APIError({
          type: APIErrorType.RATE_LIMIT_ERROR,
          message: 'Too many requests. Please try again later.',
          statusCode,
          endpoint,
          method,
          retryable: true,
          retryAfter,
          originalError: error
        });

      case 500:
      case 502:
      case 503:
      case 504:
        return new APIError({
          type: APIErrorType.SERVER_ERROR,
          message: 'Server error. Please try again later.',
          statusCode,
          endpoint,
          method,
          retryable: true,
          originalError: error
        });

      default:
        return new APIError({
          type: APIErrorType.UNKNOWN_ERROR,
          message: error.message || `HTTP ${statusCode} error`,
          statusCode,
          endpoint,
          method,
          retryable: statusCode >= 500,
          originalError: error
        });
    }
  }
}
