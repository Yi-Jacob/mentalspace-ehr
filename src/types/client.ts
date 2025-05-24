
import { Database } from '@/integrations/supabase/types';

export type ClientInsert = Database['public']['Tables']['clients']['Insert'];
export type PhoneInsert = Database['public']['Tables']['client_phone_numbers']['Insert'];
export type EmergencyContactInsert = Database['public']['Tables']['client_emergency_contacts']['Insert'];
export type InsuranceInsert = Database['public']['Tables']['client_insurance']['Insert'];
export type PCPInsert = Database['public']['Tables']['client_primary_care_providers']['Insert'];

export interface PhoneNumber {
  type: 'Mobile' | 'Home' | 'Work' | 'Other';
  number: string;
  message_preference: 'No messages' | 'Voice messages OK' | 'Text messages OK' | 'Voice/Text messages OK';
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone_number: string;
  email: string;
  is_primary: boolean;
}

export interface InsuranceInfo {
  insurance_type: 'Primary' | 'Secondary';
  insurance_company: string;
  policy_number: string;
  group_number: string;
  subscriber_name: string;
  subscriber_relationship: string;
  subscriber_dob: string;
  effective_date: string;
  termination_date: string;
  copay_amount: number;
  deductible_amount: number;
}

export interface PrimaryCareProvider {
  provider_name: string;
  practice_name: string;
  phone_number: string;
  address: string;
}

export interface ClientFormData {
  // Basic Info
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
  preferred_name: string;
  pronouns: string;
  date_of_birth: string;
  assigned_clinician_id: string;
  // Contact Info
  email: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  zip_code: string;
  timezone: 'Not Set' | 'HAST' | 'HAT' | 'MART' | 'AKT' | 'GAMT' | 'PT' | 'PST' | 'MT' | 'ART' | 'CT' | 'CST' | 'ET' | 'EST' | 'AT' | 'AST' | 'NT' | 'EGT/EGST' | 'CVT';
  // Demographics
  administrative_sex: string;
  gender_identity: string;
  sexual_orientation: string;
  race: string;
  ethnicity: string;
  languages: string;
  marital_status: string;
  employment_status: string;
  religious_affiliation: string;
  smoking_status: string;
  // Settings
  appointment_reminders: 'Default Practice Setting' | 'No reminders' | 'Email only' | 'Text (SMS) only' | 'Text (SMS) and Email' | 'Text or Call, and Email';
  hipaa_signed: boolean;
  pcp_release: 'Not set' | 'Patient consented to release information' | 'Patient declined to release information' | 'Not applicable';
  patient_comments: string;
}
