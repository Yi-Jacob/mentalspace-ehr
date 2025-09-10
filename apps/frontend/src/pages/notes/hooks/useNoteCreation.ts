
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useEnhancedErrorHandler } from '@/hooks/useEnhancedErrorHandler';
import { noteService } from '@/services/noteService';
import { NoteType } from '@/types/noteType';

export const useNoteCreation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { 
    handleAPIError, 
    executeWithRetry 
  } = useEnhancedErrorHandler({
    component: 'Notes',
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
        return await noteService.createNote({
          title: `New ${noteType.replace('_', ' ')}`,
          content: {},
          clientId: clientId,
          noteType: noteType as NoteType,
          status: 'draft'
        });
      }, `Create ${noteType}`);
    },
    onSuccess: (data) => {
      console.log('=== MUTATION SUCCESS - STARTING NAVIGATION ===');
      console.log('Created note:', data);
      console.log('Note type for navigation:', data.noteType);
      
      // Navigate based on note type with detailed logging
      let targetRoute = '';
      if (data.noteType === 'intake') {
        targetRoute = `/notes/intake/${data.id}/edit`;
      } else if (data.noteType === 'progress_note') {
        targetRoute = `/notes/progress-note/${data.id}/edit`;
      } else if (data.noteType === 'treatment_plan') {
        targetRoute = `/notes/treatment-plan/${data.id}/edit`;
      } else if (data.noteType === 'cancellation_note') {
        targetRoute = `/notes/cancellation-note/${data.id}/edit`;
      } else if (data.noteType === 'contact_note') {
        targetRoute = `/notes/contact-note/${data.id}/edit`;
      } else if (data.noteType === 'consultation_note') {
        targetRoute = `/notes/consultation-note/${data.id}/edit`;
      } else if (data.noteType === 'miscellaneous_note') {
        targetRoute = `/notes/miscellaneous-note/${data.id}/edit`;
      } else {
        targetRoute = `/notes/note/${data.id}/edit`;
      }
      
      console.log('Navigating to:', targetRoute);
      navigate(targetRoute);
      console.log('=== NAVIGATION COMPLETED ===');
    },
    onError: (error) => {
      console.error('=== MUTATION ERROR ===');
      console.error('Full error object:', error);
      console.error('Error message:', error.message);
      handleAPIError(error, '/notes', 'POST');
    },
  });

  return {
    createNoteMutation,
  };
};
