
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClientFormData, PhoneNumber, EmergencyContact, InsuranceInfo, PrimaryCareProvider } from '@/types/client';
import { ClientInfoTab } from './tabs/ClientInfoTab';
import { ClientBillingTab } from './tabs/ClientBillingTab';
import { ClientBillingSettingsTab } from './tabs/ClientBillingSettingsTab';
import { ClientCliniciansTab } from './tabs/ClientCliniciansTab';
import { ClientNotesTab } from './tabs/ClientNotesTab';
import { PlaceholderTab } from './tabs/PlaceholderTab';

interface ClientDetailTabsProps {
  client: ClientFormData;
  phoneNumbers: PhoneNumber[];
  emergencyContacts: EmergencyContact[];
  insuranceInfo: InsuranceInfo[];
  primaryCareProvider: PrimaryCareProvider | null;
}

export const ClientDetailTabs: React.FC<ClientDetailTabsProps> = ({
  client,
  phoneNumbers,
  emergencyContacts,
  insuranceInfo,
  primaryCareProvider
}) => {
  return (
    <Tabs defaultValue="info" className="space-y-6">
      <TabsList className="grid w-full grid-cols-9">
        <TabsTrigger value="info">Info</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
        <TabsTrigger value="schedule">Schedule</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
        <TabsTrigger value="billing-settings">Billing Settings</TabsTrigger>
        <TabsTrigger value="clinicians">Clinicians</TabsTrigger>
        <TabsTrigger value="portal">Portal</TabsTrigger>
        <TabsTrigger value="messages">Messages</TabsTrigger>
        <TabsTrigger value="insights">Insights</TabsTrigger>
      </TabsList>

      <TabsContent value="info">
        <ClientInfoTab
          client={client}
          phoneNumbers={phoneNumbers}
          emergencyContacts={emergencyContacts}
          primaryCareProvider={primaryCareProvider}
        />
      </TabsContent>

      <TabsContent value="notes">
        <ClientNotesTab client={client} />
      </TabsContent>

      <TabsContent value="schedule">
        <PlaceholderTab
          title="Appointment Schedule"
          message="No appointments found. This feature will be implemented in a future update."
        />
      </TabsContent>

      <TabsContent value="billing">
        <ClientBillingTab insuranceInfo={insuranceInfo} />
      </TabsContent>

      <TabsContent value="billing-settings">
        <ClientBillingSettingsTab insuranceInfo={insuranceInfo} />
      </TabsContent>

      <TabsContent value="clinicians">
        <ClientCliniciansTab client={client} />
      </TabsContent>

      <TabsContent value="portal">
        <PlaceholderTab
          title="Client Portal"
          message="Portal management features will be implemented in a future update."
        />
      </TabsContent>

      <TabsContent value="messages">
        <PlaceholderTab
          title="Messages"
          message="No messages found. This feature will be implemented in a future update."
        />
      </TabsContent>

      <TabsContent value="insights">
        <PlaceholderTab
          title="Client Insights"
          message="Insights and analytics will be implemented in a future update."
        />
      </TabsContent>
    </Tabs>
  );
};
