import { ENV_CONFIG, logger } from './environmentConfig';
import { apiClient } from '@/services/api-helper/client';

interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  data?: any;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  source: string;
  environment: string;
}

class ProductionLogger {
  private queue: LogEntry[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private readonly maxQueueSize = 100;
  private readonly flushInterval = 5000; // 5 seconds

  constructor() {
    // Only enable in production
    if (ENV_CONFIG.app.environment === 'production') {
      this.startPeriodicFlush();
    }
  }

  private async flush() {
    if (this.queue.length === 0) return;

    const logsToSend = this.queue.splice(0, this.maxQueueSize);
    
    try {
      // Send logs to backend API for processing
      await apiClient.post('/logs/batch', {
        logs: logsToSend,
        batch: true
      });
    } catch (error) {
      // Fallback to console if logging service fails
      console.error('Failed to send logs to service:', error);
      logsToSend.forEach(log => {
        console[log.level](log.message, log.data);
      });
    }
  }

  private startPeriodicFlush() {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  private addToQueue(entry: LogEntry) {
    this.queue.push(entry);
    
    // Force flush if queue is full or on error
    if (this.queue.length >= this.maxQueueSize || entry.level === 'error') {
      this.flush();
    }
  }

  private createLogEntry(level: LogEntry['level'], message: string, data?: any): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      source: 'frontend',
      environment: ENV_CONFIG.app.environment,
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId()
    };
  }

  private getCurrentUserId(): string | undefined {
    // This would get the current user ID from your auth system
    try {
      const session = JSON.parse(localStorage.getItem('mentalspace-auth') || '{}');
      return session?.user?.id;
    } catch {
      return undefined;
    }
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('session-id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('session-id', sessionId);
    }
    return sessionId;
  }

  debug(message: string, data?: any) {
    logger.debug(message, data);
    if (ENV_CONFIG.app.environment !== 'production') {
      this.addToQueue(this.createLogEntry('debug', message, data));
    }
  }

  info(message: string, data?: any) {
    logger.info(message, data);
    this.addToQueue(this.createLogEntry('info', message, data));
  }

  warn(message: string, data?: any) {
    logger.warn(message, data);
    this.addToQueue(this.createLogEntry('warn', message, data));
  }

  error(message: string, error?: any) {
    logger.error(message, error);
    
    // Enhanced error logging for production
    const errorData = {
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };

    this.addToQueue(this.createLogEntry('error', message, errorData));
  }

  // Performance logging
  performance(operation: string, duration: number, metadata?: any) {
    const perfData = {
      operation,
      duration,
      metadata,
      performance: {
        navigation: performance.getEntriesByType('navigation')[0],
        memory: (performance as any).memory
      }
    };

    this.info(`Performance: ${operation} took ${duration}ms`, perfData);
  }

  // User action tracking
  userAction(action: string, details?: any) {
    const actionData = {
      action,
      details,
      page: window.location.pathname,
      referrer: document.referrer
    };

    this.info(`User Action: ${action}`, actionData);
  }

  // API call logging
  apiCall(method: string, url: string, duration: number, status: number, error?: any) {
    const apiData = {
      method,
      url,
      duration,
      status,
      error,
      requestId: this.generateRequestId()
    };

    if (status >= 400) {
      this.error(`API Error: ${method} ${url}`, apiData);
    } else {
      this.info(`API Call: ${method} ${url}`, apiData);
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  }

  // Cleanup
  destroy() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush(); // Final flush
  }
}

export const productionLogger = new ProductionLogger();

// Global error handling
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    productionLogger.error('Global Error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    productionLogger.error('Unhandled Promise Rejection', {
      reason: event.reason,
      promise: event.promise
    });
  });
}

// Performance observer for Core Web Vitals
if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const duration = 'duration' in entry ? entry.duration : 
                        'value' in entry ? (entry as any).value : 0;
        productionLogger.performance(entry.name, duration, {
          entryType: entry.entryType,
          detail: entry
        });
      }
    });

    observer.observe({ entryTypes: ['measure', 'navigation', 'paint'] });
  } catch (error) {
    console.warn('Performance observer not supported:', error);
  }
}