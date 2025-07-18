
import React, { useState } from 'react';
import { useExecutiveDashboardData } from '@/hooks/useReportData';
import DashboardHeader from './components/DashboardHeader';
import KPIGrid from './components/KPIGrid';
import RevenueTrendChart from './components/RevenueTrendChart';
import ChartsGrid from './components/ChartsGrid';
import InsightsGrid from './components/InsightsGrid';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import EmptyState from './components/EmptyState';

const ExecutiveDashboard = () => {
  const [timeRange, setTimeRange] = useState('30');
  
  const { data: dashboardData, isLoading, error, refetch } = useExecutiveDashboardData(timeRange);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  if (!dashboardData) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        onRefresh={() => refetch()}
      />

      <KPIGrid dashboardData={dashboardData} />

      <RevenueTrendChart data={dashboardData.revenueData} />

      <ChartsGrid dashboardData={dashboardData} />

      <InsightsGrid dashboardData={dashboardData} timeRange={timeRange} />
    </div>
  );
};

export default ExecutiveDashboard;
