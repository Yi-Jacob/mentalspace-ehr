
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { ExecutiveDashboardData } from '@/hooks/useReportData';

interface InsightsGridProps {
  dashboardData: ExecutiveDashboardData;
  timeRange: string;
}

const InsightsGrid: React.FC<InsightsGridProps> = ({ dashboardData, timeRange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Performing Areas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Revenue Growth</span>
              <span className={`font-semibold ${dashboardData.revenueChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {dashboardData.revenueChange > 0 ? '+' : ''}{dashboardData.revenueChange.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Patient Growth</span>
              <span className={`font-semibold ${dashboardData.patientsChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {dashboardData.patientsChange > 0 ? '+' : ''}{dashboardData.patientsChange.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Notes Growth</span>
              <span className={`font-semibold ${dashboardData.notesChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {dashboardData.notesChange > 0 ? '+' : ''}{dashboardData.notesChange.toFixed(1)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Total Revenue</span>
              <span className="font-semibold text-blue-600">${dashboardData.totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Active Patients</span>
              <span className="font-semibold text-blue-600">{dashboardData.totalPatients}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Completed Appointments</span>
              <span className="font-semibold text-blue-600">{dashboardData.appointmentsCompleted}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Data Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Report Period</span>
              <span className="font-semibold">{timeRange} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Providers Tracked</span>
              <span className="font-semibold">{dashboardData.providerUtilization?.length || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Data Source</span>
              <span className="font-semibold text-green-600">Live</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightsGrid;
