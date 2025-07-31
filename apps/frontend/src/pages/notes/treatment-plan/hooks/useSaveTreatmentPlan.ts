
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEnhancedErrorHandler } from '@/hooks/useEnhancedErrorHandler';
import { noteService } from '@/services/noteService';
import { TreatmentPlanFormData } from '../types/TreatmentPlanFormData';
import { NoteStatus } from '@/types/noteType';

export const useSaveTreatmentPlan = (noteId: string | undefined, formData: TreatmentPlanFormData) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const { executeWithRetry, handleAPIError } = useEnhancedErrorHandler({
    component: 'SaveTreatmentPlan',
    retryConfig: {
      maxRetries: 2,
      baseDelay: 1000,
      timeoutMs: 15000
    }
  });

  return useMutation({
    mutationFn: async ({ data, isDraft }: { data: Partial<TreatmentPlanFormData>; isDraft: boolean }) => {
      if (!noteId) throw new Error('No note ID');
      
      return await executeWithRetry(async () => {
        const finalData = { ...formData, ...data };
        const status: NoteStatus = isDraft ? 'draft' : finalData.isFinalized ? 'signed' : 'draft';
        
        console.log('Saving treatment plan with status:', status, 'isDraft:', isDraft, 'data:', finalData);
        
        const updateData = {
          content: finalData,
          status: status,
          ...(finalData.isFinalized && {
            signedBy: user?.id,
          }),
        };
        
        const updatedNote = await noteService.updateNote(noteId, updateData);
        
        return { isDraft, isFinalized: finalData.isFinalized, note: updatedNote };
      }, 'Save Treatment Plan');
    },
    onSuccess: ({ isDraft, isFinalized, note }) => {
      queryClient.invalidateQueries({ queryKey: ['note', noteId] });
      
      if (isDraft) {
        toast({
          title: 'Draft Saved',
          description: 'Your treatment plan has been saved as a draft.',
        });
      } else if (isFinalized) {
        toast({
          title: 'Treatment Plan Completed',
          description: 'Your treatment plan has been finalized and signed.',
        });
      }
      
      if (!isDraft || isFinalized) {
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    },
    onError: (error) => {
      console.error('Error saving treatment plan:', error);
      handleAPIError(error, `/notes/${noteId}`, 'PATCH');
    },
  });
};
