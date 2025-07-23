
import { useState, useCallback } from 'react';
import { ClientFormData, PhoneNumber, EmergencyContact, InsuranceInfo, PrimaryCareProvider } from '@/types/client';

export const useClientForm = () => {
  const [formData, setFormData] = useState<ClientFormData>({
    // Basic Info
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    preferredName: '',
    pronouns: '',
    dateOfBirth: '',
    assignedClinicianId: 'unassigned',
    // Contact Info
    email: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    timezone: 'Not Set',
    // Demographics
    administrativeSex: '',
    genderIdentity: '',
    sexualOrientation: '',
    race: '',
    ethnicity: '',
    languages: '',
    maritalStatus: '',
    employmentStatus: '',
    religiousAffiliation: '',
    smokingStatus: '',
    // Settings
    appointmentReminders: 'Default Practice Setting',
    hipaaSigned: false,
    pcpRelease: 'Not set',
    patientComments: '',
    // Status
    isActive: true,
  });

  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([
    { type: 'Mobile', number: '', messagePreference: 'No messages' }
  ]);

  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    { name: '', relationship: '', phoneNumber: '', email: '', isPrimary: true }
  ]);

  const [insuranceInfo, setInsuranceInfo] = useState<InsuranceInfo[]>([]);

  const [primaryCareProvider, setPrimaryCareProvider] = useState<PrimaryCareProvider>({
    providerName: '',
    practiceName: '',
    phoneNumber: '',
    address: ''
  });

  const resetForm = useCallback(() => {
    setFormData({
      firstName: '',
      middleName: '',
      lastName: '',
      suffix: '',
      preferredName: '',
      pronouns: '',
      dateOfBirth: '',
      assignedClinicianId: 'unassigned',
      email: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zipCode: '',
      timezone: 'Not Set',
      administrativeSex: '',
      genderIdentity: '',
      sexualOrientation: '',
      race: '',
      ethnicity: '',
      languages: '',
      maritalStatus: '',
      employmentStatus: '',
      religiousAffiliation: '',
      smokingStatus: '',
      appointmentReminders: 'Default Practice Setting',
      hipaaSigned: false,
      pcpRelease: 'Not set',
      patientComments: '',
      isActive: true,
    });
    setPhoneNumbers([{ type: 'Mobile', number: '', messagePreference: 'No messages' }]);
    setEmergencyContacts([{ name: '', relationship: '', phoneNumber: '', email: '', isPrimary: true }]);
    setInsuranceInfo([]);
    setPrimaryCareProvider({
      providerName: '',
      practiceName: '',
      phoneNumber: '',
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
