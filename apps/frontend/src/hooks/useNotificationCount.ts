import { useState, useEffect, useRef, useCallback } from 'react';
import { NotificationService } from '@/services/notificationService';

interface UseNotificationCountOptions {
  pollInterval?: number; // in milliseconds
  enabled?: boolean;
  onError?: (error: Error) => void;
}

export const useNotificationCount = (options: UseNotificationCountOptions = {}) => {
  const {
    pollInterval = 15000, // 15 seconds
    enabled = true,
    onError
  } = options;

  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isActiveRef = useRef(true);
  const lastFetchRef = useRef<number>(0);

  // Fetch notification count
  const fetchNotificationCount = useCallback(async () => {
    if (!enabled || !isActiveRef.current) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const count = await NotificationService.getUnreadCount();
      
      if (isActiveRef.current) {
        setUnreadCount(count);
        lastFetchRef.current = Date.now();
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch notification count');
      setError(error);
      onError?.(error);
      console.error('Error fetching notification count:', error);
    } finally {
      if (isActiveRef.current) {
        setIsLoading(false);
      }
    }
  }, [enabled, onError]);

  // Start polling
  const startPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (enabled && isActiveRef.current) {
      // Fetch immediately
      fetchNotificationCount();
      
      // Then set up interval
      intervalRef.current = setInterval(() => {
        if (isActiveRef.current && enabled) {
          fetchNotificationCount();
        }
      }, pollInterval);
    }
  }, [enabled, pollInterval, fetchNotificationCount]);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Manual refresh
  const refresh = useCallback(() => {
    fetchNotificationCount();
  }, [fetchNotificationCount]);

  // Handle visibility change (pause when tab is not visible)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        // Resume polling when tab becomes visible
        // Only if it's been more than pollInterval since last fetch
        const timeSinceLastFetch = Date.now() - lastFetchRef.current;
        if (timeSinceLastFetch >= pollInterval) {
          startPolling();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [startPolling, stopPolling, pollInterval]);

  // Handle focus/blur (pause when window loses focus)
  useEffect(() => {
    const handleFocus = () => {
      if (!document.hidden) {
        startPolling();
      }
    };

    const handleBlur = () => {
      stopPolling();
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [startPolling, stopPolling]);

  // Main effect
  useEffect(() => {
    isActiveRef.current = true;
    
    if (enabled) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      isActiveRef.current = false;
      stopPolling();
    };
  }, [enabled, startPolling, stopPolling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isActiveRef.current = false;
      stopPolling();
    };
  }, [stopPolling]);

  return {
    unreadCount,
    isLoading,
    error,
    refresh,
    startPolling,
    stopPolling
  };
};
