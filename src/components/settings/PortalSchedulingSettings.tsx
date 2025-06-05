
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { usePracticeSettings } from '@/hooks/usePracticeSettings';
import PortalNavigationButtons from './portal/PortalNavigationButtons';
import ClientPortalSettings from './portal/ClientPortalSettings';
import TelehealthSettings from './TelehealthSettings';
import SecureMessagingSettings from './portal/SecureMessagingSettings';
import AppointmentRemindersSettings from './portal/AppointmentRemindersSettings';
import CalendarSyncSettings from './portal/CalendarSyncSettings';
import MultipleLocationsSettings from './portal/MultipleLocationsSettings';

const PortalSchedulingSettings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('portal');
  const { settings, updateSettings, isLoading, isUpdating } = usePracticeSettings();

  const portalSettings = settings?.portal_settings || {};
  const schedulingSettings = settings?.scheduling_settings || {};

  const updatePortalSettings = (newSettings: any) => {
    updateSettings({
      portal_settings: { ...(portalSettings as any), ...newSettings }
    });
  };

  const updateSchedulingSettings = (newSettings: any) => {
    updateSettings({
      scheduling_settings: { ...(schedulingSettings as any), ...newSettings }
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
            settings={(portalSettings as any)?.clientPortal || {}}
            onSettingsChange={(newSettings) => updatePortalSettings({ clientPortal: newSettings })}
          />
        );
      case 'telehealth':
        return (
          <TelehealthSettings
            settings={(portalSettings as any)?.telehealth || {}}
            onSettingsChange={(newSettings) => updatePortalSettings({ telehealth: newSettings })}
          />
        );
      case 'messaging':
        return (
          <SecureMessagingSettings
            settings={(portalSettings as any)?.messaging || {}}
            onSettingsChange={(newSettings) => updatePortalSettings({ messaging: newSettings })}
          />
        );
      case 'reminders':
        return (
          <AppointmentRemindersSettings
            settings={(schedulingSettings as any)?.reminders || {}}
            onSettingsChange={(newSettings) => updateSchedulingSettings({ reminders: newSettings })}
          />
        );
      case 'calendar':
        return (
          <CalendarSyncSettings
            settings={(schedulingSettings as any)?.calendarSync || {}}
            onSettingsChange={(newSettings) => updateSchedulingSettings({ calendarSync: newSettings })}
          />
        );
      case 'locations':
        return (
          <MultipleLocationsSettings
            settings={(schedulingSettings as any)?.locations || {}}
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
