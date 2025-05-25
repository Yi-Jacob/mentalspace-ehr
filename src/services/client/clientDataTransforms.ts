import { ClientFormData } from '@/types/client';

export const transformClientDataForDatabase = (formData: ClientFormData) => {
  // Keep date of birth as-is if it's in YYYY-MM-DD format from our form
  const dateOfBirth = formData.date_of_birth ? formData.date_of_birth : null;
  
  console.log('Transforming date for database:', dateOfBirth);
  
  // Helper function to convert empty strings to null for enum fields
  const nullifyEmptyString = (value: string) => value === '' ? null : value;
  
  return {
    first_name: formData.first_name,
    middle_name: formData.middle_name || null,
    last_name: formData.last_name,
    suffix: formData.suffix || null,
    preferred_name: formData.preferred_name || null,
    pronouns: formData.pronouns || null,
    date_of_birth: dateOfBirth,
    assigned_clinician_id: formData.assigned_clinician_id === 'unassigned' ? null : formData.assigned_clinician_id,
    email: formData.email || null,
    address_1: formData.address_1 || null,
    address_2: formData.address_2 || null,
    city: formData.city || null,
    state: nullifyEmptyString(formData.state) as any,
    zip_code: formData.zip_code || null,
    timezone: formData.timezone as any,
    administrative_sex: nullifyEmptyString(formData.administrative_sex) as any,
    gender_identity: nullifyEmptyString(formData.gender_identity) as any,
    sexual_orientation: nullifyEmptyString(formData.sexual_orientation) as any,
    race: formData.race || null,
    ethnicity: formData.ethnicity || null,
    languages: formData.languages || null,
    marital_status: nullifyEmptyString(formData.marital_status) as any,
    employment_status: nullifyEmptyString(formData.employment_status) as any,
    religious_affiliation: formData.religious_affiliation || null,
    smoking_status: nullifyEmptyString(formData.smoking_status) as any,
    appointment_reminders: formData.appointment_reminders as any,
    hipaa_signed: formData.hipaa_signed,
    pcp_release: formData.pcp_release as any,
    patient_comments: formData.patient_comments || null,
  };
};
