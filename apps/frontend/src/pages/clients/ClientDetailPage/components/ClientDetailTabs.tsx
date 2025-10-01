
import React from 'react';
import { User, MessageSquare, Users, FileText, CreditCard, Calendar, FolderOpen } from 'lucide-react';
import PageTabs from '@/components/basic/PageTabs';
import { ClientInfoTab } from './tabs/ClientInfoTab';
import { ClientCliniciansTab } from './tabs/ClientCliniciansTab';
import { ClientNotesTab } from './tabs/ClientNotesTab';
import { ClientBillingTab } from './tabs/ClientBillingTab';
import ClientMessagesTab from './tabs/ClientMessagesTab';
import ClientAppointmentTab from './tabs/ClientAppointmentTab';
import ClientPortalTab from './tabs/ClientPortalTab';
import { ClientFormData, PhoneNumber, EmergencyContact, InsuranceInfo, PrimaryCareProvider } from '@/types/clientType';

interface ClientDetailTabsProps {
  client: ClientFormData;
  phoneNumbers: PhoneNumber[];
  emergencyContacts: EmergencyContact[];
  insuranceInfo: InsuranceInfo[];
  primaryCareProvider: PrimaryCareProvider | null;
  onDataChange?: () => void;
}

const ClientDetailTabs: React.FC<ClientDetailTabsProps> = ({
  client,
  phoneNumbers,
  emergencyContacts,
  insuranceInfo,
  primaryCareProvider,
  onDataChange
}) => {
  const tabItems = [
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
      id: 'appointments',
      label: 'Appointments',
      icon: Calendar,
      content: <ClientAppointmentTab clientId={client.id} clientName={`${client.firstName} ${client.lastName}`} />
    },
    {
      id: 'clinicians',
      label: 'Clinicians',
      icon: Users,
      content: <ClientCliniciansTab client={client} onDataChange={onDataChange} />
    },
    {
      id: 'notes',
      label: 'Notes',
      icon: FileText,
      content: <ClientNotesTab client={client} />
    },
    {
      id: 'portal',
      label: 'Portal',
      icon: FolderOpen,
      content: <ClientPortalTab clientId={client.id} clientName={`${client.firstName} ${client.lastName}`} />
    },
    {
      id: 'billing',
      label: 'Billing',
      icon: CreditCard,
      content: <ClientBillingTab insuranceInfo={insuranceInfo} />
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      content: <ClientMessagesTab clientId={client.id} />
    }
  ];

  return (
    <PageTabs
      defaultValue="info"
      items={tabItems}
    />
  );
};

export default ClientDetailTabs;
