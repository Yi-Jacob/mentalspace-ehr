import { QueryClient } from '@tanstack/react-query';

// Enhanced query client configuration for optimal performance
export const createOptimizedQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Cache data for 5 minutes by default
        staleTime: 5 * 60 * 1000,
        // Keep data in cache for 30 minutes
        gcTime: 30 * 60 * 1000,
        // Don't refetch on window focus by default (can be overridden)
        refetchOnWindowFocus: false,
        // Retry failed requests 2 times
        retry: 2,
        // Retry with exponential backoff
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        // Retry mutations once
        retry: 1,
      },
    },
  });
};

// Prefetch strategies for common queries
export const prefetchStrategies = {
  // Prefetch client data when hovering over client cards
  prefetchClientDetails: (queryClient: QueryClient, clientId: string) => {
    queryClient.prefetchQuery({
      queryKey: ['client', clientId],
      queryFn: async () => {
        const response = await fetch(`/api/clients/${clientId}`);
        return response.json();
      },
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  },

  // Prefetch dashboard data on app load
  prefetchDashboard: (queryClient: QueryClient) => {
    queryClient.prefetchQuery({
      queryKey: ['dashboard', 'overview'],
      queryFn: async () => {
        const response = await fetch('/api/dashboard/overview');
        return response.json();
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  },

  // Prefetch recent notes for active clinician
  prefetchRecentNotes: (queryClient: QueryClient, clinicianId: string) => {
    queryClient.prefetchQuery({
      queryKey: ['notes', 'recent', clinicianId],
      queryFn: async () => {
        const response = await fetch(`/api/notes/recent?clinician=${clinicianId}`);
        return response.json();
      },
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  },
};

// Cache management utilities
export const cacheUtils = {
  // Invalidate all client-related queries
  invalidateClientData: (queryClient: QueryClient, clientId?: string) => {
    if (clientId) {
      queryClient.invalidateQueries({ queryKey: ['client', clientId] });
      queryClient.invalidateQueries({ queryKey: ['notes', 'client', clientId] });
      queryClient.invalidateQueries({ queryKey: ['appointments', 'client', clientId] });
    } else {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    }
  },

  // Optimistically update client data
  updateClientOptimistically: (
    queryClient: QueryClient,
    clientId: string,
    updateFn: (oldData: any) => any
  ) => {
    queryClient.setQueryData(['client', clientId], updateFn);
    queryClient.setQueryData(['clients'], (oldData: any) => {
      if (!oldData) return oldData;
      return oldData.map((client: any) =>
        client.id === clientId ? updateFn(client) : client
      );
    });
  },

  // Clear cache for memory management
  clearStaleCache: (queryClient: QueryClient) => {
    queryClient.getQueryCache().clear();
  },

  // Get cache statistics
  getCacheStats: (queryClient: QueryClient) => {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();

    return {
      totalQueries: queries.length,
      staleQueries: queries.filter(q => q.isStale()).length,
      activeQueries: queries.filter(q => q.getObserversCount() > 0).length,
      cacheSize: JSON.stringify(queries).length,
    };
  },
};

// Background sync for offline support
export const backgroundSync = {
  // Queue mutations for when connection is restored
  queueMutation: (mutationData: any) => {
    const queue = JSON.parse(localStorage.getItem('mutationQueue') || '[]');
    queue.push({
      ...mutationData,
      timestamp: Date.now(),
    });
    localStorage.setItem('mutationQueue', JSON.stringify(queue));
  },

  // Process queued mutations
  processQueue: async (queryClient: QueryClient) => {
    const queue = JSON.parse(localStorage.getItem('mutationQueue') || '[]');

    for (const mutation of queue) {
      try {
        // Process each queued mutation
        await queryClient.getMutationCache().build(queryClient, mutation.options);
      } catch (error) {
        console.warn('Failed to process queued mutation:', error);
      }
    }

    // Clear processed queue
    localStorage.setItem('mutationQueue', '[]');
  },

  // Check connection and sync
  syncWhenOnline: (queryClient: QueryClient) => {
    const handleOnline = () => {
      backgroundSync.processQueue(queryClient);
      queryClient.resumePausedMutations();
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  },
};

// Performance monitoring for queries
export const queryPerformanceMonitor = {
  // Track slow queries
  trackQueryPerformance: (queryKey: string[], duration: number) => {
    if (duration > 1000) { // Log queries over 1 second
      console.warn(`Slow query detected: ${queryKey.join('.')} took ${duration}ms`);
    }
  },

  // Monitor cache hit rates
  monitorCacheEfficiency: (queryClient: QueryClient) => {
    const stats = cacheUtils.getCacheStats(queryClient);
    const hitRate = ((stats.totalQueries - stats.staleQueries) / stats.totalQueries) * 100;

    console.log('Cache efficiency:', {
      hitRate: `${hitRate.toFixed(1)}%`,
      ...stats,
    });
  },
};
