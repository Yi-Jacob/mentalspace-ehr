
import { useState, useEffect, useCallback } from 'react';
import { performanceMonitor } from '@/services/performanceMonitoring';
import { errorLogger } from '@/utils/errorLogging';
import { analytics } from '@/services/analytics';

export const useMonitoringData = () => {
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const [errorLogs, setErrorLogs] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Get performance metrics
      const metrics = performanceMonitor.getPerformanceSummary();
      setPerformanceMetrics(metrics);

      // Get recent error logs
      const logs = errorLogger.getRecentLogs();
      setErrorLogs(logs);

      // Get analytics summary
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
  }, []);

  useEffect(() => {
    refreshData();
    // Refresh every 30 seconds
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, [refreshData]);

  return {
    performanceMetrics,
    errorLogs,
    analyticsData,
    isRefreshing,
    refreshData,
  };
};
