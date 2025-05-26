
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useEnhancedErrorHandler } from '@/hooks/useEnhancedErrorHandler';
import { noteCreationService } from '@/services/noteCreationService';

export const useNoteCreation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { 
    handleAPIError, 
    executeWithRetry 
  } = useEnhancedErrorHandler({
    component: 'Documentation',
    retryConfig: {
      maxRetries: 2,
      baseDelay: 1500,
      timeoutMs: 20000
    }
  });

  const createNoteMutation = useMutation({
    mutationFn: async ({ clientId, noteType }: { clientId: string; noteType: string }) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      return await executeWithRetry(async () => {
        return await noteCreationService.createClinicalNote({
          clientId,
          noteType,
          user
        });
      }, `Create ${noteType}`);
    },
    onSuccess: (data) => {
      console.log('=== MUTATION SUCCESS - STARTING NAVIGATION ===');
      console.log('Created note:', data);
      console.log('Note type for navigation:', data.note_type);
      
      // Navigate based on note type with detailed logging
      let targetRoute = '';
      if (data.note_type === 'progress_note') {
        targetRoute = `/documentation/progress-note/${data.id}/edit`;
      } else if (data.note_type === 'treatment_plan') {
        targetRoute = `/documentation/treatment-plan/${data.id}/edit`;
      } else if (data.note_type === 'cancellation_note') {
        targetRoute = `/documentation/cancellation-note/${data.id}/edit`;
      } else if (data.note_type === 'contact_note') {
        targetRoute = `/documentation/contact-note/${data.id}/edit`;
      } else if (data.note_type === 'consultation_note') {
        targetRoute = `/documentation/consultation-note/${data.id}/edit`;
      } else if (data.note_type === 'miscellaneous_note') {
        targetRoute = `/documentation/miscellaneous-note/${data.id}/edit`;
      } else {
        targetRoute = `/documentation/note/${data.id}/edit`;
      }
      
      console.log('Navigating to:', targetRoute);
      navigate(targetRoute);
      console.log('=== NAVIGATION COMPLETED ===');
    },
    onError: (error) => {
      console.error('=== MUTATION ERROR ===');
      console.error('Full error object:', error);
      console.error('Error message:', error.message);
      handleAPIError(error, '/clinical-notes', 'POST');
    },
  });

  return {
    createNoteMutation,
  };
};
