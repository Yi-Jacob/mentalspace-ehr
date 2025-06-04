
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReferralManagement from '@/components/crm/ReferralManagement';
import LeadManagement from '@/components/crm/LeadManagement';
import ContactDatabase from '@/components/crm/ContactDatabase';
import CampaignManagement from '@/components/crm/CampaignManagement';
import CRMDashboard from '@/components/crm/CRMDashboard';

const CRM = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Relationship Management</h1>
          <p className="text-gray-600 mt-2">Manage referrals, leads, and practice growth opportunities</p>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <CRMDashboard />
        </TabsContent>

        <TabsContent value="referrals" className="space-y-6">
          <ReferralManagement />
        </TabsContent>

        <TabsContent value="leads" className="space-y-6">
          <LeadManagement />
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6">
          <ContactDatabase />
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <CampaignManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CRM;
