
import { useState, useCallback } from 'react';
import { ClientFormData, PhoneNumber, EmergencyContact, InsuranceInfo, PrimaryCareProvider } from '@/types/client';

export const useClientForm = () => {
  const [formData, setFormData] = useState<ClientFormData>({
    // Basic Info
    first_name: '',
    middle_name: '',
    last_name: '',
    suffix: '',
    preferred_name: '',
    pronouns: '',
    date_of_birth: '',
    assigned_clinician_id: 'unassigned',
    // Contact Info
    email: '',
    address_1: '',
    address_2: '',
    city: '',
    state: '',
    zip_code: '',
    timezone: 'Not Set',
    // Demographics
    administrative_sex: '',
    gender_identity: '',
    sexual_orientation: '',
    race: '',
    ethnicity: '',
    languages: '',
    marital_status: '',
    employment_status: '',
    religious_affiliation: '',
    smoking_status: '',
    // Settings
    appointment_reminders: 'Default Practice Setting',
    hipaa_signed: false,
    pcp_release: 'Not set',
    patient_comments: '',
    // Status
    is_active: true,
  });

  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([
    { type: 'Mobile', number: '', message_preference: 'No messages' }
  ]);

  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    { name: '', relationship: '', phone_number: '', email: '', is_primary: true }
  ]);

  const [insuranceInfo, setInsuranceInfo] = useState<InsuranceInfo[]>([]);

  const [primaryCareProvider, setPrimaryCareProvider] = useState<PrimaryCareProvider>({
    provider_name: '',
    practice_name: '',
    phone_number: '',
    address: ''
  });

  const resetForm = useCallback(() => {
    setFormData({
      first_name: '',
      middle_name: '',
      last_name: '',
      suffix: '',
      preferred_name: '',
      pronouns: '',
      date_of_birth: '',
      assigned_clinician_id: 'unassigned',
      email: '',
      address_1: '',
      address_2: '',
      city: '',
      state: '',
      zip_code: '',
      timezone: 'Not Set',
      administrative_sex: '',
      gender_identity: '',
      sexual_orientation: '',
      race: '',
      ethnicity: '',
      languages: '',
      marital_status: '',
      employment_status: '',
      religious_affiliation: '',
      smoking_status: '',
      appointment_reminders: 'Default Practice Setting',
      hipaa_signed: false,
      pcp_release: 'Not set',
      patient_comments: '',
      is_active: true,
    });
    setPhoneNumbers([{ type: 'Mobile', number: '', message_preference: 'No messages' }]);
    setEmergencyContacts([{ name: '', relationship: '', phone_number: '', email: '', is_primary: true }]);
    setInsuranceInfo([]);
    setPrimaryCareProvider({
      provider_name: '',
      practice_name: '',
      phone_number: '',
      address: ''
    });
  }, []);

  return {
    formData,
    setFormData,
    phoneNumbers,
    setPhoneNumbers,
    emergencyContacts,
    setEmergencyContacts,
    insuranceInfo,
    setInsuranceInfo,
    primaryCareProvider,
    setPrimaryCareProvider,
    resetForm,
  };
};
