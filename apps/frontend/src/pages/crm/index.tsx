
import React from 'react';
import { UserPlus, BarChart3, Users, Database, Megaphone } from 'lucide-react';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import PageTabs from '@/components/basic/PageTabs';
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

      <PageTabs
        defaultValue="dashboard"

        items={[
          {
            id: 'dashboard',
            label: 'Dashboard',
            icon: BarChart3,
            content: <CRMDashboard />
          },
          {
            id: 'referrals',
            label: 'Referrals',
            icon: Users,
            content: <ReferralManagement />
          },
          {
            id: 'leads',
            label: 'Leads',
            icon: UserPlus,
            content: <LeadManagement />
          },
          {
            id: 'contacts',
            label: 'Contacts',
            icon: Database,
            content: <ContactDatabase />
          },
          {
            id: 'campaigns',
            label: 'Campaigns',
            icon: Megaphone,
            content: <CampaignManagement />
          }
        ]}
      />
    </PageLayout>
  );
};

export default CRM;
