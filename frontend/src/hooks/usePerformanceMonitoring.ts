
import { useEffect, useRef, useCallback } from 'react';
import { performanceMonitor } from '@/services/performanceMonitoring';
import { analytics } from '@/services/analytics';

export const usePerformanceMonitoring = (componentName: string) => {
  const renderStartTime = useRef<number>(Date.now());
  const mountTime = useRef<number>(Date.now());

  // Track component mount/unmount
  useEffect(() => {
    mountTime.current = Date.now();
    
    return () => {
      const unmountTime = Date.now();
      const componentLifetime = unmountTime - mountTime.current;
      
      analytics.trackEvent('component_unmount', 'feature_usage', {
        componentName,
        lifetime: componentLifetime,
      });
    };
  }, [componentName]);

  // Track render performance
  useEffect(() => {
    const renderTime = Date.now() - renderStartTime.current;
    
    performanceMonitor.trackComponentRender(componentName, renderTime);
    analytics.trackEvent('component_render', 'performance', {
      componentName,
      renderTime,
    });
  });

  // Track user interactions
  const trackInteraction = useCallback((action: string, element?: string, metadata?: Record<string, any>) => {
    analytics.trackClick(element || action, componentName);
    analytics.trackEvent(`${componentName}_${action}`, 'user_action', {
      component: componentName,
      element,
      ...metadata,
    });
  }, [componentName]);

  // Track feature usage
  const trackFeature = useCallback((feature: string, action: string, metadata?: Record<string, any>) => {
    analytics.trackFeatureUsage(feature, action, {
      component: componentName,
      ...metadata,
    });
  }, [componentName]);

  // Track errors within component
  const trackError = useCallback((error: Error, context?: string) => {
    analytics.trackError('component_error', error.message, error.stack);
    analytics.trackEvent('component_error', 'error', {
      component: componentName,
      context,
      errorMessage: error.message,
      stack: error.stack,
    });
  }, [componentName]);

  return {
    trackInteraction,
    trackFeature,
    trackError,
  };
};

// Hook for tracking page views
export const usePageTracking = (pageName: string, title?: string) => {
  useEffect(() => {
    // Track page view
    analytics.trackPageView(pageName, title);
    
    // Track page load performance
    performanceMonitor.trackPageLoad(pageName);
    
    // Track page visibility
    const handleVisibilityChange = () => {
      if (document.hidden) {
        analytics.trackEvent('page_hidden', 'page_view', { page: pageName });
      } else {
        analytics.trackEvent('page_visible', 'page_view', { page: pageName });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pageName, title]);
};

// Hook for tracking API calls
export const useAPIMonitoring = () => {
  const trackAPICall = useCallback(async <T>(
    apiCall: () => Promise<T>,
    endpoint: string,
    method: string = 'GET'
  ): Promise<T> => {
    const startTime = Date.now();
    
    try {
      const result = await apiCall();
      const duration = Date.now() - startTime;
      
      performanceMonitor.trackAPICall(endpoint, method, duration, true);
      analytics.trackEvent('api_success', 'feature_usage', {
        endpoint,
        method,
        duration,
      });
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      performanceMonitor.trackAPICall(endpoint, method, duration, false);
      analytics.trackError('api_error', error instanceof Error ? error.message : 'Unknown API error');
      analytics.trackEvent('api_error', 'error', {
        endpoint,
        method,
        duration,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw error;
    }
  }, []);

  return { trackAPICall };
};
