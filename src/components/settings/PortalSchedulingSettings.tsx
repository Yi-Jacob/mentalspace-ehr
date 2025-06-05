
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import TelehealthSettings from './TelehealthSettings';
import ClientPortalSettings from './portal/ClientPortalSettings';
import SecureMessagingSettings from './portal/SecureMessagingSettings';
import AppointmentRemindersSettings from './portal/AppointmentRemindersSettings';
import CalendarSyncSettings from './portal/CalendarSyncSettings';
import MultipleLocationsSettings from './portal/MultipleLocationsSettings';
import PortalNavigationButtons from './portal/PortalNavigationButtons';

const PortalSchedulingSettings: React.FC = () => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('portal');
  const [settings, setSettings] = useState({
    clientPortal: {
      enabled: true,
      allowSelfScheduling: true,
      allowCancellations: true,
      requireConfirmation: true,
      customWelcomeMessage: '',
      portalDomain: 'chctherapy.mentalspace.app',
      allowDocumentUpload: true,
      showAppointmentHistory: true,
      enablePaymentPortal: true,
    },
    secureMessaging: {
      enabled: true,
      allowPatientInitiated: true,
      responseTime: '24',
      emailNotifications: true,
      maxFileSize: 10,
      allowedFileTypes: ['pdf', 'jpg', 'png', 'doc', 'docx'],
      messageRetention: 365,
    },
    appointmentReminders: {
      enabled: true,
      emailReminders: true,
      smsReminders: false,
      reminderTiming: ['24h', '2h'],
      customMessage: '',
      confirmationRequired: true,
    },
    calendarSync: {
      googleCalendar: false,
      outlook365: false,
      appleCalendar: false,
      syncInterval: 15,
      twoWaySync: true,
    },
    multipleLocations: {
      enabled: false,
      defaultLocation: '',
      locations: [],
      allowLocationSelection: true,
    }
  });

  const handleSave = () => {
    toast({
      title: 'Settings Saved',
      description: 'Portal and scheduling settings have been updated successfully.',
    });
  };

  const updateClientPortalSettings = (newSettings: any) => {
    setSettings(prev => ({
      ...prev,
      clientPortal: newSettings
    }));
  };

  const updateSecureMessagingSettings = (newSettings: any) => {
    setSettings(prev => ({
      ...prev,
      secureMessaging: newSettings
    }));
  };

  const updateAppointmentRemindersSettings = (newSettings: any) => {
    setSettings(prev => ({
      ...prev,
      appointmentReminders: newSettings
    }));
  };

  const updateCalendarSyncSettings = (newSettings: any) => {
    setSettings(prev => ({
      ...prev,
      calendarSync: newSettings
    }));
  };

  const updateMultipleLocationsSettings = (newSettings: any) => {
    setSettings(prev => ({
      ...prev,
      multipleLocations: newSettings
    }));
  };

  if (activeSection === 'telehealth') {
    return (
      <div className="space-y-6">
        <PortalNavigationButtons 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        <TelehealthSettings />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PortalNavigationButtons 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />

      {activeSection === 'portal' && (
        <ClientPortalSettings 
          settings={settings.clientPortal}
          onSettingsChange={updateClientPortalSettings}
        />
      )}

      {activeSection === 'messaging' && (
        <SecureMessagingSettings 
          settings={settings.secureMessaging}
          onSettingsChange={updateSecureMessagingSettings}
        />
      )}

      {activeSection === 'reminders' && (
        <AppointmentRemindersSettings 
          settings={settings.appointmentReminders}
          onSettingsChange={updateAppointmentRemindersSettings}
        />
      )}

      {activeSection === 'calendar' && (
        <CalendarSyncSettings 
          settings={settings.calendarSync}
          onSettingsChange={updateCalendarSyncSettings}
        />
      )}

      {activeSection === 'locations' && (
        <MultipleLocationsSettings 
          settings={settings.multipleLocations}
          onSettingsChange={updateMultipleLocationsSettings}
        />
      )}

      <div className="flex justify-end">
        <Button onClick={handleSave} className="px-8">
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default PortalSchedulingSettings;
