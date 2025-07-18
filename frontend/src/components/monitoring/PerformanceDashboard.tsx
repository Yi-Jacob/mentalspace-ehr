import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Clock, 
  TrendingUp, 
  Zap,
  Database,
  Globe,
  RefreshCw
} from 'lucide-react';
import { useWebVitals } from '@/hooks/usePerformanceOptimization';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  target: number;
  status: 'good' | 'needs-improvement' | 'poor';
  description: string;
}

const PerformanceDashboard: React.FC = () => {
  useWebVitals(); // Initialize Web Vitals tracking

  const [metrics, setMetrics] = React.useState<PerformanceMetric[]>([
    {
      name: 'First Contentful Paint',
      value: 1200,
      unit: 'ms',
      target: 1800,
      status: 'good',
      description: 'Time to first paint of any content'
    },
    {
      name: 'Largest Contentful Paint',
      value: 2100,
      unit: 'ms',
      target: 2500,
      status: 'good',
      description: 'Time to render largest content element'
    },
    {
      name: 'Cumulative Layout Shift',
      value: 0.08,
      unit: 'score',
      target: 0.1,
      status: 'good',
      description: 'Visual stability measurement'
    },
    {
      name: 'Time to Interactive',
      value: 3200,
      unit: 'ms',
      target: 3800,
      status: 'good',
      description: 'Time until page becomes fully interactive'
    }
  ]);

  const [systemMetrics, setSystemMetrics] = React.useState({
    databaseResponseTime: 145,
    cacheHitRate: 87,
    activeConnections: 23,
    memoryUsage: 62
  });

  const getStatusColor = (status: PerformanceMetric['status']) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'needs-improvement': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: PerformanceMetric['status']) => {
    const variants = {
      good: 'default',
      'needs-improvement': 'secondary',
      poor: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status]} className="capitalize">
        {status === 'needs-improvement' ? 'Needs Improvement' : status}
      </Badge>
    );
  };

  const refreshMetrics = () => {
    // Simulate refreshing performance data
    console.log('Refreshing performance metrics...');
    
    // In a real app, this would fetch fresh data
    setMetrics(prev => prev.map(metric => ({
      ...metric,
      value: metric.value + (Math.random() - 0.5) * 100
    })));
  };

  const performanceScore = React.useMemo(() => {
    const scores = metrics.map(metric => {
      const normalized = Math.min(metric.value / metric.target, 1);
      return metric.name.includes('Layout Shift') 
        ? (1 - normalized) * 100  // Lower is better for CLS
        : (1 - normalized) * 100; // Lower is better for timing metrics
    });
    
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, [metrics]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Performance Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor application performance and Core Web Vitals
          </p>
        </div>
        <Button onClick={refreshMetrics} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Metrics
        </Button>
      </div>

      {/* Performance Score Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Overall Performance Score</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="text-4xl font-bold text-primary">
              {performanceScore}
            </div>
            <div className="flex-1">
              <Progress value={performanceScore} className="h-3" />
              <p className="text-sm text-muted-foreground mt-1">
                {performanceScore >= 90 ? 'Excellent' : 
                 performanceScore >= 70 ? 'Good' : 
                 performanceScore >= 50 ? 'Needs Improvement' : 'Poor'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Core Web Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.name}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                  {metric.value.toFixed(metric.name.includes('Layout') ? 3 : 0)}
                  <span className="text-sm text-muted-foreground ml-1">
                    {metric.unit}
                  </span>
                </span>
                {getStatusBadge(metric.status)}
              </div>
              <Progress 
                value={(metric.value / metric.target) * 100} 
                className="h-2 mb-2"
              />
              <p className="text-xs text-muted-foreground">
                {metric.description}
              </p>
              <p className="text-xs text-muted-foreground">
                Target: {metric.target}{metric.unit}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Response</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.databaseResponseTime}ms</div>
            <p className="text-xs text-muted-foreground">
              Average query response time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.cacheHitRate}%</div>
            <p className="text-xs text-muted-foreground">
              Requests served from cache
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.activeConnections}</div>
            <p className="text-xs text-muted-foreground">
              Current database connections
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.memoryUsage}%</div>
            <p className="text-xs text-muted-foreground">
              Application memory usage
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Optimization Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Performance Optimization Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2" />
              <div>
                <p className="font-medium">Enable Browser Caching</p>
                <p className="text-sm text-muted-foreground">
                  Configure proper cache headers for static assets to improve load times
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2" />
              <div>
                <p className="font-medium">Optimize Database Queries</p>
                <p className="text-sm text-muted-foreground">
                  Review slow queries and add appropriate indexes for better performance
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2" />
              <div>
                <p className="font-medium">Implement Code Splitting</p>
                <p className="text-sm text-muted-foreground">
                  Use lazy loading to reduce initial bundle size and improve load times
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceDashboard;