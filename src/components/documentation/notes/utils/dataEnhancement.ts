
import { supabase } from '@/integrations/supabase/client';

interface ClinicalNote {
  id: string;
  title: string;
  note_type: string;
  status: string;
  created_at: string;
  updated_at: string;
  client_id: string;
  provider_id?: string;
  clients?: {
    first_name: string;
    last_name: string;
  };
  provider?: {
    first_name: string;
    last_name: string;
  };
}

export const enhanceNotesWithClientAndProviderData = async (notes: any[]): Promise<ClinicalNote[]> => {
  console.log('Enhancing notes with client and provider data...');
  
  const enhancedNotes = await Promise.all(
    notes.map(async (note: any) => {
      let clientInfo = null;
      let providerInfo = null;
      
      // Fetch client information with better error handling
      if (note.client_id) {
        try {
          console.log(`Fetching client info for note ${note.id}, client_id: ${note.client_id}`);
          const { data: clientData, error: clientError } = await supabase
            .from('clients')
            .select('first_name, last_name')
            .eq('id', note.client_id)
            .maybeSingle();
          
          if (clientError) {
            console.warn(`⚠️ Client fetch error for note ${note.id}:`, clientError);
          } else if (clientData) {
            clientInfo = clientData;
            console.log(`✅ Client data fetched for note ${note.id}`);
          } else {
            console.log(`ℹ️ No client found for note ${note.id}, client_id: ${note.client_id}`);
          }
        } catch (clientError) {
          console.warn(`⚠️ Client fetch exception for note ${note.id}:`, clientError);
        }
      }
      
      // Fetch provider information with better error handling
      if (note.provider_id) {
        try {
          console.log(`Fetching provider info for note ${note.id}, provider_id: ${note.provider_id}`);
          const { data: providerData, error: providerError } = await supabase
            .from('users')
            .select('first_name, last_name')
            .eq('id', note.provider_id)
            .maybeSingle();
          
          if (providerError) {
            console.warn(`⚠️ Provider fetch error for note ${note.id}:`, providerError);
          } else if (providerData) {
            providerInfo = providerData;
            console.log(`✅ Provider data fetched for note ${note.id}`);
          } else {
            console.log(`ℹ️ No provider found for note ${note.id}, provider_id: ${note.provider_id}`);
          }
        } catch (providerError) {
          console.warn(`⚠️ Provider fetch exception for note ${note.id}:`, providerError);
        }
      }
      
      return {
        ...note,
        clients: clientInfo,
        provider: providerInfo
      };
    })
  );
  
  return enhancedNotes;
};
