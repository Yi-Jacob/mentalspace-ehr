
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shared/ui/tabs';
import { Settings as SettingsIcon, User, Calendar, FileText, CreditCard } from 'lucide-react';
import AccountAccessSettings from '@/components/settings/AccountAccessSettings';
import PortalSchedulingSettings from '@/components/settings/PortalSchedulingSettings';
import DocumentationSettings from '@/components/settings/DocumentationSettings';
import BillingSettings from '@/components/settings/BillingSettings';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center space-x-3">
          <SettingsIcon className="h-8 w-8" />
          <span>Practice Settings</span>
        </h1>
        <p className="text-gray-600 mt-2">
          Configure your practice preferences, security settings, and system features
        </p>
      </div>

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
    </div>
  );
};

export default Settings;
