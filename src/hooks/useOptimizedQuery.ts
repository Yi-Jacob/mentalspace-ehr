
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useCallback } from 'react';

interface OptimizedQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  cacheTime?: number;
  staleTime?: number;
  refetchOnWindowFocus?: boolean;
}

export const useOptimizedQuery = <T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options: OptimizedQueryOptions<T> = {}
) => {
  const {
    cacheTime = 5 * 60 * 1000, // 5 minutes
    staleTime = 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus = false,
    ...restOptions
  } = options;

  return useQuery({
    queryKey,
    queryFn,
    gcTime: cacheTime,
    staleTime,
    refetchOnWindowFocus,
    ...restOptions,
  });
};

export const useInvalidateQueries = () => {
  const { queryClient } = useQuery({
    queryKey: ['dummy'],
    queryFn: () => null,
    enabled: false,
  });

  const invalidateQueries = useCallback((queryKey: string[]) => {
    queryClient?.invalidateQueries({ queryKey });
  }, [queryClient]);

  const removeQueries = useCallback((queryKey: string[]) => {
    queryClient?.removeQueries({ queryKey });
  }, [queryClient]);

  return { invalidateQueries, removeQueries };
};
