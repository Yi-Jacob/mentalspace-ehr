
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
      // Use the unified edit route for all note types
      const targetRoute = `/notes/edit/${data.id}`;
      
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
