
import { useQuery } from '@tanstack/react-query';
import { CPT_CODES, CptCodeOption } from '@/types/enums/notesEnum';

export const useCptCodes = () => {
  return useQuery({
    queryKey: ['cpt-codes'],
    queryFn: async (): Promise<CptCodeOption[]> => {
      // Return static CPT codes from enum
      return CPT_CODES;
    },
    staleTime: Infinity, // Never refetch since this is static data
    gcTime: Infinity, // Keep in cache indefinitely
  });
};
