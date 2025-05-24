
import { supabase } from '@/integrations/supabase/client';
import { ClientFormData, PhoneNumber, EmergencyContact, InsuranceInfo, PrimaryCareProvider } from '@/types/client';

export const createClient = async (
  formData: ClientFormData,
  phoneNumbers: PhoneNumber[],
  emergencyContacts: EmergencyContact[],
  insuranceInfo: InsuranceInfo[],
  primaryCareProvider: PrimaryCareProvider
) => {
  const { data: clientData, error: clientError } = await supabase
    .from('clients')
    .insert({
      first_name: formData.first_name,
      middle_name: formData.middle_name || null,
      last_name: formData.last_name,
      suffix: formData.suffix || null,
      preferred_name: formData.preferred_name || null,
      pronouns: formData.pronouns || null,
      date_of_birth: formData.date_of_birth || null,
      assigned_clinician_id: formData.assigned_clinician_id === 'unassigned' ? null : formData.assigned_clinician_id,
      email: formData.email || null,
      address_1: formData.address_1 || null,
      address_2: formData.address_2 || null,
      city: formData.city || null,
      state: formData.state as any,
      zip_code: formData.zip_code || null,
      timezone: formData.timezone as any,
      administrative_sex: formData.administrative_sex as any,
      gender_identity: formData.gender_identity as any,
      sexual_orientation: formData.sexual_orientation as any,
      race: formData.race || null,
      ethnicity: formData.ethnicity || null,
      languages: formData.languages || null,
      marital_status: formData.marital_status as any,
      employment_status: formData.employment_status as any,
      religious_affiliation: formData.religious_affiliation || null,
      smoking_status: formData.smoking_status as any,
      appointment_reminders: formData.appointment_reminders as any,
      hipaa_signed: formData.hipaa_signed,
      pcp_release: formData.pcp_release as any,
      patient_comments: formData.patient_comments || null,
    })
    .select()
    .single();

  if (clientError) {
    throw new Error(`Failed to create client: ${clientError.message}`);
  }

  console.log('Client created successfully:', clientData);

  // Save phone numbers
  if (phoneNumbers.length > 0) {
    const phoneNumbersToInsert = phoneNumbers
      .filter(phone => phone.number.trim() !== '')
      .map(phone => ({
        client_id: clientData.id,
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
  }

  // Save emergency contacts
  if (emergencyContacts.length > 0) {
    const contactsToInsert = emergencyContacts
      .filter(contact => contact.name.trim() !== '')
      .map(contact => ({
        client_id: clientData.id,
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
  }

  // Save insurance information
  if (insuranceInfo.length > 0) {
    const insuranceToInsert = insuranceInfo
      .filter(insurance => insurance.insurance_company.trim() !== '')
      .map(insurance => ({
        client_id: clientData.id,
        insurance_type: insurance.insurance_type,
        insurance_company: insurance.insurance_company,
        policy_number: insurance.policy_number || null,
        group_number: insurance.group_number || null,
        subscriber_name: insurance.subscriber_name || null,
        subscriber_relationship: insurance.subscriber_relationship || null,
        subscriber_dob: insurance.subscriber_dob || null,
        effective_date: insurance.effective_date || null,
        termination_date: insurance.termination_date || null,
        copay_amount: insurance.copay_amount || null,
        deductible_amount: insurance.deductible_amount || null,
      }));

    if (insuranceToInsert.length > 0) {
      const { error: insuranceError } = await supabase
        .from('client_insurance')
        .insert(insuranceToInsert);

      if (insuranceError) {
        console.error('Error saving insurance information:', insuranceError);
      }
    }
  }

  // Save primary care provider
  if (primaryCareProvider.provider_name.trim() !== '') {
    const { error: pcpError } = await supabase
      .from('client_primary_care_providers')
      .insert({
        client_id: clientData.id,
        provider_name: primaryCareProvider.provider_name,
        practice_name: primaryCareProvider.practice_name || null,
        phone_number: primaryCareProvider.phone_number || null,
        address: primaryCareProvider.address || null,
      });

    if (pcpError) {
      console.error('Error saving primary care provider:', pcpError);
    }
  }

  return clientData;
};

export const updateClient = async (
  clientId: string,
  formData: ClientFormData,
  phoneNumbers: PhoneNumber[],
  emergencyContacts: EmergencyContact[],
  insuranceInfo: InsuranceInfo[],
  primaryCareProvider: PrimaryCareProvider
) => {
  const { data: clientData, error: clientError } = await supabase
    .from('clients')
    .update({
      first_name: formData.first_name,
      middle_name: formData.middle_name || null,
      last_name: formData.last_name,
      suffix: formData.suffix || null,
      preferred_name: formData.preferred_name || null,
      pronouns: formData.pronouns || null,
      date_of_birth: formData.date_of_birth || null,
      assigned_clinician_id: formData.assigned_clinician_id === 'unassigned' ? null : formData.assigned_clinician_id,
      email: formData.email || null,
      address_1: formData.address_1 || null,
      address_2: formData.address_2 || null,
      city: formData.city || null,
      state: formData.state as any,
      zip_code: formData.zip_code || null,
      timezone: formData.timezone as any,
      administrative_sex: formData.administrative_sex as any,
      gender_identity: formData.gender_identity as any,
      sexual_orientation: formData.sexual_orientation as any,
      race: formData.race || null,
      ethnicity: formData.ethnicity || null,
      languages: formData.languages || null,
      marital_status: formData.marital_status as any,
      employment_status: formData.employment_status as any,
      religious_affiliation: formData.religious_affiliation || null,
      smoking_status: formData.smoking_status as any,
      appointment_reminders: formData.appointment_reminders as any,
      hipaa_signed: formData.hipaa_signed,
      pcp_release: formData.pcp_release as any,
      patient_comments: formData.patient_comments || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', clientId)
    .select()
    .single();

  if (clientError) {
    throw new Error(`Failed to update client: ${clientError.message}`);
  }

  console.log('Client updated successfully:', clientData);

  // Delete existing related records and insert new ones
  await Promise.all([
    supabase.from('client_phone_numbers').delete().eq('client_id', clientId),
    supabase.from('client_emergency_contacts').delete().eq('client_id', clientId),
    supabase.from('client_insurance').delete().eq('client_id', clientId),
    supabase.from('client_primary_care_providers').delete().eq('client_id', clientId),
  ]);

  // Save phone numbers
  if (phoneNumbers.length > 0) {
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
        console.error('Error updating phone numbers:', phoneError);
      }
    }
  }

  // Save emergency contacts
  if (emergencyContacts.length > 0) {
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
        console.error('Error updating emergency contacts:', contactError);
      }
    }
  }

  // Save insurance information
  if (insuranceInfo.length > 0) {
    const insuranceToInsert = insuranceInfo
      .filter(insurance => insurance.insurance_company.trim() !== '')
      .map(insurance => ({
        client_id: clientId,
        insurance_type: insurance.insurance_type,
        insurance_company: insurance.insurance_company,
        policy_number: insurance.policy_number || null,
        group_number: insurance.group_number || null,
        subscriber_name: insurance.subscriber_name || null,
        subscriber_relationship: insurance.subscriber_relationship || null,
        subscriber_dob: insurance.subscriber_dob || null,
        effective_date: insurance.effective_date || null,
        termination_date: insurance.termination_date || null,
        copay_amount: insurance.copay_amount || null,
        deductible_amount: insurance.deductible_amount || null,
      }));

    if (insuranceToInsert.length > 0) {
      const { error: insuranceError } = await supabase
        .from('client_insurance')
        .insert(insuranceToInsert);

      if (insuranceError) {
        console.error('Error updating insurance information:', insuranceError);
      }
    }
  }

  // Save primary care provider
  if (primaryCareProvider.provider_name.trim() !== '') {
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
      console.error('Error updating primary care provider:', pcpError);
    }
  }

  return clientData;
};
