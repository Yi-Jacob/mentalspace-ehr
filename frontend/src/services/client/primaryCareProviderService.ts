
import { supabase } from '@/integrations/supabase/client';
import { PrimaryCareProvider } from '@/types/client';

export const savePrimaryCareProvider = async (clientId: string, primaryCareProvider: PrimaryCareProvider) => {
  if (primaryCareProvider.provider_name.trim() === '') return;

  const { error: pcpError } = await supabase
    .from('client_primary_care_providers')
    .insert({
      client_id: clientId,
      provider_name: primaryCareProvider.provider_name,
      practice_name: primaryCareProvider.practice_name || null,
      phone_number: primaryCareProvider.phone_number || null,
      address: primaryCareProvider.address || null,
    });

  if (pcpError) {
    console.error('Error saving primary care provider:', pcpError);
  }
};

export const updatePrimaryCareProvider = async (clientId: string, primaryCareProvider: PrimaryCareProvider) => {
  // Delete existing primary care provider
  await supabase.from('client_primary_care_providers').delete().eq('client_id', clientId);
  
  // Save new primary care provider
  await savePrimaryCareProvider(clientId, primaryCareProvider);
};
