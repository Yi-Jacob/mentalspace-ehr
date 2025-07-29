
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
  const safePortalSettings = settings?.portal_settings && 
    typeof settings.portal_settings === 'object' && 
    !Array.isArray(settings.portal_settings) 
    ? settings.portal_settings as Record<string, any> 
    : {};

  const safeSchedulingSettings = settings?.scheduling_settings && 
    typeof settings.scheduling_settings === 'object' && 
    !Array.isArray(settings.scheduling_settings) 
    ? settings.scheduling_settings as Record<string, any> 
    : {};

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
        const clientPortalSettings = {
          enabled: false,
          allowSelfScheduling: false,
          allowCancellations: false,
          requireConfirmation: true,
          customWelcomeMessage: '',
          portalDomain: '',
          allowDocumentUpload: false,
          showAppointmentHistory: true,
          enablePaymentPortal: false,
          ...(safePortalSettings.clientPortal && typeof safePortalSettings.clientPortal === 'object' ? safePortalSettings.clientPortal : {})
        };
        return (
          <ClientPortalSettings
            settings={clientPortalSettings}
            onSettingsChange={(newSettings) => updatePortalSettings({ clientPortal: newSettings })}
          />
        );
      case 'messaging':
        const messagingSettings = {
          enabled: false,
          allowPatientInitiated: false,
          responseTime: '24',
          emailNotifications: true,
          maxFileSize: 10,
          allowedFileTypes: ['pdf', 'doc', 'docx', 'jpg', 'png'],
          messageRetention: 365,
          ...(safePortalSettings.messaging && typeof safePortalSettings.messaging === 'object' ? safePortalSettings.messaging : {})
        };
        return (
          <SecureMessagingSettings
            settings={messagingSettings}
            onSettingsChange={(newSettings) => updatePortalSettings({ messaging: newSettings })}
          />
        );
      case 'reminders':
        const remindersSettings = {
          enabled: true,
          emailReminders: true,
          smsReminders: false,
          reminderTiming: ['24h', '2h'],
          customMessage: '',
          confirmationRequired: false,
          ...(safeSchedulingSettings.reminders && typeof safeSchedulingSettings.reminders === 'object' ? safeSchedulingSettings.reminders : {})
        };
        return (
          <AppointmentRemindersSettings
            settings={remindersSettings}
            onSettingsChange={(newSettings) => updateSchedulingSettings({ reminders: newSettings })}
          />
        );
      case 'calendar':
        const calendarSyncSettings = {
          googleCalendar: false,
          outlook365: false,
          appleCalendar: false,
          syncInterval: 15,
          twoWaySync: false,
          ...(safeSchedulingSettings.calendarSync && typeof safeSchedulingSettings.calendarSync === 'object' ? safeSchedulingSettings.calendarSync : {})
        };
        return (
          <CalendarSyncSettings
            settings={calendarSyncSettings}
            onSettingsChange={(newSettings) => updateSchedulingSettings({ calendarSync: newSettings })}
          />
        );
      case 'locations':
        const locationsSettings = {
          enabled: false,
          defaultLocation: '',
          locations: [],
          allowLocationSelection: true,
          ...(safeSchedulingSettings.locations && typeof safeSchedulingSettings.locations === 'object' ? safeSchedulingSettings.locations : {})
        };
        return (
          <MultipleLocationsSettings
            settings={locationsSettings}
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
