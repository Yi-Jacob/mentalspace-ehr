
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4
}

interface LogEntry {
  id: string;
  level: LogLevel;
  message: string;
  timestamp: number;
  context?: Record<string, any>;
  userId?: string;
  sessionId: string;
  userAgent: string;
  url: string;
  stack?: string;
}

interface LoggingConfig {
  minLevel: LogLevel;
  maxLogs: number;
  enableConsole: boolean;
  enableRemote: boolean;
  batchSize: number;
  flushInterval: number;
}

class ProductionLoggingService {
  private logs: LogEntry[] = [];
  private sessionId: string;
  private logBuffer: LogEntry[] = [];
  private flushTimer?: NodeJS.Timeout;
  
  private config: LoggingConfig = {
    minLevel: LogLevel.INFO,
    maxLogs: 5000,
    enableConsole: true,
    enableRemote: false, // Enable when you have a logging endpoint
    batchSize: 50,
    flushInterval: 30000, // 30 seconds
  };

  constructor() {
    this.sessionId = crypto.randomUUID();
    this.startFlushTimer();
    
    // Capture unhandled errors
    window.addEventListener('error', (event) => {
      this.error('Unhandled error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
      });
    });

    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.error('Unhandled promise rejection', {
        reason: event.reason,
        stack: event.reason?.stack,
      });
    });
  }

  debug(message: string, context?: Record<string, any>) {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, any>) {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, any>) {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, context?: Record<string, any>) {
    this.log(LogLevel.ERROR, message, context);
  }

  critical(message: string, context?: Record<string, any>) {
    this.log(LogLevel.CRITICAL, message, context);
    // Immediately flush critical errors
    this.flushLogs();
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>) {
    if (level < this.config.minLevel) return;

    const logEntry: LogEntry = {
      id: crypto.randomUUID(),
      level,
      message,
      timestamp: Date.now(),
      context,
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      url: window.location.href,
      stack: level >= LogLevel.ERROR ? new Error().stack : undefined,
    };

    // Add to local storage
    this.logs.unshift(logEntry);
    if (this.logs.length > this.config.maxLogs) {
      this.logs = this.logs.slice(0, this.config.maxLogs);
    }

    // Add to buffer for remote logging
    this.logBuffer.push(logEntry);

    // Console logging
    if (this.config.enableConsole) {
      this.logToConsole(logEntry);
    }

    // Flush immediately for critical errors
    if (level === LogLevel.CRITICAL) {
      this.flushLogs();
    }
  }

  private logToConsole(entry: LogEntry) {
    const levelNames = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'CRITICAL'];
    const timestamp = new Date(entry.timestamp).toISOString();
    const logMessage = `[${timestamp}] [${levelNames[entry.level]}] ${entry.message}`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(logMessage, entry.context);
        break;
      case LogLevel.INFO:
        console.info(logMessage, entry.context);
        break;
      case LogLevel.WARN:
        console.warn(logMessage, entry.context);
        break;
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        console.error(logMessage, entry.context);
        break;
    }
  }

  private startFlushTimer() {
    this.flushTimer = setInterval(() => {
      this.flushLogs();
    }, this.config.flushInterval);
  }

  private async flushLogs() {
    if (!this.config.enableRemote || this.logBuffer.length === 0) return;

    const logsToSend = this.logBuffer.splice(0, this.config.batchSize);
    
    try {
      // In a real implementation, you would send logs to your logging service
      // Example: await this.sendToLoggingService(logsToSend);
      console.log('Would send logs to remote service:', logsToSend);
    } catch (error) {
      console.error('Failed to send logs to remote service:', error);
      // Put logs back in buffer to retry later
      this.logBuffer.unshift(...logsToSend);
    }
  }

  setUserId(userId: string) {
    this.logs.forEach(log => {
      if (!log.userId) log.userId = userId;
    });
  }

  getRecentLogs(hours: number = 1): LogEntry[] {
    const cutoff = Date.now() - (hours * 60 * 60 * 1000);
    return this.logs.filter(log => log.timestamp > cutoff);
  }

  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  clearLogs() {
    this.logs = [];
    this.logBuffer = [];
  }

  destroy() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flushLogs();
  }
}

export const productionLogger = new ProductionLoggingService();
