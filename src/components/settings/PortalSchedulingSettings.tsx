
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

  // Safely extract portal and scheduling settings with defaults
  const safePortalSettings = (() => {
    const portalSettings = settings?.portal_settings;
    if (portalSettings && typeof portalSettings === 'object' && !Array.isArray(portalSettings)) {
      return portalSettings as Record<string, any>;
    }
    return {};
  })();

  const safeSchedulingSettings = (() => {
    const schedulingSettings = settings?.scheduling_settings;
    if (schedulingSettings && typeof schedulingSettings === 'object' && !Array.isArray(schedulingSettings)) {
      return schedulingSettings as Record<string, any>;
    }
    return {};
  })();

  const updatePortalSettings = (newSettings: any) => {
    updateSettings({
      portal_settings: { ...safePortalSettings, ...newSettings }
    });
  };

  const updateSchedulingSettings = (newSettings: any) => {
    updateSettings({
      scheduling_settings: { ...safeSchedulingSettings, ...newSettings }
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
            settings={(safePortalSettings.clientPortal as Record<string, any>) || {}}
            onSettingsChange={(newSettings) => updatePortalSettings({ clientPortal: newSettings })}
          />
        );
      case 'messaging':
        return (
          <SecureMessagingSettings
            settings={(safePortalSettings.messaging as Record<string, any>) || {}}
            onSettingsChange={(newSettings) => updatePortalSettings({ messaging: newSettings })}
          />
        );
      case 'reminders':
        return (
          <AppointmentRemindersSettings
            settings={(safeSchedulingSettings.reminders as Record<string, any>) || {}}
            onSettingsChange={(newSettings) => updateSchedulingSettings({ reminders: newSettings })}
          />
        );
      case 'calendar':
        return (
          <CalendarSyncSettings
            settings={(safeSchedulingSettings.calendarSync as Record<string, any>) || {}}
            onSettingsChange={(newSettings) => updateSchedulingSettings({ calendarSync: newSettings })}
          />
        );
      case 'locations':
        return (
          <MultipleLocationsSettings
            settings={(safeSchedulingSettings.locations as Record<string, any>) || {}}
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
