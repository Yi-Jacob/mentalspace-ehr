
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
  return clientData;
};
