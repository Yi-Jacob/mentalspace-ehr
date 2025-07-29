
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon, User, Calendar, FileText, CreditCard } from 'lucide-react';
import PageLayout from '@/components/ui/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import PageTabs from '@/components/ui/PageTabs';
import AccountAccessSettings from '@/pages/settings/components/AccountAccessSettings';
import PortalSchedulingSettings from '@/pages/settings/components/PortalSchedulingSettings';
import NotesSettings from '@/pages/settings/components/NotesSettings';
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

      <PageTabs
        value={activeTab}
        onValueChange={setActiveTab}

        items={[
          {
            id: 'account',
            label: 'Account & Access',
            icon: User,
            content: <AccountAccessSettings />
          },
          {
            id: 'portal',
            label: 'Portal & Scheduling',
            icon: Calendar,
            content: <PortalSchedulingSettings />
          },
          {
            id: 'notes',
            label: 'Notes',
            icon: FileText,
            content: <NotesSettings />
          },
          {
            id: 'billing',
            label: 'Billing',
            icon: CreditCard,
            content: <BillingSettings />
          }
        ]}
      />
    </PageLayout>
  );
};

export default Settings;
