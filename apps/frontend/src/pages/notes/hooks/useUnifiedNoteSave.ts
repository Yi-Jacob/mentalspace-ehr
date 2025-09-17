import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEnhancedErrorHandler } from '@/hooks/useEnhancedErrorHandler';
import { noteService } from '@/services/noteService';

// Generic hook for saving note data
export const useUnifiedNoteSave = <T extends Record<string, any>>(
  noteId: string | undefined,
  noteType: string,
  formData: T
) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, loading: authLoading } = useAuth();
  
  const { executeWithRetry, handleAPIError } = useEnhancedErrorHandler({
    component: 'UnifiedNoteSave',
    retryConfig: {
      maxRetries: 2,
      baseDelay: 1000,
      timeoutMs: 15000
    }
  });

  return useMutation({
    mutationFn: async ({ data, isDraft }: { data: Partial<T>; isDraft: boolean }) => {
      if (!noteId) throw new Error('No note ID');
      
      if (authLoading) {
        throw new Error('Authentication is still loading, please wait');
      }
      
      if (!user) {
        throw new Error('User not authenticated - please log in again');
      }
      
      return await executeWithRetry(async () => {
        const finalData = { ...formData, ...data };
        
        if (!isDraft) {
          // If finalizing, first save the content, then sign the note
          const updateData = {
            content: finalData,
          };
          
          await noteService.saveDraft(noteId, updateData);
          const signedNote = await noteService.signNote(noteId);
          
          return { isDraft: false, isFinalized: true, note: signedNote };
        } else {
          // Regular save (draft or content update)
          const updateData = {
            content: finalData,
          };
          
          const updatedNote = await noteService.saveDraft(noteId, updateData);
          return { isDraft, isFinalized: false, note: updatedNote };
        }
      }, 'Save Note');
    },
    onSuccess: ({ isDraft, isFinalized }) => {
      queryClient.invalidateQueries({ queryKey: ['note', noteId] });
      
      if (isDraft) {
        toast({
          title: 'Draft Saved',
          description: `Your ${noteType} has been saved as a draft.`,
        });
      } else if (isFinalized) {
        toast({
          title: 'Note Completed',
          description: `Your ${noteType} has been finalized and signed.`,
        });
      }
      
      // Navigate back to notes list
      if (!isDraft || isFinalized) {
        setTimeout(() => {
          navigate('/notes/all-notes');
        }, 2000);
      }
    },
    onError: (error) => {
      console.error('Error saving note:', error);
      handleAPIError(error, `/notes/${noteId}/save-draft`, 'PATCH');
    },
  });
};
