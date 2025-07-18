
import { supabase } from '@/integrations/supabase/client';
import { ClientFormData } from '@/types/client';
import { transformClientDataForDatabase } from './clientDataTransforms';

export const createClientRecord = async (formData: ClientFormData) => {
  const transformedData = transformClientDataForDatabase(formData);
  
  const { data: clientData, error: clientError } = await supabase
    .from('clients')
    .insert(transformedData)
    .select()
    .single();

  if (clientError) {
    console.error('Error creating client:', clientError);
    throw new Error(`Failed to create client: ${clientError.message}`);
  }

  console.log('Client created successfully:', clientData);
  return clientData;
};

export const updateClientRecord = async (clientId: string, formData: ClientFormData) => {
  const transformedData = transformClientDataForDatabase(formData);
  
  const { data: clientData, error: clientError } = await supabase
    .from('clients')
    .update({
      ...transformedData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', clientId)
    .select()
    .single();

  if (clientError) {
    console.error('Error updating client:', clientError);
    throw new Error(`Failed to update client: ${clientError.message}`);
  }

  console.log('Client updated successfully:', clientData);
  return clientData;
};
