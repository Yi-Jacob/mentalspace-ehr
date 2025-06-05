
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { usePracticeSettings } from '@/hooks/usePracticeSettings';
import PortalNavigationButtons from './portal/PortalNavigationButtons';
import ClientPortalSettings from './portal/ClientPortalSettings';
import SecureMessagingSettings from './portal/SecureMessagingSettings';
import AppointmentRemindersSettings from './portal/AppointmentRemindersSettings';
import CalendarSyncSettings from './portal/CalendarSyncSettings';
import MultipleLocationsSettings from './portal/MultipleLocationsSettings';

const PortalSchedulingSettings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('portal');
  const { settings, updateSettings, isLoading, isUpdating } = usePracticeSettings();

  // Ensure we have safe defaults
  const portalSettings = settings?.portal_settings || {};
  const schedulingSettings = settings?.scheduling_settings || {};

  const updatePortalSettings = (newSettings: any) => {
    updateSettings({
      portal_settings: { ...portalSettings, ...newSettings }
    });
  };

  const updateSchedulingSettings = (newSettings: any) => {
    updateSettings({
      scheduling_settings: { ...schedulingSettings, ...newSettings }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'portal':
        return (
          <ClientPortalSettings
            settings={portalSettings.clientPortal || {}}
            onSettingsChange={(newSettings) => updatePortalSettings({ clientPortal: newSettings })}
          />
        );
      case 'messaging':
        return (
          <SecureMessagingSettings
            settings={portalSettings.messaging || {}}
            onSettingsChange={(newSettings) => updatePortalSettings({ messaging: newSettings })}
          />
        );
      case 'reminders':
        return (
          <AppointmentRemindersSettings
            settings={schedulingSettings.reminders || {}}
            onSettingsChange={(newSettings) => updateSchedulingSettings({ reminders: newSettings })}
          />
        );
      case 'calendar':
        return (
          <CalendarSyncSettings
            settings={schedulingSettings.calendarSync || {}}
            onSettingsChange={(newSettings) => updateSchedulingSettings({ calendarSync: newSettings })}
          />
        );
      case 'locations':
        return (
          <MultipleLocationsSettings
            settings={schedulingSettings.locations || {}}
            onSettingsChange={(newSettings) => updateSchedulingSettings({ locations: newSettings })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <PortalNavigationButtons 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {renderActiveSection()}

      <div className="flex justify-end">
        <Button disabled={isUpdating}>
          {isUpdating ? 'Saving...' : 'Settings Auto-Saved'}
        </Button>
      </div>
    </div>
  );
};

export default PortalSchedulingSettings;
