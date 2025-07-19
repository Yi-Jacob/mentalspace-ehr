
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shared/ui/tabs';
import { 
  User, 
  Users, 
  FileText, 
  CreditCard, 
  Settings,
  MessageSquare
} from 'lucide-react';
import { ClientInfoTab } from './tabs/ClientInfoTab';
import { ClientCliniciansTab } from './tabs/ClientCliniciansTab';
import { ClientNotesTab } from './tabs/ClientNotesTab';
import { ClientBillingTab } from './tabs/ClientBillingTab';
import { ClientBillingSettingsTab } from './tabs/ClientBillingSettingsTab';
import ClientMessagesTab from './tabs/ClientMessagesTab';
import { PhoneNumber, EmergencyContact, InsuranceInfo, PrimaryCareProvider } from '@/types/client';

interface ClientDetailTabsProps {
  client: any;
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
    <Tabs defaultValue="info" className="w-full">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="info" className="flex items-center space-x-2">
          <User className="h-4 w-4" />
          <span>Info</span>
        </TabsTrigger>
        <TabsTrigger value="messages" className="flex items-center space-x-2">
          <MessageSquare className="h-4 w-4" />
          <span>Messages</span>
        </TabsTrigger>
        <TabsTrigger value="clinicians" className="flex items-center space-x-2">
          <Users className="h-4 w-4" />
          <span>Clinicians</span>
        </TabsTrigger>
        <TabsTrigger value="notes" className="flex items-center space-x-2">
          <FileText className="h-4 w-4" />
          <span>Notes</span>
        </TabsTrigger>
        <TabsTrigger value="billing" className="flex items-center space-x-2">
          <CreditCard className="h-4 w-4" />
          <span>Billing</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex items-center space-x-2">
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="info" className="mt-6">
        <ClientInfoTab 
          client={client} 
          phoneNumbers={phoneNumbers}
          emergencyContacts={emergencyContacts}
          primaryCareProvider={primaryCareProvider}
        />
      </TabsContent>

      <TabsContent value="messages" className="mt-6">
        <ClientMessagesTab clientId={client.id} />
      </TabsContent>

      <TabsContent value="clinicians" className="mt-6">
        <ClientCliniciansTab client={client} />
      </TabsContent>

      <TabsContent value="notes" className="mt-6">
        <ClientNotesTab client={client} />
      </TabsContent>

      <TabsContent value="billing" className="mt-6">
        <ClientBillingTab insuranceInfo={insuranceInfo} />
      </TabsContent>

      <TabsContent value="settings" className="mt-6">
        <ClientBillingSettingsTab insuranceInfo={insuranceInfo} />
      </TabsContent>
    </Tabs>
  );
};

export default ClientDetailTabs;
