
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useOptimizedQuery } from '@/hooks/useOptimizedQuery';

export const useNoteData = (noteId: string | undefined) => {
  return useOptimizedQuery(
    ['clinical-note', noteId],
    async () => {
      if (!noteId) return null;
      
      console.log('Fetching note with ID:', noteId);
      
      // Optimized query - only fetch required fields
      const { data: noteData, error: noteError } = await supabase
        .from('clinical_notes')
        .select(`
          id,
          title,
          note_type,
          content,
          status,
          client_id,
          provider_id,
          created_at,
          updated_at,
          signed_at,
          signed_by
        `)
        .eq('id', noteId)
        .single();
      
      if (noteError) {
        console.error('Error fetching note:', noteError);
        throw noteError;
      }
      
      console.log('Note data:', noteData);
      
      // If note has a client_id, fetch the client data with related information
      if (noteData.client_id) {
        // Optimized client data query - only essential fields
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select(`
            id,
            first_name,
            last_name,
            preferred_name,
            date_of_birth,
            email,
            city,
            state
          `)
          .eq('id', noteData.client_id)
          .single();
        
        if (clientError) {
          console.error('Error fetching client:', clientError);
          // Don't throw error for client fetch failure, just proceed without client data
        }

        let enhancedClientData = null;

        if (clientData) {
          // Fetch related data in parallel for better performance
          const [phoneData, insuranceData, diagnosesData] = await Promise.all([
            supabase
              .from('client_phone_numbers')
              .select('phone_type, phone_number, message_preference')
              .eq('client_id', noteData.client_id),
            
            supabase
              .from('client_insurance')
              .select('insurance_type, insurance_company, policy_number')
              .eq('client_id', noteData.client_id)
              .eq('is_active', true),
            
            supabase
              .from('client_diagnoses')
              .select('diagnosis_code, diagnosis_description, is_primary, diagnosed_date')
              .eq('client_id', noteData.client_id)
              .eq('status', 'active')
              .order('diagnosed_date', { ascending: false })
              .limit(10) // Limit to most recent 10 diagnoses
          ]);

          enhancedClientData = {
            ...clientData,
            phone_numbers: phoneData.data || [],
            insurance_info: insuranceData.data || [],
            prior_diagnoses: diagnosesData.data?.map(d => `${d.diagnosis_code} - ${d.diagnosis_description}`) || []
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
    {
      enabled: !!noteId,
      staleTime: 30 * 1000, // 30 seconds - notes change frequently
      gcTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};
