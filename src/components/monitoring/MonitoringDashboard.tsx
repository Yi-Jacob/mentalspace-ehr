
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, RefreshCw, AlertTriangle, Activity, BarChart3, Bug } from 'lucide-react';
import { performanceMonitor } from '@/services/performanceMonitoring';
import { productionLogger, LogLevel } from '@/services/productionLogging';
import { analytics } from '@/services/analytics';
import { errorLogger } from '@/services/errorLogging';

const MonitoringDashboard: React.FC = () => {
  const [performanceSummary, setPerformanceSummary] = useState<any>(null);
  const [analyticsSummary, setAnalyticsSummary] = useState<any>(null);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [recentErrors, setRecentErrors] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    refreshData();
  }, [refreshKey]);

  const refreshData = () => {
    setPerformanceSummary(performanceMonitor.getPerformanceSummary());
    setAnalyticsSummary(analytics.getAnalyticsSummary());
    setRecentLogs(productionLogger.getRecentLogs(1));
    setRecentErrors(errorLogger.getRecentLogs());
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const exportData = (type: 'logs' | 'performance' | 'analytics' | 'errors') => {
    let data: string;
    let filename: string;

    switch (type) {
      case 'logs':
        data = productionLogger.exportLogs();
        filename = 'production-logs.json';
        break;
      case 'performance':
        data = JSON.stringify(performanceMonitor.getAllMetrics(), null, 2);
        filename = 'performance-metrics.json';
        break;
      case 'analytics':
        data = analytics.exportEvents();
        filename = 'analytics-events.json';
        break;
      case 'errors':
        data = JSON.stringify(errorLogger.getRecentLogs(), null, 2);
        filename = 'error-logs.json';
        break;
    }

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getLogLevelBadge = (level: LogLevel) => {
    const variants = {
      [LogLevel.DEBUG]: 'secondary',
      [LogLevel.INFO]: 'default',
      [LogLevel.WARN]: 'warning',
      [LogLevel.ERROR]: 'destructive',
      [LogLevel.CRITICAL]: 'destructive',
    } as const;

    const labels = {
      [LogLevel.DEBUG]: 'DEBUG',
      [LogLevel.INFO]: 'INFO',
      [LogLevel.WARN]: 'WARN',
      [LogLevel.ERROR]: 'ERROR',
      [LogLevel.CRITICAL]: 'CRITICAL',
    };

    return (
      <Badge variant={variants[level] || 'default'}>
        {labels[level]}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Monitoring Dashboard</h1>
          <p className="text-gray-600">Application performance, logs, and analytics</p>
        </div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Page Load</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceSummary?.averagePageLoad || 0}ms
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Slow Operations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceSummary?.slowOperations || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Errors</CardTitle>
            <Bug className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentErrors.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Session Events</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsSummary?.totalEvents || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Application performance overview</CardDescription>
              </div>
              <Button onClick={() => exportData('performance')} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              {performanceSummary ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded">
                    <div className="text-2xl font-bold">{performanceSummary.averagePageLoad}ms</div>
                    <div className="text-sm text-gray-600">Avg Page Load</div>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <div className="text-2xl font-bold">{performanceSummary.averageAPICall}ms</div>
                    <div className="text-sm text-gray-600">Avg API Call</div>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <div className="text-2xl font-bold">{performanceSummary.averageComponentRender}ms</div>
                    <div className="text-sm text-gray-600">Avg Component Render</div>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <div className="text-2xl font-bold">{performanceSummary.totalMetrics}</div>
                    <div className="text-sm text-gray-600">Total Metrics</div>
                  </div>
                </div>
              ) : (
                <p>No performance data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Logs</CardTitle>
                <CardDescription>Production application logs</CardDescription>
              </div>
              <Button onClick={() => exportData('logs')} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {recentLogs.length > 0 ? (
                  recentLogs.slice(0, 50).map((log) => (
                    <div key={log.id} className="flex items-start gap-3 p-3 border rounded">
                      <div className="flex-shrink-0">
                        {getLogLevelBadge(log.level)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{log.message}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                        {log.context && (
                          <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-x-auto">
                            {JSON.stringify(log.context, null, 2)}
                          </pre>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No logs available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Error Tracking</CardTitle>
                <CardDescription>Application errors and exceptions</CardDescription>
              </div>
              <Button onClick={() => exportData('errors')} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {recentErrors.length > 0 ? (
                  recentErrors.slice(0, 20).map((error) => (
                    <Alert key={error.id} variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-2">
                          <div className="font-medium">{error.error.message}</div>
                          <div className="text-xs">
                            {new Date(error.timestamp).toLocaleString()} | {error.context.component}
                          </div>
                          {error.error.stack && (
                            <details className="text-xs">
                              <summary className="cursor-pointer">Stack trace</summary>
                              <pre className="mt-2 p-2 bg-gray-100 rounded overflow-x-auto">
                                {error.error.stack}
                              </pre>
                            </details>
                          )}
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))
                ) : (
                  <p>No errors recorded</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Analytics Overview</CardTitle>
                <CardDescription>User behavior and application usage</CardDescription>
              </div>
              <Button onClick={() => exportData('analytics')} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              {analyticsSummary ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded">
                      <div className="text-2xl font-bold">{analyticsSummary.totalEvents}</div>
                      <div className="text-sm text-gray-600">Total Events</div>
                    </div>
                    <div className="text-center p-4 border rounded">
                      <div className="text-2xl font-bold">{analyticsSummary.currentSession.pageViews}</div>
                      <div className="text-sm text-gray-600">Page Views</div>
                    </div>
                    <div className="text-center p-4 border rounded">
                      <div className="text-2xl font-bold">{analyticsSummary.currentSession.interactions}</div>
                      <div className="text-sm text-gray-600">Interactions</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Events by Category</h4>
                    <div className="space-y-2">
                      {Object.entries(analyticsSummary.eventsByCategory || {}).map(([category, count]) => (
                        <div key={category} className="flex justify-between items-center p-2 border rounded">
                          <span className="capitalize">{category.replace('_', ' ')}</span>
                          <Badge>{count as number}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p>No analytics data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MonitoringDashboard;
