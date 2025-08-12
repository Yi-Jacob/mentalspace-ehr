
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEnhancedErrorHandler } from '@/hooks/useEnhancedErrorHandler';
import { noteService } from '@/services/noteService';
import { IntakeFormData } from '@/types/noteType';

export const useSaveNote = (noteId: string | undefined, formData: IntakeFormData) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, loading: authLoading } = useAuth();
  
  const { executeWithRetry, handleAPIError } = useEnhancedErrorHandler({
    component: 'SaveNote',
    retryConfig: {
      maxRetries: 2,
      baseDelay: 1000,
      timeoutMs: 15000
    }
  });

  return useMutation({
    mutationFn: async ({ data, isDraft }: { data: Partial<IntakeFormData>; isDraft: boolean }) => {
      if (!noteId) throw new Error('No note ID');
      
      // Wait for auth to finish loading
      if (authLoading) {
        throw new Error('Authentication is still loading, please wait');
      }
      
      // Debug logging
      console.log('useSaveNote - Auth loading:', authLoading);
      console.log('useSaveNote - User object:', user);
      console.log('useSaveNote - User email:', user?.email);
      
      // Validate user is authenticated
      if (!user) {
        throw new Error('User not authenticated - please log in again');
      }
      
      return await executeWithRetry(async () => {
        const finalData = { ...formData, ...data };
        
        if (finalData.isFinalized && !isDraft) {
          // If finalizing, first save the content, then sign the note
          console.log('Finalizing note - saving content first');
          
          // First save the content as draft
          const updateData = {
            content: finalData,
          };
          
          await noteService.saveDraft(noteId, updateData);
          
          // Then sign the note using the signNote method
          console.log('Signing note - backend will use JWT token for user ID');
          const signedNote = await noteService.signNote(noteId);
          
          return { isDraft: false, isFinalized: true, note: signedNote };
        } else {
          // Regular save (draft or content update)
          console.log('Saving note as draft, isDraft:', isDraft, 'data:', finalData);
          
          const updateData = {
            content: finalData,
          };
          
          const updatedNote = await noteService.saveDraft(noteId, updateData);
          
          return { isDraft, isFinalized: false, note: updatedNote };
        }
      }, 'Save Note');
    },
    onSuccess: ({ isDraft, isFinalized, note }) => {
      queryClient.invalidateQueries({ queryKey: ['note', noteId] });
      
      if (isDraft) {
        toast({
          title: 'Draft Saved',
          description: 'Your intake assessment has been saved as a draft.',
        });
      } else if (isFinalized) {
        toast({
          title: 'Assessment Completed',
          description: 'Your intake assessment has been finalized and signed.',
        });
      }
      
      // Navigate back to documentation page
      if (!isDraft || isFinalized) {
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    },
    onError: (error) => {
      console.error('Error saving note:', error);
      handleAPIError(error, `/notes/${noteId}/save-draft`, 'PATCH');
    },
  });
};
