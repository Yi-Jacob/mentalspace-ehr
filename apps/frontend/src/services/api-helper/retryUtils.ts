
import { APIError, APIErrorType } from './apiErrorTypes';

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  jitterRange: number;
  timeoutMs: number;
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 30000,
  backoffMultiplier: 2,
  jitterRange: 0.1,
  timeoutMs: 30000
};

export class RetryUtility {
  static async executeWithRetry<T>(
    operation: () => Promise<T>,
    config: Partial<RetryConfig> = {},
    operationName?: string
  ): Promise<T> {
    const finalConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
    let lastError: APIError | Error;
    
    for (let attempt = 0; attempt <= finalConfig.maxRetries; attempt++) {
      try {
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Operation timeout')), finalConfig.timeoutMs);
        });

        const result = await Promise.race([operation(), timeoutPromise]);
        
        if (attempt > 0) {
          console.log(`${operationName || 'Operation'} succeeded after ${attempt} retries`);
        }
        
        return result;
      } catch (error) {
        lastError = error instanceof APIError ? error : new Error(error.message || 'Unknown error');
        
        // Don't retry on the last attempt
        if (attempt === finalConfig.maxRetries) {
          break;
        }

        // Check if error is retryable
        if (error instanceof APIError && !error.retryable) {
          throw error;
        }

        // Calculate delay for next retry
        const delay = this.calculateDelay(attempt, finalConfig);
        
        console.warn(
          `${operationName || 'Operation'} failed (attempt ${attempt + 1}/${finalConfig.maxRetries + 1}). Retrying in ${delay}ms...`,
          { error: lastError.message }
        );

        await this.sleep(delay);
      }
    }

    throw lastError;
  }

  private static calculateDelay(attempt: number, config: RetryConfig): number {
    // Exponential backoff with jitter
    const baseDelay = Math.min(
      config.baseDelay * Math.pow(config.backoffMultiplier, attempt),
      config.maxDelay
    );

    // Add jitter to prevent thundering herd
    const jitter = baseDelay * config.jitterRange * (Math.random() - 0.5);
    
    return Math.max(0, baseDelay + jitter);
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static shouldRetryError(error: any): boolean {
    if (error instanceof APIError) {
      return error.retryable;
    }

    // Network and timeout errors are generally retryable
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return true;
    }

    if (error.name === 'AbortError' || error.message?.includes('timeout')) {
      return true;
    }

    // Server errors (5xx) are retryable
    const statusCode = error.status || error.statusCode;
    if (statusCode >= 500 && statusCode < 600) {
      return true;
    }

    return false;
  }
}
