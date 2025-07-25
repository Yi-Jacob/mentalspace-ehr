
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

    // HTTP status code errors (primary classification for NestJS backend)
    if (error.status || error.statusCode || error.response?.status) {
      const statusCode = error.status || error.statusCode || error.response?.status;
      return this.classifyHTTPError(statusCode, error, endpoint, method);
    }

    // NestJS validation errors
    if (error.response?.data?.message && Array.isArray(error.response.data.message)) {
      return new APIError({
        type: APIErrorType.VALIDATION_ERROR,
        message: 'Validation failed. Please check your input.',
        statusCode: 400,
        endpoint,
        method,
        retryable: false,
        originalError: error,
        validationErrors: error.response.data.message
      });
    }

    // NestJS specific error messages
    if (error.response?.data?.message) {
      return this.classifyNestJSError(error.response.data, endpoint, method);
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

  private static classifyNestJSError(errorData: any, endpoint?: string, method?: string): APIError {
    const message = errorData.message || 'Server error';
    const statusCode = errorData.statusCode || 500;

    // Check for specific NestJS error types
    if (message.includes('Unauthorized') || message.includes('authentication')) {
      return new APIError({
        type: APIErrorType.AUTHENTICATION_ERROR,
        message: 'Authentication required. Please log in again.',
        statusCode: 401,
        endpoint,
        method,
        retryable: false,
        originalError: errorData
      });
    }

    if (message.includes('Forbidden') || message.includes('permission') || message.includes('access')) {
      return new APIError({
        type: APIErrorType.AUTHORIZATION_ERROR,
        message: 'You do not have permission to perform this action.',
        statusCode: 403,
        endpoint,
        method,
        retryable: false,
        originalError: errorData
      });
    }

    if (message.includes('Not Found') || message.includes('not found')) {
      return new APIError({
        type: APIErrorType.NOT_FOUND_ERROR,
        message: 'The requested resource was not found.',
        statusCode: 404,
        endpoint,
        method,
        retryable: false,
        originalError: errorData
      });
    }

    if (message.includes('Validation') || message.includes('validation')) {
      return new APIError({
        type: APIErrorType.VALIDATION_ERROR,
        message: 'Invalid data provided. Please check your input.',
        statusCode: 400,
        endpoint,
        method,
        retryable: false,
        originalError: errorData
      });
    }

    if (message.includes('Conflict') || message.includes('already exists')) {
      return new APIError({
        type: APIErrorType.CONFLICT_ERROR,
        message: 'Resource conflict. The requested operation cannot be completed.',
        statusCode: 409,
        endpoint,
        method,
        retryable: false,
        originalError: errorData
      });
    }

    // Default to server error for unknown NestJS errors
    return new APIError({
      type: APIErrorType.SERVER_ERROR,
      message: message,
      statusCode,
      endpoint,
      method,
      retryable: statusCode >= 500,
      originalError: errorData
    });
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

      case 409:
        return new APIError({
          type: APIErrorType.CONFLICT_ERROR,
          message: 'Resource conflict. The requested operation cannot be completed.',
          statusCode,
          endpoint,
          method,
          retryable: false,
          originalError: error
        });

      case 422:
        return new APIError({
          type: APIErrorType.VALIDATION_ERROR,
          message: 'Unprocessable entity. Please check your input.',
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
