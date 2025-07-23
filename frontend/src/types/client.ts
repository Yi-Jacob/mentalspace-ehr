
import { Database } from '@/integrations/supabase/types';

export type ClientInsert = Database['public']['Tables']['clients']['Insert'];
export type PhoneInsert = Database['public']['Tables']['client_phone_numbers']['Insert'];
export type EmergencyContactInsert = Database['public']['Tables']['client_emergency_contacts']['Insert'];
export type InsuranceInsert = Database['public']['Tables']['client_insurance']['Insert'];
export type PCPInsert = Database['public']['Tables']['client_primary_care_providers']['Insert'];

// API Response Types (from backend)
export interface PhoneNumberDto {
  id?: string;
  clientId: string;
  phoneType: 'Mobile' | 'Home' | 'Work' | 'Other';
  phoneNumber: string;
  messagePreference: 'No messages' | 'Voice messages OK' | 'Text messages OK' | 'Voice/Text messages OK';
  createdAt?: string;
}

export interface EmergencyContactDto {
  id?: string;
  clientId: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
  isPrimary: boolean;
  createdAt?: string;
}

export interface InsuranceInfoDto {
  id?: string;
  clientId: string;
  insuranceType: 'Primary' | 'Secondary';
  insuranceCompany: string;
  policyNumber: string;
  groupNumber?: string;
  subscriberName: string;
  subscriberRelationship: string;
  subscriberDob?: string;
  effectiveDate?: string;
  terminationDate?: string;
  copayAmount: number;
  deductibleAmount: number;
  createdAt?: string;
}

export interface PrimaryCareProviderDto {
  id?: string;
  clientId: string;
  providerName: string;
  practiceName: string;
  phoneNumber: string;
  address: string;
  createdAt?: string;
}

// Frontend Form Types
export interface PhoneNumber {
  type: 'Mobile' | 'Home' | 'Work' | 'Other';
  number: string;
  messagePreference: 'No messages' | 'Voice messages OK' | 'Text messages OK' | 'Voice/Text messages OK';
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
  email: string;
  isPrimary: boolean;
}

export interface InsuranceInfo {
  insuranceType: 'Primary' | 'Secondary';
  insuranceCompany: string;
  policyNumber: string;
  groupNumber: string;
  subscriberName: string;
  subscriberRelationship: string;
  subscriberDob: string;
  effectiveDate: string;
  terminationDate: string;
  copayAmount: number;
  deductibleAmount: number;
}

export interface PrimaryCareProvider {
  providerName: string;
  practiceName: string;
  phoneNumber: string;
  address: string;
}

export interface ClientFormData {
  id?: string; // Add optional id property for editing
  // Basic Info
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  preferredName: string;
  pronouns: string;
  dateOfBirth: string;
  assignedClinicianId: string;
  // Contact Info
  email: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  timezone: 'Not Set' | 'HAST' | 'HAT' | 'MART' | 'AKT' | 'GAMT' | 'PT' | 'PST' | 'MT' | 'ART' | 'CT' | 'CST' | 'ET' | 'EST' | 'AT' | 'AST' | 'NT' | 'EGT/EGST' | 'CVT';
  // Demographics
  administrativeSex: string;
  genderIdentity: string;
  sexualOrientation: string;
  race: string;
  ethnicity: string;
  languages: string;
  maritalStatus: string;
  employmentStatus: string;
  religiousAffiliation: string;
  smokingStatus: string;
  // Settings
  appointmentReminders: 'Default Practice Setting' | 'No reminders' | 'Email only' | 'Text (SMS) only' | 'Text (SMS) and Email' | 'Text or Call, and Email';
  hipaaSigned: boolean;
  pcpRelease: 'Not set' | 'Patient consented to release information' | 'Patient declined to release information' | 'Not applicable';
  patientComments: string;
  // Status
  isActive: boolean;
}
