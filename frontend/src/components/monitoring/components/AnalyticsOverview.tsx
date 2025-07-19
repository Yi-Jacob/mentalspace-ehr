
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AnalyticsOverviewProps {
  analyticsData: any;
}

const AnalyticsOverview = ({ analyticsData }: AnalyticsOverviewProps) => {
  return (
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
  );
};

export default AnalyticsOverview;
