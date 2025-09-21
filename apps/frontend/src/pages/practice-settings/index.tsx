import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Settings, User, Calendar, FileText, CreditCard } from 'lucide-react';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import { Button } from '@/components/basic/button';
import { cn } from '@/utils/utils';
import { useAuth } from '@/hooks/useAuth';
import { USER_ROLES } from '@/types/enums/staffEnum';
import { Navigate } from 'react-router-dom';

// Import tab components
import AccountAccessTab from './components/AccountAccessTab';
import PortalSchedulingTab from './components/PortalSchedulingTab';
import NotesTab from './components/NotesTab';
import BillingTab from './components/BillingTab';

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path: string;
}

const tabs: Tab[] = [
  {
    id: 'account-access',
    label: 'Account and Access',
    icon: User,
    path: '/practice-settings/account-access',
  },
  {
    id: 'portal-scheduling',
    label: 'Portal and Scheduling',
    icon: Calendar,
    path: '/practice-settings/portal-scheduling',
  },
  {
    id: 'notes',
    label: 'Notes',
    icon: FileText,
    path: '/practice-settings/notes',
  },
  {
    id: 'billing',
    label: 'Billing',
    icon: CreditCard,
    path: '/practice-settings/billing',
  },
];

const PracticeSettingsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Check if user is practice administrator
  const isPracticeAdmin = user?.roles?.includes(USER_ROLES.PRACTICE_ADMINISTRATOR);
  
  // Redirect non-administrators to dashboard
  if (!isPracticeAdmin) {
    return <Navigate to="/" replace />;
  }
  
  // Determine active tab from URL
  const getActiveTab = () => {
    const pathSegments = location.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    if (lastSegment === 'practice-settings' || lastSegment === '') {
      return 'account-access'; // Default tab
    }
    
    return lastSegment;
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      navigate(tab.path);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account-access':
        return <AccountAccessTab />;
      case 'portal-scheduling':
        return <PortalSchedulingTab />;
      case 'notes':
        return <NotesTab />;
      case 'billing':
        return <BillingTab />;
      default:
        return <AccountAccessTab />;
    }
  };

  return (
    <PageLayout variant="simple">
      <PageHeader
        icon={Settings}
        title="Practice Settings"
        description="Manage your practice configuration, billing, and system preferences"
      />

      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    'flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {renderTabContent()}
        </div>
      </div>
    </PageLayout>
  );
};

export default PracticeSettingsPage;
