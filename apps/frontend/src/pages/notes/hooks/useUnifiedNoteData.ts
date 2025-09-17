import { useQuery } from '@tanstack/react-query';
import { noteService } from '@/services/noteService';

// Generic hook for fetching note data
export const useUnifiedNoteData = (noteId: string | undefined) => {
  return useQuery({
    queryKey: ['note', noteId],
    queryFn: async () => {
      if (!noteId) return null;
      return await noteService.getNote(noteId);
    },
    enabled: !!noteId,
  });
};
