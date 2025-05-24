
import { supabase } from '@/integrations/supabase/client';
import { EmergencyContact } from '@/types/client';

export const saveEmergencyContacts = async (clientId: string, emergencyContacts: EmergencyContact[]) => {
  if (emergencyContacts.length === 0) return;

  const contactsToInsert = emergencyContacts
    .filter(contact => contact.name.trim() !== '')
    .map(contact => ({
      client_id: clientId,
      name: contact.name,
      relationship: contact.relationship || null,
      phone_number: contact.phone_number || null,
      email: contact.email || null,
      is_primary: contact.is_primary,
    }));

  if (contactsToInsert.length > 0) {
    const { error: contactError } = await supabase
      .from('client_emergency_contacts')
      .insert(contactsToInsert);

    if (contactError) {
      console.error('Error saving emergency contacts:', contactError);
    }
  }
};

export const updateEmergencyContacts = async (clientId: string, emergencyContacts: EmergencyContact[]) => {
  // Delete existing emergency contacts
  await supabase.from('client_emergency_contacts').delete().eq('client_id', clientId);
  
  // Save new emergency contacts
  await saveEmergencyContacts(clientId, emergencyContacts);
};
