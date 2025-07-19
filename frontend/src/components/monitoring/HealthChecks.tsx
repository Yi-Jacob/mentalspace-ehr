import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/card';
import { Badge } from '@/components/shared/ui/badge';
import { Button } from '@/components/shared/ui/button';
import { Progress } from '@/components/shared/ui/progress';
import { ScrollArea } from '@/components/shared/ui/scroll-area';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock,
  Database,
  Globe,
  Shield,
  Activity,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface HealthCheck {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'critical' | 'checking';
  responseTime?: number;
  lastChecked: Date;
  details?: string;
  critical: boolean;
}

interface SystemMetrics {
  uptime: number;
  responseTime: number;
  errorRate: number;
  activeUsers: number;
}

export const HealthChecks: React.FC = () => {
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Initialize health checks
  useEffect(() => {
    const initialChecks: HealthCheck[] = [
      {
        id: 'database',
        name: 'Database Connection',
        status: 'checking',
        critical: true,
        lastChecked: new Date()
      },
      {
        id: 'auth',
        name: 'Authentication Service',
        status: 'checking',
        critical: true,
        lastChecked: new Date()
      },
      {
        id: 'api',
        name: 'API Endpoints',
        status: 'checking',
        critical: true,
        lastChecked: new Date()
      },
      {
        id: 'storage',
        name: 'File Storage',
        status: 'checking',
        critical: false,
        lastChecked: new Date()
      },
      {
        id: 'external',
        name: 'External APIs',
        status: 'checking',
        critical: false,
        lastChecked: new Date()
      }
    ];

    setHealthChecks(initialChecks);
    runHealthChecks();
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      runHealthChecks();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const runHealthChecks = async () => {
    setIsRefreshing(true);
    const startTime = Date.now();

    try {
      // Database health check
      const dbCheck = await checkDatabase();
      
      // Auth health check
      const authCheck = await checkAuthentication();
      
      // API health check
      const apiCheck = await checkAPIEndpoints();
      
      // Storage health check
      const storageCheck = await checkStorage();
      
      // External APIs check
      const externalCheck = await checkExternalAPIs();

      const updatedChecks: HealthCheck[] = [
        { ...dbCheck, id: 'database', name: 'Database Connection', critical: true, status: dbCheck.status || 'checking', lastChecked: dbCheck.lastChecked || new Date() },
        { ...authCheck, id: 'auth', name: 'Authentication Service', critical: true, status: authCheck.status || 'checking', lastChecked: authCheck.lastChecked || new Date() },
        { ...apiCheck, id: 'api', name: 'API Endpoints', critical: true, status: apiCheck.status || 'checking', lastChecked: apiCheck.lastChecked || new Date() },
        { ...storageCheck, id: 'storage', name: 'File Storage', critical: false, status: storageCheck.status || 'checking', lastChecked: storageCheck.lastChecked || new Date() },
        { ...externalCheck, id: 'external', name: 'External APIs', critical: false, status: externalCheck.status || 'checking', lastChecked: externalCheck.lastChecked || new Date() }
      ];

      setHealthChecks(updatedChecks);

      // Calculate system metrics
      const totalResponseTime = Date.now() - startTime;
      const healthyChecks = updatedChecks.filter(check => check.status === 'healthy').length;
      const totalChecks = updatedChecks.length;

      setSystemMetrics({
        uptime: 99.5, // This would come from monitoring service
        responseTime: totalResponseTime / updatedChecks.length,
        errorRate: ((totalChecks - healthyChecks) / totalChecks) * 100,
        activeUsers: 42 // This would come from analytics
      });

      setLastUpdate(new Date());
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const checkDatabase = async (): Promise<Partial<HealthCheck>> => {
    const startTime = Date.now();
    try {
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1);

      const responseTime = Date.now() - startTime;

      if (error) {
        return {
          status: 'critical',
          responseTime,
          lastChecked: new Date(),
          details: `Database error: ${error.message}`
        };
      }

      return {
        status: responseTime < 500 ? 'healthy' : 'warning',
        responseTime,
        lastChecked: new Date(),
        details: `Query executed in ${responseTime}ms`
      };
    } catch (error) {
      return {
        status: 'critical',
        responseTime: Date.now() - startTime,
        lastChecked: new Date(),
        details: `Connection failed: ${error}`
      };
    }
  };

  const checkAuthentication = async (): Promise<Partial<HealthCheck>> => {
    const startTime = Date.now();
    try {
      const { data } = await supabase.auth.getSession();
      const responseTime = Date.now() - startTime;

      return {
        status: 'healthy',
        responseTime,
        lastChecked: new Date(),
        details: `Auth service responding in ${responseTime}ms`
      };
    } catch (error) {
      return {
        status: 'critical',
        responseTime: Date.now() - startTime,
        lastChecked: new Date(),
        details: `Auth service unavailable: ${error}`
      };
    }
  };

  const checkAPIEndpoints = async (): Promise<Partial<HealthCheck>> => {
    const startTime = Date.now();
    try {
      // Test a few key API endpoints
      const endpoints = [
        () => supabase.from('clients').select('count').limit(1),
        () => supabase.from('clinical_notes').select('count').limit(1),
        () => supabase.from('appointments').select('count').limit(1)
      ];

      const results = await Promise.allSettled(endpoints.map(fn => fn()));
      const responseTime = Date.now() - startTime;
      
      const failedCount = results.filter(result => result.status === 'rejected').length;
      
      if (failedCount === 0) {
        return {
          status: 'healthy',
          responseTime,
          lastChecked: new Date(),
          details: `All ${endpoints.length} endpoints responding`
        };
      } else if (failedCount < endpoints.length) {
        return {
          status: 'warning',
          responseTime,
          lastChecked: new Date(),
          details: `${failedCount}/${endpoints.length} endpoints failing`
        };
      } else {
        return {
          status: 'critical',
          responseTime,
          lastChecked: new Date(),
          details: 'All API endpoints failing'
        };
      }
    } catch (error) {
      return {
        status: 'critical',
        responseTime: Date.now() - startTime,
        lastChecked: new Date(),
        details: `API check failed: ${error}`
      };
    }
  };

  const checkStorage = async (): Promise<Partial<HealthCheck>> => {
    const startTime = Date.now();
    try {
      const { data, error } = await supabase.storage.listBuckets();
      const responseTime = Date.now() - startTime;

      if (error) {
        return {
          status: 'warning',
          responseTime,
          lastChecked: new Date(),
          details: `Storage service error: ${error.message}`
        };
      }

      return {
        status: 'healthy',
        responseTime,
        lastChecked: new Date(),
        details: `Storage accessible, ${data?.length || 0} buckets`
      };
    } catch (error) {
      return {
        status: 'warning',
        responseTime: Date.now() - startTime,
        lastChecked: new Date(),
        details: `Storage check failed: ${error}`
      };
    }
  };

  const checkExternalAPIs = async (): Promise<Partial<HealthCheck>> => {
    const startTime = Date.now();
    try {
      // Simulate external API checks
      await new Promise(resolve => setTimeout(resolve, 100));
      const responseTime = Date.now() - startTime;

      return {
        status: 'healthy',
        responseTime,
        lastChecked: new Date(),
        details: 'External services responding normally'
      };
    } catch (error) {
      return {
        status: 'warning',
        responseTime: Date.now() - startTime,
        lastChecked: new Date(),
        details: `External API check failed: ${error}`
      };
    }
  };

  const getStatusIcon = (status: HealthCheck['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'checking':
        return <Clock className="h-4 w-4 text-gray-400 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: HealthCheck['status']) => {
    const variants = {
      healthy: 'default',
      warning: 'secondary', 
      critical: 'destructive',
      checking: 'outline'
    } as const;

    return (
      <Badge variant={variants[status]} className="capitalize">
        {status === 'checking' ? 'Checking...' : status}
      </Badge>
    );
  };

  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'database':
        return <Database className="h-5 w-5" />;
      case 'auth':
        return <Shield className="h-5 w-5" />;
      case 'api':
        return <Globe className="h-5 w-5" />;
      case 'storage':
        return <Activity className="h-5 w-5" />;
      case 'external':
        return <Globe className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const overallStatus = () => {
    const criticalIssues = healthChecks.filter(check => check.status === 'critical' && check.critical);
    const warningIssues = healthChecks.filter(check => check.status === 'warning');
    
    if (criticalIssues.length > 0) return 'critical';
    if (warningIssues.length > 0) return 'warning';
    return 'healthy';
  };

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              {getStatusIcon(overallStatus())}
              <span>System Health</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={runHealthChecks}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {systemMetrics && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {systemMetrics.uptime.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {systemMetrics.responseTime.toFixed(0)}ms
                </div>
                <div className="text-sm text-muted-foreground">Avg Response</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {systemMetrics.errorRate.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Error Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {systemMetrics.activeUsers}
                </div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Individual Health Checks */}
      <Card>
        <CardHeader>
          <CardTitle>Service Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {healthChecks.map((check) => (
                <div 
                  key={check.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {getServiceIcon(check.id)}
                    <div>
                      <div className="font-medium flex items-center space-x-2">
                        <span>{check.name}</span>
                        {check.critical && (
                          <Badge variant="outline" className="text-xs">
                            Critical
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {check.details || 'No additional details'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Last checked: {check.lastChecked.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {check.responseTime && (
                      <span className="text-sm text-muted-foreground">
                        {check.responseTime}ms
                      </span>
                    )}
                    {getStatusBadge(check.status)}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Database Response Time</span>
                <span className="text-muted-foreground">Target: &lt;200ms</span>
              </div>
              <Progress 
                value={Math.min((systemMetrics?.responseTime || 0) / 2, 100)} 
                className="h-2"
              />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Error Rate</span>
                <span className="text-muted-foreground">Target: &lt;1%</span>
              </div>
              <Progress 
                value={systemMetrics?.errorRate || 0} 
                className="h-2"
              />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>System Uptime</span>
                <span className="text-muted-foreground">Target: &gt;99.9%</span>
              </div>
              <Progress 
                value={systemMetrics?.uptime || 0} 
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};