
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useNoteData = (noteId: string | undefined) => {
  return useQuery({
    queryKey: ['clinical-note', noteId],
    queryFn: async () => {
      if (!noteId) return null;
      
      console.log('Fetching note with ID:', noteId);
      
      // First fetch the note
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
      
      // If note has a client_id, fetch the client data with related information
      if (noteData.client_id) {
        // Fetch client basic data
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('*')
          .eq('id', noteData.client_id)
          .single();
        
        if (clientError) {
          console.error('Error fetching client:', clientError);
          // Don't throw error for client fetch failure, just proceed without client data
        }

        let enhancedClientData = null;

        if (clientData) {
          // Fetch phone numbers
          const { data: phoneData } = await supabase
            .from('client_phone_numbers')
            .select('*')
            .eq('client_id', noteData.client_id);

          // Fetch insurance data
          const { data: insuranceData } = await supabase
            .from('client_insurance')
            .select('*')
            .eq('client_id', noteData.client_id)
            .eq('is_active', true);

          // Fetch prior diagnoses
          const { data: diagnosesData } = await supabase
            .from('client_diagnoses')
            .select('diagnosis_code, diagnosis_description, is_primary, diagnosed_date, status')
            .eq('client_id', noteData.client_id)
            .eq('status', 'active')
            .order('diagnosed_date', { ascending: false });

          enhancedClientData = {
            ...clientData,
            phone_numbers: phoneData || [],
            insurance_info: insuranceData || [],
            prior_diagnoses: diagnosesData?.map(d => `${d.diagnosis_code} - ${d.diagnosis_description}`) || []
          };
        }
        
        return {
          ...noteData,
          clients: enhancedClientData
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
