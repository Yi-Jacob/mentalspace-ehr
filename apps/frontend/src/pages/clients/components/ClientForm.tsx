import React, { useState } from 'react';
import PageTabs from '@/components/basic/PageTabs';
import { BasicInfoTab } from './client-form/BasicInfoTab';
import { ClinicianAssignmentTab } from './client-form/ClinicianAssignmentTab';
import { ContactInfoTab } from './client-form/ContactInfoTab';
import { DemographicsTab } from './client-form/DemographicsTab';
import { BillingTab } from './client-form/BillingTab';
import { SettingsTab } from './client-form/SettingsTab';
import { ClientFormData, PhoneNumber, EmergencyContact, InsuranceInfo, PrimaryCareProvider } from '@/types/clientType';

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
  onDataChange?: () => void;
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
  onDataChange,
}) => {
  const [currentTab, setCurrentTab] = useState('basic');
  
  const tabOrder = ['basic', 'clinicians', 'contact', 'demographics', 'billing', 'settings'];
  
  const handleNext = () => {
    const currentIndex = tabOrder.indexOf(currentTab);
    if (currentIndex < tabOrder.length - 1) {
      const nextTab = tabOrder[currentIndex + 1];
      setCurrentTab(nextTab);
    }
  };
  
  const handlePrevious = () => {
    const currentIndex = tabOrder.indexOf(currentTab);
    if (currentIndex > 0) {
      const previousTab = tabOrder[currentIndex - 1];
      setCurrentTab(previousTab);
    }
  };
  
  const canGoNext = tabOrder.indexOf(currentTab) < tabOrder.length - 1;
  const canGoPrevious = tabOrder.indexOf(currentTab) > 0;
  return (
    <PageTabs
      defaultValue="basic"
      value={currentTab}
      onValueChange={setCurrentTab}
      showNavigation={true}
      onNext={handleNext}
      onPrevious={handlePrevious}
      canGoNext={canGoNext}
      canGoPrevious={canGoPrevious}
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
          id: 'clinicians',
          label: 'Clinicians',
          content: (
            <div className="space-y-4">
              <ClinicianAssignmentTab formData={formData} onDataChange={onDataChange} />
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
                clientDob={formData.dateOfBirth}
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