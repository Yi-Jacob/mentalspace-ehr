
import { PhoneType, MessagePreference, InsuranceType, SubscriberRelationship, AdministrativeSex, GenderIdentity, SexualOrientation, Race, Ethnicity, Language, MaritalStatus, EmploymentStatus, ReligiousAffiliation, SmokingStatus, AppointmentReminders, PcpRelease, UsState, Timezone } from './enums/clientEnum';

// API Response Types (from backend)
export interface PhoneNumberDto {
  id?: string;
  clientId: string;
  phoneType: PhoneType;
  phoneNumber: string;
  messagePreference: MessagePreference;
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
  insuranceType: InsuranceType;
  insuranceCompany: string;
  policyNumber: string;
  groupNumber?: string;
  subscriberName: string;
  subscriberRelationship: SubscriberRelationship;
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
  type: PhoneType;
  number: string;
  messagePreference: MessagePreference;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
  email: string;
  isPrimary: boolean;
}

export interface InsuranceInfo {
  insuranceType: InsuranceType;
  insuranceCompany: string;
  policyNumber: string;
  groupNumber: string;
  subscriberName: string;
  subscriberRelationship: SubscriberRelationship;
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
  state: UsState;
  zipCode: string;
  timezone: Timezone;
  // Demographics
  administrativeSex: AdministrativeSex;
  genderIdentity: GenderIdentity;
  sexualOrientation: SexualOrientation;
  race: Race;
  ethnicity: Ethnicity;
  languages: Language;
  maritalStatus: MaritalStatus;
  employmentStatus: EmploymentStatus;
  religiousAffiliation: ReligiousAffiliation;
  smokingStatus: SmokingStatus;
  // Settings
  appointmentReminders: AppointmentReminders;
  hipaaSigned: boolean;
  pcpRelease: PcpRelease;
  patientComments: string;
  // Status
  isActive: boolean;
}
