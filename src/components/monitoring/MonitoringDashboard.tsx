
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useMonitoringData } from './hooks/useMonitoringData';
import OverviewCards from './components/OverviewCards';
import PerformanceMetrics from './components/PerformanceMetrics';
import ErrorLogs from './components/ErrorLogs';
import AnalyticsOverview from './components/AnalyticsOverview';
import { HealthChecks } from './HealthChecks';
import { AlertingSystem } from './AlertingSystem';
import { LogAggregation } from './LogAggregation';

const MonitoringDashboard = () => {
  const {
    performanceMetrics,
    errorLogs,
    analyticsData,
    isRefreshing,
    refreshData,
  } = useMonitoringData();

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
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <OverviewCards 
            analyticsData={analyticsData} 
            performanceMetrics={performanceMetrics} 
          />
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <PerformanceMetrics performanceMetrics={performanceMetrics} />
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <ErrorLogs errorLogs={errorLogs} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsOverview analyticsData={analyticsData} />
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <HealthChecks />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <AlertingSystem />
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <LogAggregation />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MonitoringDashboard;
