
import { useQuery } from '@tanstack/react-query';
import { noteService } from '@/services/noteService';

export const useNoteData = (noteId: string | undefined) => {
  return useQuery({
    queryKey: ['note', noteId],
    queryFn: async () => {
      if (!noteId) return null;
      
      console.log('Fetching note with ID:', noteId);
      
      const noteData = await noteService.getNote(noteId);
      
      console.log('Note data:', noteData);
      
      return noteData;
    },
    enabled: !!noteId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
