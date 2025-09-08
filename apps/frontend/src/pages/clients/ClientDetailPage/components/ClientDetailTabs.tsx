
import React from 'react';
import { User, MessageSquare, Users, FileText, CreditCard, Settings } from 'lucide-react';
import PageTabs from '@/components/basic/PageTabs';
import { ClientInfoTab } from './tabs/ClientInfoTab';
import { ClientCliniciansTab } from './tabs/ClientCliniciansTab';
import { ClientNotesTab } from './tabs/ClientNotesTab';
import { ClientBillingTab } from './tabs/ClientBillingTab';
import { ClientFormData, PhoneNumber, EmergencyContact, InsuranceInfo, PrimaryCareProvider } from '@/types/clientType';

interface ClientDetailTabsProps {
  client: ClientFormData;
  phoneNumbers: PhoneNumber[];
  emergencyContacts: EmergencyContact[];
  insuranceInfo: InsuranceInfo[];
  primaryCareProvider: PrimaryCareProvider | null;
}

const ClientDetailTabs: React.FC<ClientDetailTabsProps> = ({
  client,
  phoneNumbers,
  emergencyContacts,
  insuranceInfo,
  primaryCareProvider
}) => {
  return (
    <PageTabs
      defaultValue="info"
      items={[
        {
          id: 'info',
          label: 'Info',
          icon: User,
          content: (
            <ClientInfoTab 
              client={client} 
              phoneNumbers={phoneNumbers}
              emergencyContacts={emergencyContacts}
              primaryCareProvider={primaryCareProvider}
            />
          )
        },
        {
          id: 'clinicians',
          label: 'Clinicians',
          icon: Users,
          content: <ClientCliniciansTab client={client} />
        },
        {
          id: 'notes',
          label: 'Notes',
          icon: FileText,
          content: <ClientNotesTab client={client} />
        },
        {
          id: 'billing',
          label: 'Billing',
          icon: CreditCard,
          content: <ClientBillingTab insuranceInfo={insuranceInfo} />
        }
      ]}
    />
  );
};

export default ClientDetailTabs;
