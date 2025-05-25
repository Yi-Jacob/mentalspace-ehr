
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEnhancedErrorHandler } from '@/hooks/useEnhancedErrorHandler';
import { IntakeFormData } from '../types/IntakeFormData';

export const useSaveNote = (noteId: string | undefined, formData: IntakeFormData) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
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
      
      return await executeWithRetry(async () => {
        const finalData = { ...formData, ...data };
        const status = isDraft ? 'draft' : finalData.isFinalized ? 'signed' : 'draft';
        
        console.log('Saving note with status:', status, 'isDraft:', isDraft, 'data:', finalData);
        
        const { error } = await supabase
          .from('clinical_notes')
          .update({
            content: finalData,
            status: status,
            updated_at: new Date().toISOString(),
            ...(finalData.isFinalized && {
              signed_by: user?.id,
              signed_at: new Date().toISOString(),
            }),
          })
          .eq('id', noteId);
        
        if (error) throw error;
        return { isDraft, isFinalized: finalData.isFinalized };
      }, 'Save Note');
    },
    onSuccess: ({ isDraft, isFinalized }) => {
      queryClient.invalidateQueries({ queryKey: ['clinical-note', noteId] });
      
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
      handleAPIError(error, `/clinical-notes/${noteId}`, 'PATCH');
    },
  });
};
