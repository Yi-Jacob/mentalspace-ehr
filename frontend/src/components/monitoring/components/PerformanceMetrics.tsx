
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shared/ui/card';

interface PerformanceMetricsProps {
  performanceMetrics: any;
}

const PerformanceMetrics = ({ performanceMetrics }: PerformanceMetricsProps) => {
  return (
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
  );
};

export default PerformanceMetrics;
