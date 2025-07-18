
import { ClientFormData, PhoneNumber, EmergencyContact, InsuranceInfo, PrimaryCareProvider } from '@/types/client';
import { createClientRecord, updateClientRecord } from './client/clientCoreService';
import { savePhoneNumbers, updatePhoneNumbers } from './client/phoneNumbersService';
import { saveEmergencyContacts, updateEmergencyContacts } from './client/emergencyContactsService';
import { saveInsuranceInfo, updateInsuranceInfo } from './client/insuranceService';
import { savePrimaryCareProvider, updatePrimaryCareProvider } from './client/primaryCareProviderService';

export const createClient = async (
  formData: ClientFormData,
  phoneNumbers: PhoneNumber[],
  emergencyContacts: EmergencyContact[],
  insuranceInfo: InsuranceInfo[],
  primaryCareProvider: PrimaryCareProvider
) => {
  const clientData = await createClientRecord(formData);

  // Save all related data
  await Promise.all([
    savePhoneNumbers(clientData.id, phoneNumbers),
    saveEmergencyContacts(clientData.id, emergencyContacts),
    saveInsuranceInfo(clientData.id, insuranceInfo),
    savePrimaryCareProvider(clientData.id, primaryCareProvider),
  ]);

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
  const clientData = await updateClientRecord(clientId, formData);

  // Update all related data
  await Promise.all([
    updatePhoneNumbers(clientId, phoneNumbers),
    updateEmergencyContacts(clientId, emergencyContacts),
    updateInsuranceInfo(clientId, insuranceInfo),
    updatePrimaryCareProvider(clientId, primaryCareProvider),
  ]);

  return clientData;
};
