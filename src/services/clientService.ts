
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import {
  ClientFormData,
  PhoneNumber,
  EmergencyContact,
  InsuranceInfo,
  PrimaryCareProvider,
  ClientInsert,
  PhoneInsert,
  EmergencyContactInsert,
  InsuranceInsert,
  PCPInsert
} from '@/types/client';

export const createClient = async (
  formData: ClientFormData,
  phoneNumbers: PhoneNumber[],
  emergencyContacts: EmergencyContact[],
  insuranceInfo: InsuranceInfo[],
  primaryCareProvider: PrimaryCareProvider
) => {
  // Prepare client data with proper typing
  const clientData: ClientInsert = {
    first_name: formData.first_name,
    middle_name: formData.middle_name || null,
    last_name: formData.last_name,
    suffix: formData.suffix || null,
    preferred_name: formData.preferred_name || null,
    pronouns: formData.pronouns || null,
    date_of_birth: formData.date_of_birth || null,
    assigned_clinician_id: formData.assigned_clinician_id || null,
    email: formData.email || null,
    address_1: formData.address_1 || null,
    address_2: formData.address_2 || null,
    city: formData.city || null,
    state: formData.state ? (formData.state as Database['public']['Enums']['us_state']) : null,
    zip_code: formData.zip_code || null,
    timezone: formData.timezone,
    administrative_sex: formData.administrative_sex ? (formData.administrative_sex as Database['public']['Enums']['administrative_sex']) : null,
    gender_identity: formData.gender_identity ? (formData.gender_identity as Database['public']['Enums']['gender_identity']) : null,
    sexual_orientation: formData.sexual_orientation ? (formData.sexual_orientation as Database['public']['Enums']['sexual_orientation']) : null,
    race: formData.race || null,
    ethnicity: formData.ethnicity || null,
    languages: formData.languages || null,
    marital_status: formData.marital_status ? (formData.marital_status as Database['public']['Enums']['marital_status']) : null,
    employment_status: formData.employment_status ? (formData.employment_status as Database['public']['Enums']['employment_status']) : null,
    religious_affiliation: formData.religious_affiliation || null,
    smoking_status: formData.smoking_status ? (formData.smoking_status as Database['public']['Enums']['smoking_status']) : null,
    appointment_reminders: formData.appointment_reminders,
    hipaa_signed: formData.hipaa_signed,
    pcp_release: formData.pcp_release,
    patient_comments: formData.patient_comments || null,
  };

  // Insert client
  const { data: clientResult, error: clientError } = await supabase
    .from('clients')
    .insert(clientData)
    .select()
    .single();

  if (clientError) {
    throw clientError;
  }

  // Insert phone numbers
  if (phoneNumbers.some(phone => phone.number.trim())) {
    const phoneData: PhoneInsert[] = phoneNumbers
      .filter(phone => phone.number.trim())
      .map(phone => ({
        client_id: clientResult.id,
        phone_type: phone.type,
        phone_number: phone.number,
        message_preference: phone.message_preference,
      }));

    const { error: phoneError } = await supabase
      .from('client_phone_numbers')
      .insert(phoneData);

    if (phoneError) {
      console.error('Error inserting phone numbers:', phoneError);
    }
  }

  // Insert emergency contacts
  if (emergencyContacts.some(contact => contact.name.trim())) {
    const emergencyData: EmergencyContactInsert[] = emergencyContacts
      .filter(contact => contact.name.trim())
      .map(contact => ({
        client_id: clientResult.id,
        name: contact.name,
        relationship: contact.relationship,
        phone_number: contact.phone_number,
        email: contact.email,
        is_primary: contact.is_primary,
      }));

    const { error: emergencyError } = await supabase
      .from('client_emergency_contacts')
      .insert(emergencyData);

    if (emergencyError) {
      console.error('Error inserting emergency contacts:', emergencyError);
    }
  }

  // Insert insurance information
  if (insuranceInfo.length > 0) {
    const insuranceData: InsuranceInsert[] = insuranceInfo.map(insurance => ({
      client_id: clientResult.id,
      insurance_type: insurance.insurance_type,
      insurance_company: insurance.insurance_company,
      policy_number: insurance.policy_number,
      group_number: insurance.group_number,
      subscriber_name: insurance.subscriber_name,
      subscriber_relationship: insurance.subscriber_relationship,
      subscriber_dob: insurance.subscriber_dob || null,
      effective_date: insurance.effective_date || null,
      termination_date: insurance.termination_date || null,
      copay_amount: insurance.copay_amount || null,
      deductible_amount: insurance.deductible_amount || null,
    }));

    const { error: insuranceError } = await supabase
      .from('client_insurance')
      .insert(insuranceData);

    if (insuranceError) {
      console.error('Error inserting insurance information:', insuranceError);
    }
  }

  // Insert primary care provider
  if (primaryCareProvider.provider_name.trim()) {
    const pcpData: PCPInsert = {
      client_id: clientResult.id,
      provider_name: primaryCareProvider.provider_name,
      practice_name: primaryCareProvider.practice_name,
      phone_number: primaryCareProvider.phone_number,
      address: primaryCareProvider.address,
    };

    const { error: pcpError } = await supabase
      .from('client_primary_care_providers')
      .insert(pcpData);

    if (pcpError) {
      console.error('Error inserting primary care provider:', pcpError);
    }
  }

  return clientResult;
};
