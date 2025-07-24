
import { useQuery } from '@tanstack/react-query';
import { noteService } from '@/services/noteService';
import { QueryNotesParams } from '@/types/note';

export const useNotesQuery = (params?: QueryNotesParams) => {
  return useQuery({
    queryKey: ['notes', params],
    queryFn: () => noteService.getNotes(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
