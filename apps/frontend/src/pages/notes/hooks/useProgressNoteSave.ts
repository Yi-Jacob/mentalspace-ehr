
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEnhancedErrorHandler } from '@/hooks/useEnhancedErrorHandler';
import { noteService } from '@/services/noteService';
import { ProgressNoteFormData } from '@/types/noteType';
import { NoteStatus } from '@/types/noteType';

export const useSaveProgressNote = (noteId: string | undefined, formData: ProgressNoteFormData) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const { executeWithRetry, handleAPIError } = useEnhancedErrorHandler({
    component: 'SaveProgressNote',
    retryConfig: {
      maxRetries: 2,
      baseDelay: 1000,
      timeoutMs: 15000
    }
  });

  return useMutation({
    mutationFn: async ({ data, isDraft }: { data: Partial<ProgressNoteFormData>; isDraft: boolean }) => {
      if (!noteId) throw new Error('No note ID');
      
      return await executeWithRetry(async () => {
        const finalData = { ...formData, ...data };
        const status: NoteStatus = isDraft ? 'draft' :'signed';
        
        console.log('Saving progress note with status:', status, 'isDraft:', isDraft, 'data:', finalData);
        
        const updateData = {
          content: finalData,
          status: status,
          ...(finalData.isFinalized && {
            signedBy: user?.id,
          }),
        };
        
        const updatedNote = await noteService.updateNote(noteId, updateData);
        
        return { isDraft, isFinalized: finalData.isFinalized, note: updatedNote };
      }, 'Save Progress Note');
    },
    onSuccess: ({ isDraft, isFinalized, note }) => {
      queryClient.invalidateQueries({ queryKey: ['note', noteId] });
      
      if (isDraft) {
        toast({
          title: 'Draft Saved',
          description: 'Your progress note has been saved as a draft.',
        });
      } else if (isFinalized) {
        toast({
          title: 'Progress Note Completed',
          description: 'Your progress note has been finalized and signed.',
        });
      }
      
      // Navigate back to notes page
      if (!isDraft || isFinalized) {
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    },
    onError: (error) => {
      console.error('Error saving progress note:', error);
      handleAPIError(error, `/notes/${noteId}`, 'PATCH');
    },
  });
};
