
export enum APIErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface APIErrorDetails {
  type: APIErrorType;
  message: string;
  statusCode?: number;
  endpoint?: string;
  method?: string;
  retryable: boolean;
  retryAfter?: number;
  originalError?: any;
}

export class APIError extends Error {
  public readonly type: APIErrorType;
  public readonly statusCode?: number;
  public readonly endpoint?: string;
  public readonly method?: string;
  public readonly retryable: boolean;
  public readonly retryAfter?: number;
  public readonly originalError?: any;

  constructor(details: APIErrorDetails) {
    super(details.message);
    this.name = 'APIError';
    this.type = details.type;
    this.statusCode = details.statusCode;
    this.endpoint = details.endpoint;
    this.method = details.method;
    this.retryable = details.retryable;
    this.retryAfter = details.retryAfter;
    this.originalError = details.originalError;
  }
}
