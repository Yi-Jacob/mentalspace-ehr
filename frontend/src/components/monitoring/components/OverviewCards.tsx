
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/card';

interface OverviewCardsProps {
  analyticsData: any;
  performanceMetrics: any;
}

const OverviewCards = ({ analyticsData, performanceMetrics }: OverviewCardsProps) => {
  return (
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
  );
};

export default OverviewCards;
