
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { performanceMonitor } from '@/services/performanceMonitoring';
import { errorLogger } from '@/services/errorLogging';
import { analytics } from '@/services/analytics';

const MonitoringDashboard = () => {
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const [errorLogs, setErrorLogs] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      // Get performance metrics - use correct method name
      const metrics = performanceMonitor.getPerformanceSummary();
      setPerformanceMetrics(metrics);

      // Get recent error logs
      const logs = errorLogger.getRecentLogs();
      setErrorLogs(logs);

      // Get analytics summary - use available methods
      const analyticsMetrics = {
        pageViews: { total: analytics.getEventCount('page_view') },
        activeUsers: analytics.getEventCount('user_action'),
        featureUsage: analytics.getFeatureUsageStats(),
        userActions: analytics.getUserActionStats(),
      };
      setAnalyticsData(analyticsMetrics);
    } catch (error) {
      console.error('Failed to refresh monitoring data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'outline';
      case 'low':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical':
      case 'high':
        return <XCircle className="h-4 w-4" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4" />;
      case 'low':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  useEffect(() => {
    refreshData();
    // Refresh every 30 seconds
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Monitoring Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time application performance and error monitoring
          </p>
        </div>
        <Button onClick={refreshData} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData?.pageViews?.total || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Last 24 hours
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {performanceMetrics?.slowOperations ? 
                    Math.round((performanceMetrics.slowOperations / performanceMetrics.totalMetrics) * 100) : 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Current error rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {performanceMetrics?.averageAPICall || 0}ms
                </div>
                <p className="text-xs text-muted-foreground">
                  API response time
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData?.activeUsers || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently online
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Application performance indicators and response times
              </CardDescription>
            </CardHeader>
            <CardContent>
              {performanceMetrics ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <h4 className="font-medium">Page Load Time</h4>
                      <p className="text-2xl font-bold">{performanceMetrics.averagePageLoad || 0}ms</p>
                    </div>
                    <div>
                      <h4 className="font-medium">API Calls</h4>
                      <p className="text-2xl font-bold">{performanceMetrics.totalMetrics || 0}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Slow Operations</h4>
                      <p className="text-2xl font-bold">{performanceMetrics.slowOperations || 0}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p>Loading performance data...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Errors</CardTitle>
              <CardDescription>
                Latest application errors and their severity levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              {errorLogs.length > 0 ? (
                <div className="space-y-2">
                  {errorLogs.slice(0, 10).map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(log.severity)}
                        <div>
                          <p className="font-medium">{log.error.message}</p>
                          <p className="text-sm text-muted-foreground">
                            {log.context.component} - {new Date(log.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant={getStatusBadgeVariant(log.severity)}>
                        {log.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No recent errors found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Overview</CardTitle>
              <CardDescription>
                User behavior and application usage metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsData ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium">Feature Usage</h4>
                      <div className="mt-2 space-y-1">
                        {Object.entries(analyticsData.featureUsage || {}).map(([feature, count]) => (
                          <div key={feature} className="flex justify-between">
                            <span className="text-sm">{feature}</span>
                            <span className="text-sm font-medium">{count as number}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium">User Actions</h4>
                      <div className="mt-2 space-y-1">
                        {Object.entries(analyticsData.userActions || {}).map(([action, count]) => (
                          <div key={action} className="flex justify-between">
                            <span className="text-sm">{action}</span>
                            <span className="text-sm font-medium">{count as number}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p>Loading analytics data...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MonitoringDashboard;
