
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export const useOptimizedQuery = <T = unknown, E = unknown>(
  queryKey: (string | number)[],
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T, E>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey,
    queryFn,
    ...options,
  });
};
