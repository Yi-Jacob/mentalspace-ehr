
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
  payerId?: string;
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
  payer?: {
    id: string;
    name: string;
    payerType: string;
  };
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
  id?: string;
  payerId?: string;
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
  clinicians?: {
    id: string;
    clientId: string;
    clinicianId: string;
    assignedAt: string;
    assignedBy?: string;
    clinician: {
      id: string;
      employeeId?: string;
      npiNumber?: string;
      licenseNumber?: string;
      licenseState?: string;
      licenseExpiryDate?: string;
      department?: string;
      jobTitle?: string;
      hireDate?: string;
      terminationDate?: string;
      phoneNumber?: string;
      emergencyContactName?: string;
      emergencyContactPhone?: string;
      supervisorId?: string;
      billingRate?: number;
      canBillInsurance?: boolean;
      status?: string;
      notes?: string;
      createdAt?: string;
      updatedAt?: string;
      address1?: string;
      address2?: string;
      canReceiveText?: boolean;
      city?: string;
      clinicianType?: string;
      formalName?: string;
      homePhone?: string;
      mobilePhone?: string;
      state?: string;
      supervisionType?: string;
      userComments?: string;
      workPhone?: string;
      zipCode?: string;
      user: {
        id: string;
        firstName: string;
        lastName: string;
        middleName?: string;
        email: string;
      };
    };
  }[];
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
