
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
        console.log('Starting note creation for user:', user?.id, 'client:', clientId, 'type:', noteType);
        
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
                     noteType === 'treatment_plan' ? 'New Treatment Plan' :
                     `New ${noteType.replace('_', ' ')}`;

        // Ensure noteType matches the database enum values
        const validNoteType = noteType as 'intake' | 'progress_note' | 'treatment_plan' | 'cancellation_note' | 'contact_note' | 'consultation_note' | 'miscellaneous_note';

        console.log('Creating clinical note with data:', {
          title,
          note_type: validNoteType,
          provider_id: userData.id,
          client_id: clientId,
          content: {},
          status: 'draft',
        });

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

        console.log('Clinical note created successfully:', data);

        // Check if tracking record already exists
        console.log('Checking if note completion tracking already exists for note:', data.id, 'user:', userData.id);
        
        const { data: existingTracking } = await supabase
          .from('note_completion_tracking')
          .select('id')
          .eq('note_id', data.id)
          .eq('user_id', userData.id)
          .single();

        // Only create tracking record if it doesn't exist
        if (!existingTracking) {
          console.log('Creating new note completion tracking record');
          const { error: trackingError } = await supabase
            .from('note_completion_tracking')
            .insert({
              note_id: data.id,
              user_id: userData.id,
              completion_percentage: 0,
            });
          
          if (trackingError) {
            console.error('Error creating note completion tracking:', trackingError);
            // Don't throw error for tracking failure, just log it
          } else {
            console.log('Note completion tracking created successfully');
          }
        } else {
          console.log('Note completion tracking already exists, skipping creation');
        }
        
        console.log('Note creation process completed successfully');
        return data;
      }, `Create ${noteType}`);
    },
    onSuccess: (data) => {
      console.log('=== MUTATION SUCCESS ===');
      console.log('Note created successfully, preparing navigation for note type:', data.note_type);
      console.log('Note data:', data);
      
      // Close the modal first
      setShowCreateModal(false);
      setSelectedNoteType(null);
      
      // Navigate based on note type with detailed logging
      if (data.note_type === 'progress_note') {
        const route = `/documentation/progress-note/${data.id}/edit`;
        console.log('Navigating to progress note edit route:', route);
        navigate(route);
      } else if (data.note_type === 'treatment_plan') {
        const route = `/documentation/treatment-plan/${data.id}/edit`;
        console.log('Navigating to treatment plan edit route:', route);
        navigate(route);
      } else {
        const route = `/documentation/note/${data.id}/edit`;
        console.log('Navigating to general note edit route:', route);
        navigate(route);
      }
      
      console.log('=== NAVIGATION COMPLETED ===');
    },
    onError: (error) => {
      console.error('=== MUTATION ERROR ===');
      console.error('Full error object:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      handleAPIError(error, '/clinical-notes', 'POST');
    },
  });

  const handleCreateNote = (noteType: string) => {
    try {
      console.log('=== STARTING NOTE CREATION ===');
      console.log('Note type requested:', noteType);
      // Always show the modal to select a client, regardless of note type
      setSelectedNoteType(noteType);
      setShowCreateModal(true);
      console.log('Modal should be open now for note type:', noteType);
    } catch (error) {
      console.error('Error in handleCreateNote:', error);
    }
  };

  const handleCloseModal = () => {
    console.log('Closing modal');
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
