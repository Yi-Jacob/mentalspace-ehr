import React from 'react';
import PageTabs from '@/components/ui/PageTabs';
import { BasicInfoTab } from './client-form/BasicInfoTab';
import { ContactInfoTab } from './client-form/ContactInfoTab';
import { DemographicsTab } from './client-form/DemographicsTab';
import { BillingTab } from './client-form/BillingTab';
import { SettingsTab } from './client-form/SettingsTab';
import { ClientFormData, PhoneNumber, EmergencyContact, InsuranceInfo, PrimaryCareProvider } from '@/types/client';

interface ClientFormProps {
  formData: ClientFormData;
  setFormData: (data: ClientFormData) => void;
  phoneNumbers: PhoneNumber[];
  setPhoneNumbers: (numbers: PhoneNumber[]) => void;
  emergencyContacts: EmergencyContact[];
  setEmergencyContacts: (contacts: EmergencyContact[]) => void;
  insuranceInfo: InsuranceInfo[];
  setInsuranceInfo: (info: InsuranceInfo[]) => void;
  primaryCareProvider: PrimaryCareProvider | null;
  setPrimaryCareProvider: (provider: PrimaryCareProvider | null) => void;
}

const ClientForm: React.FC<ClientFormProps> = ({
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
}) => {
  return (
    <PageTabs
      defaultValue="basic"
      items={[
        {
          id: 'basic',
          label: 'Basic Info',
          content: (
            <div className="space-y-4">
              <BasicInfoTab formData={formData} setFormData={setFormData} />
            </div>
          )
        },
        {
          id: 'contact',
          label: 'Contact',
          content: (
            <div className="space-y-4">
              <ContactInfoTab
                formData={formData}
                setFormData={setFormData}
                phoneNumbers={phoneNumbers}
                setPhoneNumbers={setPhoneNumbers}
                emergencyContacts={emergencyContacts}
                setEmergencyContacts={setEmergencyContacts}
                primaryCareProvider={primaryCareProvider}
                setPrimaryCareProvider={setPrimaryCareProvider}
              />
            </div>
          )
        },
        {
          id: 'demographics',
          label: 'Demographics',
          content: (
            <div className="space-y-4">
              <DemographicsTab formData={formData} setFormData={setFormData} />
            </div>
          )
        },
        {
          id: 'billing',
          label: 'Billing',
          content: (
            <div className="space-y-4">
              <BillingTab
                insuranceInfo={insuranceInfo}
                setInsuranceInfo={setInsuranceInfo}
              />
            </div>
          )
        },
        {
          id: 'settings',
          label: 'Settings',
          content: (
            <div className="space-y-4">
              <SettingsTab formData={formData} setFormData={setFormData} />
            </div>
          )
        }
      ]}
    />
  );
};

export default ClientForm; 