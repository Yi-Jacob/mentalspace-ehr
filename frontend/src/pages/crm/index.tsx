
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus } from 'lucide-react';
import PageLayout from '@/components/ui/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import ReferralManagement from '@/pages/crm/components/ReferralManagement';
import LeadManagement from '@/pages/crm/components/LeadManagement';
import ContactDatabase from '@/pages/crm/components/ContactDatabase';
import CampaignManagement from '@/pages/crm/components/CampaignManagement';
import CRMDashboard from '@/pages/crm/components/CRMDashboard';

const CRM = () => {
  return (
    <PageLayout variant="simple">
      <PageHeader
        icon={UserPlus}
        title="Customer Relationship Management"
        description="Manage referrals, leads, and practice growth opportunities"
      />

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
    </PageLayout>
  );
};

export default CRM;
