
interface ErrorContext {
  userId?: string;
  route?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, any>;
}

interface ErrorLog {
  id: string;
  timestamp: number;
  error: Error;
  context: ErrorContext;
  userAgent: string;
  url: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

class ErrorLoggingService {
  private logs: ErrorLog[] = [];
  private maxLogs = 100;

  logError(error: Error, context: ErrorContext = {}, severity: ErrorLog['severity'] = 'medium') {
    const errorLog: ErrorLog = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } as Error,
      context: {
        route: window.location.pathname,
        ...context,
      },
      userAgent: navigator.userAgent,
      url: window.location.href,
      severity,
    };

    this.logs.unshift(errorLog);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Log to console for development
    console.error('Error logged:', errorLog);

    // In production, you would send this to your logging service
    // this.sendToLoggingService(errorLog);
  }

  logAPIError(error: any, endpoint: string, method: string, context: ErrorContext = {}) {
    this.logError(
      new Error(`API Error: ${method} ${endpoint} - ${error.message || 'Unknown error'}`),
      {
        ...context,
        component: 'API',
        action: `${method} ${endpoint}`,
        metadata: {
          status: error.status,
          response: error.response,
        },
      },
      'high'
    );
  }

  getRecentLogs(): ErrorLog[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }

  // Future: Send to external logging service
  private async sendToLoggingService(errorLog: ErrorLog) {
    // Implementation for external service like Sentry, LogRocket, etc.
  }
}

export const errorLogger = new ErrorLoggingService();
