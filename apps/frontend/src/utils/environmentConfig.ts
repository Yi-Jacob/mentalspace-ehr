// Environment configuration for the application
export const ENV_CONFIG = {
  app: {
    name: 'MentalSpace EHR',
    version: '1.0.0',
    environment: import.meta.env.MODE || 'development',
    debug: import.meta.env.DEV || false,
  },
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:7000',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  },
  performance: {
    cacheTimeout: parseInt(import.meta.env.VITE_CACHE_TIMEOUT || '300000'), // 5 minutes
    maxRetries: parseInt(import.meta.env.VITE_MAX_RETRIES || '3'),
    retryDelay: parseInt(import.meta.env.VITE_RETRY_DELAY || '1000'),
  },
  security: {
    sessionTimeout: parseInt(import.meta.env.VITE_SESSION_TIMEOUT || '1800000'), // 30 minutes
    maxLoginAttempts: parseInt(import.meta.env.VITE_MAX_LOGIN_ATTEMPTS || '5'),
    passwordMinLength: parseInt(import.meta.env.VITE_PASSWORD_MIN_LENGTH || '8'),
  },
  analytics: {
    enabled: import.meta.env.VITE_ANALYTICS_ENABLED === 'true',
    trackingId: import.meta.env.VITE_ANALYTICS_TRACKING_ID || '',
  },
  features: {
    realTimeUpdates: import.meta.env.VITE_REAL_TIME_UPDATES !== 'false',
    offlineSupport: import.meta.env.VITE_OFFLINE_SUPPORT === 'true',
    pushNotifications: import.meta.env.VITE_PUSH_NOTIFICATIONS === 'true',
  },
} as const;

// Type for environment configuration
export type EnvironmentConfig = typeof ENV_CONFIG;

// Helper function to get environment variable with fallback
export const getEnvVar = (key: string, fallback: string = ''): string => {
  return import.meta.env[key] || fallback;
};

// Helper function to check if we're in development
export const isDevelopment = (): boolean => {
  return ENV_CONFIG.app.environment === 'development';
};

// Helper function to check if we're in production
export const isProduction = (): boolean => {
  return ENV_CONFIG.app.environment === 'production';
};

// Helper function to check if debug mode is enabled
export const isDebugEnabled = (): boolean => {
  return ENV_CONFIG.app.debug;
}; 

// Environment-specific logging
export const logger = {
  debug: (message: string, data?: any) => {
    if (ENV_CONFIG.app.environment !== 'production') {
      console.debug(`[${ENV_CONFIG.app.environment.toUpperCase()}] ${message}`, data);
    }
  },
  info: (message: string, data?: any) => {
    console.info(`[${ENV_CONFIG.app.environment.toUpperCase()}] ${message}`, data);
  },
  warn: (message: string, data?: any) => {
    console.warn(`[${ENV_CONFIG.app.environment.toUpperCase()}] ${message}`, data);
  },
  error: (message: string, error?: any) => {
    console.error(`[${ENV_CONFIG.app.environment.toUpperCase()}] ${message}`, error);
    
    // In production, send to monitoring service
    if (ENV_CONFIG.app.environment === 'production') {
      // This would integrate with your monitoring service
      // sendToMonitoring({ level: 'error', message, error, timestamp: new Date().toISOString() });
    }
  }
};