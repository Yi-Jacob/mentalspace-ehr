
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, User, Calendar, FileText, CreditCard } from 'lucide-react';
import PageLayout from '@/components/ui/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import AccountAccessSettings from '@/pages/settings/components/AccountAccessSettings';
import PortalSchedulingSettings from '@/pages/settings/components/PortalSchedulingSettings';
import DocumentationSettings from '@/pages/settings/components/DocumentationSettings';
import BillingSettings from '@/pages/settings/components/BillingSettings';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');

  return (
    <PageLayout variant="simple">
      <PageHeader
        icon={SettingsIcon}
        title="Practice Settings"
        description="Configure your practice preferences, security settings, and system features"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="account" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Account & Access</span>
          </TabsTrigger>
          <TabsTrigger value="portal" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Portal & Scheduling</span>
          </TabsTrigger>
          <TabsTrigger value="documentation" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Documentation/Notes</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Billing</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="mt-6">
          <AccountAccessSettings />
        </TabsContent>

        <TabsContent value="portal" className="mt-6">
          <PortalSchedulingSettings />
        </TabsContent>

        <TabsContent value="documentation" className="mt-6">
          <DocumentationSettings />
        </TabsContent>

        <TabsContent value="billing" className="mt-6">
          <BillingSettings />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default Settings;
