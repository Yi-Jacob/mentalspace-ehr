
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useErrorHandler } from '@/hooks/useErrorHandler';

export const useDocumentation = () => {
  const [activeTab, setActiveTab] = useState('all-notes');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedNoteType, setSelectedNoteType] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { handleAPIError } = useErrorHandler({
    component: 'Documentation',
  });

  const createIntakeAssessmentMutation = useMutation({
    mutationFn: async () => {
      console.log('Creating intake assessment for user:', user?.id);
      
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

      const { data, error } = await supabase
        .from('clinical_notes')
        .insert([{
          title: 'New Intake Assessment',
          note_type: 'intake',
          provider_id: userData.id,
          content: {},
          status: 'draft',
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating clinical note:', error);
        throw error;
      }
      
      console.log('Created clinical note:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Intake assessment created successfully, navigating to:', `/documentation/note/${data.id}/edit`);
      navigate(`/documentation/note/${data.id}/edit`);
    },
    onError: (error) => {
      console.error('Full error object:', error);
      handleAPIError(error, '/clinical-notes', 'POST');
    },
  });

  const handleCreateNote = (noteType: string) => {
    try {
      if (noteType === 'intake') {
        createIntakeAssessmentMutation.mutate();
      } else {
        setSelectedNoteType(noteType);
        setShowCreateModal(true);
      }
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
    createIntakeAssessmentMutation,
    handleCreateNote,
    handleCloseModal,
  };
};
