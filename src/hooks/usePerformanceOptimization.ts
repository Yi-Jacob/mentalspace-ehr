import { useCallback, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Performance monitoring hook
export const usePerformanceMonitoring = (componentName: string) => {
  const renderStartTime = useRef<number>(Date.now());
  const queryClient = useQueryClient();

  useEffect(() => {
    const renderTime = Date.now() - renderStartTime.current;
    
    // Track component render time
    if (renderTime > 100) { // Only track slow renders
      trackPerformanceMetric('component_render', renderTime, componentName);
    }
  }, [componentName]);

  const trackInteraction = useCallback((action: string, element?: string) => {
    const startTime = Date.now();
    
    return () => {
      const duration = Date.now() - startTime;
      trackPerformanceMetric(`interaction_${action}`, duration, element || componentName);
    };
  }, [componentName]);

  const trackApiCall = useCallback((endpoint: string, startTime: number) => {
    const duration = Date.now() - startTime;
    trackPerformanceMetric('api_call', duration, endpoint);
  }, []);

  return {
    trackInteraction,
    trackApiCall,
    invalidateQueries: queryClient.invalidateQueries
  };
};

// Web Vitals tracking
export const useWebVitals = () => {
  useEffect(() => {
    // Track Core Web Vitals
    if ('web-vital' in window) {
      return;
    }

    // Cumulative Layout Shift (CLS)
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
          trackPerformanceMetric('cumulative_layout_shift', (entry as any).value * 1000);
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      // Layout shift not supported
    }

    // First Contentful Paint (FCP)
    const paintObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          trackPerformanceMetric('first_contentful_paint', entry.startTime);
        }
      }
    });

    try {
      paintObserver.observe({ entryTypes: ['paint'] });
    } catch (e) {
      // Paint timing not supported
    }

    return () => {
      observer.disconnect();
      paintObserver.disconnect();
    };
  }, []);
};

// Enhanced caching hook
export const useOptimizedQuery = <T>(
  key: string[],
  queryFn: () => Promise<T>,
  options: {
    staleTime?: number;
    cacheTime?: number;
    refetchOnWindowFocus?: boolean;
    refetchOnMount?: boolean;
    serverCacheKey?: string;
    serverCacheMinutes?: number;
  } = {}
) => {
  const {
    staleTime = 5 * 60 * 1000, // 5 minutes
    cacheTime = 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus = false,
    refetchOnMount = false,
    serverCacheKey,
    serverCacheMinutes = 30
  } = options;

  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const startTime = Date.now();

      try {
        // Try server-side cache first if enabled
        if (serverCacheKey) {
          const { data: cachedData } = await supabase.rpc('get_cached_query', {
            p_cache_key: serverCacheKey
          });

          if (cachedData) {
            trackPerformanceMetric('cache_hit', Date.now() - startTime, serverCacheKey);
            return cachedData as T;
          }
        }

        // Execute the actual query
        const result = await queryFn();

        // Cache the result on server if enabled
        if (serverCacheKey && result) {
          await supabase.rpc('set_cached_query', {
            p_cache_key: serverCacheKey,
            p_data: result as any,
            p_expires_minutes: serverCacheMinutes
          });
        }

        trackPerformanceMetric('query_execution', Date.now() - startTime, key.join('_'));
        return result;
      } catch (error) {
        trackPerformanceMetric('query_error', Date.now() - startTime, key.join('_'));
        throw error;
      }
    },
    staleTime,
    gcTime: cacheTime,
    refetchOnWindowFocus,
    refetchOnMount,
  });
};

// Virtual scrolling hook for large lists
export const useVirtualScrolling = <T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );

  const visibleItems = items.slice(startIndex, endIndex);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    startIndex,
    endIndex
  };
};

// Image optimization hook
export const useOptimizedImage = (src: string, options: {
  quality?: number;
  width?: number;
  height?: number;
  format?: 'webp' | 'jpeg' | 'png';
} = {}) => {
  const { quality = 80, width, height, format = 'webp' } = options;
  
  // For now, return original src - in production this would use a CDN
  const optimizedSrc = src;
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setLoaded(true);
    img.onerror = () => setError(true);
    img.src = optimizedSrc;
  }, [optimizedSrc]);

  return { src: optimizedSrc, loaded, error };
};

// Performance utility function
const trackPerformanceMetric = async (
  metricName: string, 
  value: number, 
  context?: string
) => {
  try {
    // Only track in production or when explicitly enabled
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance: ${metricName}`, { value, context });
      return;
    }

    await supabase.from('performance_metrics').insert({
      metric_name: metricName,
      metric_value: value,
      route: window.location.pathname,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    // Silently fail - don't break app for metrics
    console.warn('Failed to track performance metric:', error);
  }
};

export { trackPerformanceMetric };