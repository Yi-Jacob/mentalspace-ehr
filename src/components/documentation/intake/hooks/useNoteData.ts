
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useNoteData = (noteId: string | undefined) => {
  return useQuery({
    queryKey: ['clinical-note', noteId],
    queryFn: async () => {
      if (!noteId) return null;
      
      console.log('Fetching note with ID:', noteId);
      
      // First fetch the note without joining clients
      const { data: noteData, error: noteError } = await supabase
        .from('clinical_notes')
        .select('*')
        .eq('id', noteId)
        .single();
      
      if (noteError) {
        console.error('Error fetching note:', noteError);
        throw noteError;
      }
      
      console.log('Note data:', noteData);
      
      // If note has a client_id, fetch the client data separately
      if (noteData.client_id) {
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('id, first_name, last_name, date_of_birth')
          .eq('id', noteData.client_id)
          .single();
        
        if (clientError) {
          console.error('Error fetching client:', clientError);
          // Don't throw error for client fetch failure, just proceed without client data
        }
        
        return {
          ...noteData,
          clients: clientData
        };
      }
      
      // Return note without client data if no client is linked
      return {
        ...noteData,
        clients: null
      };
    },
    enabled: !!noteId,
  });
};
