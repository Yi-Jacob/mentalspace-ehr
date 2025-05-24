
import { supabase } from '@/integrations/supabase/client';
import { PhoneNumber } from '@/types/client';

export const savePhoneNumbers = async (clientId: string, phoneNumbers: PhoneNumber[]) => {
  if (phoneNumbers.length === 0) return;

  const phoneNumbersToInsert = phoneNumbers
    .filter(phone => phone.number.trim() !== '')
    .map(phone => ({
      client_id: clientId,
      phone_type: phone.type as any,
      phone_number: phone.number,
      message_preference: phone.message_preference as any,
    }));

  if (phoneNumbersToInsert.length > 0) {
    const { error: phoneError } = await supabase
      .from('client_phone_numbers')
      .insert(phoneNumbersToInsert);

    if (phoneError) {
      console.error('Error saving phone numbers:', phoneError);
    }
  }
};

export const updatePhoneNumbers = async (clientId: string, phoneNumbers: PhoneNumber[]) => {
  // Delete existing phone numbers
  await supabase.from('client_phone_numbers').delete().eq('client_id', clientId);
  
  // Save new phone numbers
  await savePhoneNumbers(clientId, phoneNumbers);
};
