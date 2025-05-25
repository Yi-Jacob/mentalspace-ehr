
interface EnvironmentConfig {
  apiUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  environment: 'development' | 'staging' | 'production';
  enableAnalytics: boolean;
  enableErrorReporting: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

class ConfigService {
  private config: EnvironmentConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): EnvironmentConfig {
    // Detect environment
    const hostname = window.location.hostname;
    const isProduction = hostname.includes('.lovable.app') || !hostname.includes('localhost');
    const environment = isProduction ? 'production' : 'development';

    return {
      apiUrl: 'https://wjaccopklttdvnutdmtu.supabase.co',
      supabaseUrl: 'https://wjaccopklttdvnutdmtu.supabase.co',
      supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqYWNjb3BrbHR0ZHZudXRkbXR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwOTg2NzcsImV4cCI6MjA2MzY3NDY3N30.kf1o-FbWRqfVEHDypcpSOGpOcRUPHFtaJgfZOCqDaek',
      environment,
      enableAnalytics: isProduction,
      enableErrorReporting: isProduction,
      logLevel: isProduction ? 'warn' : 'debug'
    };
  }

  get(key: keyof EnvironmentConfig) {
    return this.config[key];
  }

  getAll(): EnvironmentConfig {
    return { ...this.config };
  }

  isDevelopment(): boolean {
    return this.config.environment === 'development';
  }

  isProduction(): boolean {
    return this.config.environment === 'production';
  }
}

export const config = new ConfigService();
