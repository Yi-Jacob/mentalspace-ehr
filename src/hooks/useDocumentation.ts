
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useEnhancedErrorHandler } from '@/hooks/useEnhancedErrorHandler';

export const useDocumentation = () => {
  const [activeTab, setActiveTab] = useState('all-notes');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedNoteType, setSelectedNoteType] = useState<string | null>(null);
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
      return await executeWithRetry(async () => {
        console.log('Creating note for user:', user?.id, 'client:', clientId, 'type:', noteType);
        
        // First, try to get the user's ID from the users table
        let { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, first_name, last_name')
          .eq('auth_user_id', user?.id)
          .single();

        // If user doesn't exist, create the profile
        if (userError && userError.code === 'PGRST116') {
          console.log('User profile not found, creating one...');
          const { data: newUserData, error: createUserError } = await supabase
            .from('users')
            .insert([{
              auth_user_id: user?.id,
              email: user?.email || '',
              first_name: user?.user_metadata?.first_name || 'User',
              last_name: user?.user_metadata?.last_name || '',
            }])
            .select()
            .single();

          if (createUserError) {
            console.error('Error creating user profile:', createUserError);
            throw new Error('Could not create user profile');
          }
          
          userData = newUserData;
        } else if (userError) {
          console.error('Error fetching user:', userError);
          throw new Error('Could not find user profile');
        }

        console.log('User data found/created:', userData);

        const title = noteType === 'intake' ? 'New Intake Assessment' : 
                     noteType === 'progress_note' ? 'New Progress Note' : 
                     `New ${noteType.replace('_', ' ')}`;

        // Ensure noteType matches the database enum values
        const validNoteType = noteType as 'intake' | 'progress_note' | 'treatment_plan' | 'cancellation_note' | 'contact_note' | 'consultation_note' | 'miscellaneous_note';

        const { data, error } = await supabase
          .from('clinical_notes')
          .insert({
            title,
            note_type: validNoteType,
            provider_id: userData.id,
            client_id: clientId,
            content: {},
            status: 'draft',
          })
          .select()
          .single();
        
        if (error) {
          console.error('Error creating clinical note:', error);
          throw error;
        }

        // Create note completion tracking record
        await supabase
          .from('note_completion_tracking')
          .insert({
            note_id: data.id,
            user_id: userData.id,
            completion_percentage: 0,
          });
        
        console.log('Created clinical note:', data);
        return data;
      }, `Create ${noteType}`);
    },
    onSuccess: (data) => {
      console.log('Note created successfully, navigating to edit view');
      if (data.note_type === 'progress_note') {
        navigate(`/documentation/progress-note/${data.id}/edit`);
      } else {
        navigate(`/documentation/note/${data.id}/edit`);
      }
    },
    onError: (error) => {
      console.error('Full error object:', error);
      handleAPIError(error, '/clinical-notes', 'POST');
    },
  });

  const handleCreateNote = (noteType: string) => {
    try {
      // Always show the modal to select a client, regardless of note type
      setSelectedNoteType(noteType);
      setShowCreateModal(true);
    } catch (error) {
      console.error('Error in handleCreateNote:', error);
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setSelectedNoteType(null);
  };

  return {
    activeTab,
    setActiveTab,
    showCreateModal,
    selectedNoteType,
    createNoteMutation,
    handleCreateNote,
    handleCloseModal,
  };
};
