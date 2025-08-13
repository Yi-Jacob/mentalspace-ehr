
import { useQuery } from '@tanstack/react-query';
import { noteService } from '@/services/noteService';

export const useContactNoteData = (noteId?: string) => {
  return useQuery({
    queryKey: ['note', noteId],
    queryFn: async () => {
      if (!noteId) return null;
      
      const noteData = await noteService.getNote(noteId);
      return noteData;
    },
    enabled: !!noteId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
