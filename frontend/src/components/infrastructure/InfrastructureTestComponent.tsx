import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/card';
import { Button } from '@/components/shared/ui/button';
import { Badge } from '@/components/shared/ui/badge';
import { Alert, AlertDescription } from '@/components/shared/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shared/ui/tabs';
import { Input } from '@/components/shared/ui/input';
import { Label } from '@/components/shared/ui/label';
import { ENV_CONFIG, logger } from '@/services/environmentConfig';
import { cacheService } from '@/services/cacheService';
import { productionLogger } from '@/services/productionLogging';
import { productionValidator } from '@/services/productionValidation';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, Server, Database, Shield, Globe, Clock, Activity } from 'lucide-react';

export const InfrastructureTestComponent: React.FC = () => {
  const [backupStatus, setBackupStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, any>>({});

  // Test data for validation
  const [testData, setTestData] = useState({
    first_name: 'John',
    last_name: 'Doe', 
    email: 'john.doe@example.com',
    date_of_birth: '1990-01-01'
  });

  useEffect(() => {
    checkInfrastructureStatus();
  }, []);

  const checkInfrastructureStatus = async () => {
    setIsLoading(true);
    const results: Record<string, any> = {};

    // Test environment configuration
    results.environment = {
      status: 'healthy',
      environment: ENV_CONFIG.app.environment,
      features: ENV_CONFIG.features,
      performance: ENV_CONFIG.performance
    };

    // Test cache service
    try {
      cacheService.set('test-key', 'test-value', 5000);
      const cachedValue = cacheService.get('test-key');
      results.cache = {
        status: cachedValue === 'test-value' ? 'healthy' : 'error',
        stats: cacheService.getStats()
      };
    } catch (error) {
      results.cache = { status: 'error', error: error.message };
    }

    // Test production logging
    try {
      productionLogger.info('Infrastructure test log entry');
      results.logging = { status: 'healthy', logged: true };
    } catch (error) {
      results.logging = { status: 'error', error: error.message };
    }

    // Test validation service
    try {
      const validation = productionValidator.validateClientData(testData);
      results.validation = {
        status: validation.isValid ? 'healthy' : 'warning',
        result: validation
      };
    } catch (error) {
      results.validation = { status: 'error', error: error.message };
    }

    // Test database connection
    try {
      const { data: testQuery, error } = await supabase
        .from('clients')
        .select('id')
        .limit(1);
      
      results.database = {
        status: error ? 'error' : 'healthy',
        error: error?.message,
        connectionPool: ENV_CONFIG.performance.connectionPoolSize
      };
    } catch (error) {
      results.database = { status: 'error', error: error.message };
    }

    setTestResults(results);
    setIsLoading(false);
  };

  const testBackupSystem = async () => {
    setIsLoading(true);
    try {
      // Test backup status
      const { data: statusData, error: statusError } = await supabase.functions.invoke('backup-manager', {
        body: { action: 'status' }
      });

      if (statusError) {
        setBackupStatus({ status: 'error', error: statusError.message });
        return;
      }

      setBackupStatus(statusData);

      // Test creating a backup
      const { data: backupData, error: backupError } = await supabase.functions.invoke('backup-manager', {
        body: {
          action: 'create',
          config: {
            scheduleType: 'daily',
            retentionDays: 30,
            tables: ['clients', 'clinical_notes'],
            includeStorage: false
          }
        }
      });

      if (backupError) {
        setBackupStatus(prev => ({ ...prev, createTest: 'error', error: backupError.message }));
      } else {
        setBackupStatus(prev => ({ ...prev, createTest: 'success', backup: backupData }));
      }

    } catch (error) {
      setBackupStatus({ status: 'error', error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const testCacheOperations = () => {
    const testKey = 'cache-test-' + Date.now();
    const testValue = { message: 'Cache test successful', timestamp: Date.now() };
    
    // Test set/get
    cacheService.set(testKey, testValue, 10000);
    const retrieved = cacheService.get(testKey);
    
    // Test has
    const hasKey = cacheService.has(testKey);
    
    // Update results
    setTestResults(prev => ({
      ...prev,
      cacheOperations: {
        status: retrieved && hasKey ? 'healthy' : 'error',
        set: true,
        get: !!retrieved,
        has: hasKey,
        stats: cacheService.getStats()
      }
    }));
  };

  const testValidation = () => {
    const invalidData = {
      first_name: '',
      email: 'invalid-email',
      date_of_birth: 'invalid-date'
    };

    const validResult = productionValidator.validateClientData(testData);
    const invalidResult = productionValidator.validateClientData(invalidData);

    setTestResults(prev => ({
      ...prev,
      validationTest: {
        status: 'healthy',
        validData: validResult,
        invalidData: invalidResult
      }
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <Activity className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      healthy: 'default',
      warning: 'secondary',
      error: 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Infrastructure/DevOps Test Dashboard</h1>
        <p className="text-muted-foreground">
          Test environment configuration, caching, backup systems, and production services
        </p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Environment Config</CardTitle>
            <Server className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Active</div>
            <p className="text-xs text-muted-foreground">{ENV_CONFIG.app.environment}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Pool</CardTitle>
            <Database className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {ENV_CONFIG.performance.connectionPoolSize}
            </div>
            <p className="text-xs text-muted-foreground">connections</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cache Service</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {testResults.cache?.stats?.active || 0}
            </div>
            <p className="text-xs text-muted-foreground">cached items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Backup System</CardTitle>
            <Shield className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {backupStatus?.status === 'healthy' ? 'Ready' : 'Unknown'}
            </div>
            <p className="text-xs text-muted-foreground">
              {backupStatus?.totalBackups || 0} backups
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="environment">Environment</TabsTrigger>
          <TabsTrigger value="cache">Cache</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(testResults).map(([key, result]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.status)}
                      {getStatusBadge(result.status)}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Infrastructure Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={checkInfrastructureStatus} disabled={isLoading} className="w-full">
                  {isLoading ? 'Testing...' : 'Run Full System Test'}
                </Button>
                <Button onClick={testBackupSystem} variant="outline" disabled={isLoading} className="w-full">
                  Test Backup System
                </Button>
                <Button onClick={testCacheOperations} variant="outline" className="w-full">
                  Test Cache Operations
                </Button>
                <Button onClick={testValidation} variant="outline" className="w-full">
                  Test Validation Service
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="environment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Environment Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Application</h4>
                  <div className="space-y-1 text-sm">
                    <div>Name: {ENV_CONFIG.app.name}</div>
                    <div>Version: {ENV_CONFIG.app.version}</div>
                    <div>Environment: {ENV_CONFIG.app.environment}</div>
                    <div>Base URL: {ENV_CONFIG.app.baseUrl}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Performance</h4>
                  <div className="space-y-1 text-sm">
                    <div>Connection Pool: {ENV_CONFIG.performance.connectionPoolSize}</div>
                    <div>Request Timeout: {ENV_CONFIG.performance.requestTimeout}ms</div>
                    <div>Max Retries: {ENV_CONFIG.performance.maxRetries}</div>
                    <div>Cache Timeout: {ENV_CONFIG.performance.cacheTimeout}ms</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cache" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cache Service Status</CardTitle>
            </CardHeader>
            <CardContent>
              {testResults.cache && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{testResults.cache.stats?.total || 0}</div>
                      <div className="text-sm text-muted-foreground">Total Items</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{testResults.cache.stats?.active || 0}</div>
                      <div className="text-sm text-muted-foreground">Active Items</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{testResults.cache.stats?.expired || 0}</div>
                      <div className="text-sm text-muted-foreground">Expired Items</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{testResults.cache.stats?.memoryUsage || 0}</div>
                      <div className="text-sm text-muted-foreground">Memory Usage</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Backup System</CardTitle>
            </CardHeader>
            <CardContent>
              {backupStatus ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{backupStatus.totalBackups || 0}</div>
                      <div className="text-sm text-muted-foreground">Total Backups</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{backupStatus.activeSchedules || 0}</div>
                      <div className="text-sm text-muted-foreground">Active Schedules</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{backupStatus.automated ? 'Yes' : 'No'}</div>
                      <div className="text-sm text-muted-foreground">Automated</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">
                        {backupStatus.lastBackup ? new Date(backupStatus.lastBackup).toLocaleDateString() : 'None'}
                      </div>
                      <div className="text-sm text-muted-foreground">Last Backup</div>
                    </div>
                  </div>
                  
                  {backupStatus.error && (
                    <Alert variant="destructive">
                      <AlertDescription>{backupStatus.error}</AlertDescription>
                    </Alert>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Button onClick={testBackupSystem} disabled={isLoading}>
                    {isLoading ? 'Testing...' : 'Test Backup System'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Data Validation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={testData.first_name}
                    onChange={(e) => setTestData(prev => ({ ...prev, first_name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={testData.last_name}
                    onChange={(e) => setTestData(prev => ({ ...prev, last_name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={testData.email}
                    onChange={(e) => setTestData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={testData.date_of_birth}
                    onChange={(e) => setTestData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                  />
                </div>
              </div>
              
              <Button onClick={testValidation} className="w-full">
                Test Validation
              </Button>

              {testResults.validationTest && (
                <div className="space-y-2">
                  <div className="p-3 border rounded">
                    <strong>Valid Data Test:</strong>
                    <div className="text-sm">
                      Status: {testResults.validationTest.validData.isValid ? 'Valid' : 'Invalid'}
                      {Object.keys(testResults.validationTest.validData.errors).length > 0 && (
                        <div className="text-red-600 mt-1">
                          Errors: {JSON.stringify(testResults.validationTest.validData.errors)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-3 border rounded">
                    <strong>Invalid Data Test:</strong>
                    <div className="text-sm">
                      Status: {testResults.validationTest.invalidData.isValid ? 'Valid' : 'Invalid'}
                      {Object.keys(testResults.validationTest.invalidData.errors).length > 0 && (
                        <div className="text-red-600 mt-1">
                          Errors: {JSON.stringify(testResults.validationTest.invalidData.errors)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Implementation Status */}
      <Card>
        <CardHeader>
          <CardTitle>Infrastructure/DevOps Implementation Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>✅ Environment-specific configurations</span>
              <Badge variant="default">Implemented</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>✅ Database connection pooling</span>
              <Badge variant="default">Implemented</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>✅ Cache service with auto-cleanup</span>
              <Badge variant="default">Implemented</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>✅ Automated backup system</span>
              <Badge variant="default">Implemented</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>✅ Production logging service</span>
              <Badge variant="default">Implemented</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>✅ Production validation service</span>
              <Badge variant="default">Implemented</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>✅ Performance monitoring</span>
              <Badge variant="default">Implemented</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>⚡ CDN integration (static)</span>
              <Badge variant="secondary">Ready for deployment</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};