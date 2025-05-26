
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface CreateNoteParams {
  clientId: string;
  noteType: string;
  user: User;
}

export const noteCreationService = {
  async createClinicalNote({ clientId, noteType, user }: CreateNoteParams) {
    console.log('=== STARTING NOTE CREATION PROCESS ===');
    console.log('User ID:', user?.id, 'Client ID:', clientId, 'Note Type:', noteType);
    
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

    console.log('User data confirmed:', userData);

    const title = noteType === 'intake' ? 'New Intake Assessment' : 
                 noteType === 'progress_note' ? 'New Progress Note' : 
                 noteType === 'treatment_plan' ? 'New Treatment Plan' :
                 `New ${noteType.replace('_', ' ')}`;

    // Ensure noteType matches the database enum values
    const validNoteType = noteType as 'intake' | 'progress_note' | 'treatment_plan' | 'cancellation_note' | 'contact_note' | 'consultation_note' | 'miscellaneous_note';

    console.log('Creating clinical note with:', {
      title,
      note_type: validNoteType,
      provider_id: userData.id,
      client_id: clientId,
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

    // Check if tracking record already exists - using a simple select first
    console.log('Checking for existing tracking record...');
    
    const { data: existingTracking } = await supabase
      .from('note_completion_tracking')
      .select('id')
      .eq('note_id', data.id)
      .eq('user_id', userData.id)
      .maybeSingle();

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
    
    console.log('=== NOTE CREATION PROCESS COMPLETED SUCCESSFULLY ===');
    return data;
  }
};
