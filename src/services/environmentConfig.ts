export interface EnvironmentConfig {
  supabase: {
    url: string;
    anonKey: string;
    serviceRoleKey?: string;
    projectId: string;
  };
  app: {
    name: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
    baseUrl: string;
  };
  features: {
    enableAnalytics: boolean;
    enableRealtime: boolean;
    enableEdgeFunctions: boolean;
    maxFileUploadSize: number;
  };
  performance: {
    connectionPoolSize: number;
    requestTimeout: number;
    maxRetries: number;
    cacheTimeout: number;
  };
  security: {
    enableRLS: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
  };
}

const getEnvironmentConfig = (): EnvironmentConfig => {
  const isDevelopment = import.meta.env.DEV;
  const isProduction = window.location.hostname !== 'localhost' && 
                      !window.location.hostname.includes('lovable.dev');

  return {
    supabase: {
      url: 'https://wjaccopklttdvnutdmtu.supabase.co',
      anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqYWNjb3BrbHR0ZHZudXRkbXR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwOTg2NzcsImV4cCI6MjA2MzY3NDY3N30.kf1o-FbWRqfVEHDypcpSOGpOcRUPHFtaJgfZOCqDaek',
      projectId: 'wjaccopklttdvnutdmtu'
    },
    app: {
      name: 'MentalSpace',
      version: '1.0.0',
      environment: isProduction ? 'production' : isDevelopment ? 'development' : 'staging',
      baseUrl: isProduction ? 'https://mentalspace.com' : 'http://localhost:8080'
    },
    features: {
      enableAnalytics: isProduction,
      enableRealtime: true,
      enableEdgeFunctions: true,
      maxFileUploadSize: isProduction ? 50 * 1024 * 1024 : 10 * 1024 * 1024 // 50MB prod, 10MB dev
    },
    performance: {
      connectionPoolSize: isProduction ? 20 : 5,
      requestTimeout: isProduction ? 30000 : 10000,
      maxRetries: 3,
      cacheTimeout: isProduction ? 300000 : 60000 // 5min prod, 1min dev
    },
    security: {
      enableRLS: true,
      sessionTimeout: isProduction ? 3600000 : 7200000, // 1hr prod, 2hr dev
      maxLoginAttempts: 5
    }
  };
};

export const ENV_CONFIG = getEnvironmentConfig();

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

// Feature flags based on environment
export const isFeatureEnabled = (feature: keyof EnvironmentConfig['features']): boolean => {
  const value = ENV_CONFIG.features[feature];
  return typeof value === 'boolean' ? value : true;
};

// Performance configuration
export const getPerformanceConfig = () => ENV_CONFIG.performance;

// Security configuration  
export const getSecurityConfig = () => ENV_CONFIG.security;