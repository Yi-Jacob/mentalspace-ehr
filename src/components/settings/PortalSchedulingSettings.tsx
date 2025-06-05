import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Monitor, 
  Video, 
  MessageSquare, 
  Bell, 
  Calendar,
  MapPin
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TelehealthSettings from './TelehealthSettings';

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

  const sectionButtons = [
    { id: 'portal', label: 'Client Portal', icon: Monitor },
    { id: 'telehealth', label: 'Telehealth', icon: Video },
    { id: 'messaging', label: 'Secure Messaging', icon: MessageSquare },
    { id: 'reminders', label: 'Reminders', icon: Bell },
    { id: 'calendar', label: 'Calendar Sync', icon: Calendar },
    { id: 'locations', label: 'Locations', icon: MapPin },
  ];

  if (activeSection === 'telehealth') {
    return (
      <div className="space-y-6">
        <div className="flex space-x-2 mb-6">
          {sectionButtons.map((section) => {
            const IconComponent = section.icon;
            return (
              <Button
                key={section.id}
                variant={activeSection === section.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveSection(section.id)}
                className="flex items-center space-x-2"
              >
                <IconComponent className="h-4 w-4" />
                <span>{section.label}</span>
              </Button>
            );
          })}
        </div>
        <TelehealthSettings />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {sectionButtons.map((section) => {
          const IconComponent = section.icon;
          return (
            <Button
              key={section.id}
              variant={activeSection === section.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveSection(section.id)}
              className="flex items-center space-x-2"
            >
              <IconComponent className="h-4 w-4" />
              <span>{section.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Client Portal */}
      {activeSection === 'portal' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Monitor className="h-5 w-5" />
              <span>Client Portal</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="portalEnabled">Enable client portal</Label>
              <Switch
                id="portalEnabled"
                checked={settings.clientPortal.enabled}
                onCheckedChange={(checked) => setSettings({
                  ...settings,
                  clientPortal: {...settings.clientPortal, enabled: checked}
                })}
              />
            </div>
            
            <div>
              <Label htmlFor="portalDomain">Portal Domain</Label>
              <Input
                id="portalDomain"
                value={settings.clientPortal.portalDomain}
                onChange={(e) => setSettings({
                  ...settings,
                  clientPortal: {...settings.clientPortal, portalDomain: e.target.value}
                })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="selfScheduling">Allow self-scheduling</Label>
              <Switch
                id="selfScheduling"
                checked={settings.clientPortal.allowSelfScheduling}
                onCheckedChange={(checked) => setSettings({
                  ...settings,
                  clientPortal: {...settings.clientPortal, allowSelfScheduling: checked}
                })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="allowCancellations">Allow appointment cancellations</Label>
              <Switch
                id="allowCancellations"
                checked={settings.clientPortal.allowCancellations}
                onCheckedChange={(checked) => setSettings({
                  ...settings,
                  clientPortal: {...settings.clientPortal, allowCancellations: checked}
                })}
              />
            </div>

            <div>
              <Label htmlFor="welcomeMessage">Custom welcome message</Label>
              <Textarea
                id="welcomeMessage"
                value={settings.clientPortal.customWelcomeMessage}
                onChange={(e) => setSettings({
                  ...settings,
                  clientPortal: {...settings.clientPortal, customWelcomeMessage: e.target.value}
                })}
                placeholder="Welcome to our patient portal..."
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="allowDocumentUpload">Allow document uploads</Label>
              <Switch
                id="allowDocumentUpload"
                checked={settings.clientPortal.allowDocumentUpload}
                onCheckedChange={(checked) => setSettings({
                  ...settings,
                  clientPortal: {...settings.clientPortal, allowDocumentUpload: checked}
                })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="showAppointmentHistory">Show appointment history</Label>
              <Switch
                id="showAppointmentHistory"
                checked={settings.clientPortal.showAppointmentHistory}
                onCheckedChange={(checked) => setSettings({
                  ...settings,
                  clientPortal: {...settings.clientPortal, showAppointmentHistory: checked}
                })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="enablePaymentPortal">Enable payment portal</Label>
              <Switch
                id="enablePaymentPortal"
                checked={settings.clientPortal.enablePaymentPortal}
                onCheckedChange={(checked) => setSettings({
                  ...settings,
                  clientPortal: {...settings.clientPortal, enablePaymentPortal: checked}
                })}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Secure Messaging */}
      {activeSection === 'messaging' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Secure Messaging</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="messagingEnabled">Enable secure messaging</Label>
              <Switch
                id="messagingEnabled"
                checked={settings.secureMessaging.enabled}
                onCheckedChange={(checked) => setSettings({
                  ...settings,
                  secureMessaging: {...settings.secureMessaging, enabled: checked}
                })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="patientInitiated">Allow patient-initiated messages</Label>
              <Switch
                id="patientInitiated"
                checked={settings.secureMessaging.allowPatientInitiated}
                onCheckedChange={(checked) => setSettings({
                  ...settings,
                  secureMessaging: {...settings.secureMessaging, allowPatientInitiated: checked}
                })}
              />
            </div>

            <div>
              <Label htmlFor="responseTime">Expected response time (hours)</Label>
              <Select value={settings.secureMessaging.responseTime} onValueChange={(value) => setSettings({
                ...settings,
                secureMessaging: {...settings.secureMessaging, responseTime: value}
              })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 hours</SelectItem>
                  <SelectItem value="4">4 hours</SelectItem>
                  <SelectItem value="24">24 hours</SelectItem>
                  <SelectItem value="48">48 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="maxFileSize">Maximum file size (MB)</Label>
              <Input
                id="maxFileSize"
                type="number"
                value={settings.secureMessaging.maxFileSize}
                onChange={(e) => setSettings({
                  ...settings,
                  secureMessaging: {...settings.secureMessaging, maxFileSize: parseInt(e.target.value)}
                })}
              />
            </div>

            <div>
              <Label htmlFor="allowedFileTypes">Allowed file types</Label>
              <Input
                id="allowedFileTypes"
                value={settings.secureMessaging.allowedFileTypes.join(', ')}
                onChange={(e) => setSettings({
                  ...settings,
                  secureMessaging: {...settings.secureMessaging, allowedFileTypes: e.target.value.split(',').map(item => item.trim())}
                })}
              />
            </div>

            <div>
              <Label htmlFor="messageRetention">Message retention (days)</Label>
              <Input
                id="messageRetention"
                type="number"
                value={settings.secureMessaging.messageRetention}
                onChange={(e) => setSettings({
                  ...settings,
                  secureMessaging: {...settings.secureMessaging, messageRetention: parseInt(e.target.value)}
                })}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Patient Appointment Reminders */}
      {activeSection === 'reminders' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Patient Appointment Reminders</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="remindersEnabled">Enable appointment reminders</Label>
              <Switch
                id="remindersEnabled"
                checked={settings.appointmentReminders.enabled}
                onCheckedChange={(checked) => setSettings({
                  ...settings,
                  appointmentReminders: {...settings.appointmentReminders, enabled: checked}
                })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="emailReminders">Email reminders</Label>
              <Switch
                id="emailReminders"
                checked={settings.appointmentReminders.emailReminders}
                onCheckedChange={(checked) => setSettings({
                  ...settings,
                  appointmentReminders: {...settings.appointmentReminders, emailReminders: checked}
                })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="smsReminders">SMS reminders</Label>
              <Switch
                id="smsReminders"
                checked={settings.appointmentReminders.smsReminders}
                onCheckedChange={(checked) => setSettings({
                  ...settings,
                  appointmentReminders: {...settings.appointmentReminders, smsReminders: checked}
                })}
              />
            </div>

            <div>
              <Label htmlFor="customMessage">Custom reminder message</Label>
              <Textarea
                id="customMessage"
                value={settings.appointmentReminders.customMessage}
                onChange={(e) => setSettings({
                  ...settings,
                  appointmentReminders: {...settings.appointmentReminders, customMessage: e.target.value}
                })}
                placeholder="Don't forget your appointment tomorrow at..."
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="confirmationRequired">Confirmation Required</Label>
              <Switch
                id="confirmationRequired"
                checked={settings.appointmentReminders.confirmationRequired}
                onCheckedChange={(checked) => setSettings({
                  ...settings,
                  appointmentReminders: {...settings.appointmentReminders, confirmationRequired: checked}
                })}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sync Calendars */}
      {activeSection === 'calendar' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Sync Calendars With Other Applications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="googleCalendar">Google Calendar</Label>
              <Switch
                id="googleCalendar"
                checked={settings.calendarSync.googleCalendar}
                onCheckedChange={(checked) => setSettings({
                  ...settings,
                  calendarSync: {...settings.calendarSync, googleCalendar: checked}
                })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="outlook365">Outlook 365</Label>
              <Switch
                id="outlook365"
                checked={settings.calendarSync.outlook365}
                onCheckedChange={(checked) => setSettings({
                  ...settings,
                  calendarSync: {...settings.calendarSync, outlook365: checked}
                })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="appleCalendar">Apple Calendar</Label>
              <Switch
                id="appleCalendar"
                checked={settings.calendarSync.appleCalendar}
                onCheckedChange={(checked) => setSettings({
                  ...settings,
                  calendarSync: {...settings.calendarSync, appleCalendar: checked}
                })}
              />
            </div>

            <div>
              <Label htmlFor="syncInterval">Sync interval (minutes)</Label>
              <Select value={settings.calendarSync.syncInterval.toString()} onValueChange={(value) => setSettings({
                ...settings,
                calendarSync: {...settings.calendarSync, syncInterval: parseInt(value)}
              })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="twoWaySync">Two-way sync</Label>
              <Switch
                id="twoWaySync"
                checked={settings.calendarSync.twoWaySync}
                onCheckedChange={(checked) => setSettings({
                  ...settings,
                  calendarSync: {...settings.calendarSync, twoWaySync: checked}
                })}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Multiple Practice Locations */}
      {activeSection === 'locations' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Multiple Practice Locations</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="multipleLocations">Enable multiple locations</Label>
              <Switch
                id="multipleLocations"
                checked={settings.multipleLocations.enabled}
                onCheckedChange={(checked) => setSettings({
                  ...settings,
                  multipleLocations: {...settings.multipleLocations, enabled: checked}
                })}
              />
            </div>

            <div>
              <p className="text-sm text-gray-600">
                Enable enhanced features for practices with multiple locations including location-specific scheduling, staff assignments, and reporting.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="allowLocationSelection">Allow location selection</Label>
              <Switch
                id="allowLocationSelection"
                checked={settings.multipleLocations.allowLocationSelection}
                onCheckedChange={(checked) => setSettings({
                  ...settings,
                  multipleLocations: {...settings.multipleLocations, allowLocationSelection: checked}
                })}
              />
            </div>

            {settings.multipleLocations.enabled && (
              <div>
                <Button variant="outline">Manage Locations</Button>
              </div>
            )}
          </CardContent>
        </Card>
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
