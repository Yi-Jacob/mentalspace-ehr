
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings, Bell, Calendar, Clock, Users, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SchedulingSettings = () => {
  const [settings, setSettings] = useState({
    // General Settings
    defaultAppointmentDuration: '60',
    bufferTimeBetweenAppointments: '15',
    maxAdvanceBookingDays: '90',
    timeSlotInterval: '15',
    
    // Reminder Settings
    emailRemindersEnabled: true,
    smsRemindersEnabled: false,
    defaultReminderTime: '1440', // 24 hours
    secondReminderTime: '60', // 1 hour
    
    // Calendar Integration
    googleCalendarSync: false,
    outlookCalendarSync: false,
    syncExternalCalendar: true,
    
    // Availability Settings
    showUnavailableSlots: false,
    allowBookingOutsideHours: false,
    autoConfirmAppointments: true,
    
    // Waitlist Settings
    waitlistEnabled: true,
    autoNotifyWaitlist: true,
    waitlistPrioritySystem: true
  });

  const { toast } = useToast();

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    // Here you would normally save to your backend
    toast({
      title: 'Settings Saved',
      description: 'Your scheduling settings have been updated successfully.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Scheduling Settings</h2>
        <Button onClick={handleSaveSettings}>
          Save Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>General Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="defaultDuration">Default Appointment Duration (minutes)</Label>
              <Select
                value={settings.defaultAppointmentDuration}
                onValueChange={(value) => handleSettingChange('defaultAppointmentDuration', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                  <SelectItem value="120">120 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bufferTime">Buffer Time Between Appointments (minutes)</Label>
              <Select
                value={settings.bufferTimeBetweenAppointments}
                onValueChange={(value) => handleSettingChange('bufferTimeBetweenAppointments', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No buffer</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="advanceBooking">Maximum Advance Booking (days)</Label>
              <Input
                id="advanceBooking"
                type="number"
                value={settings.maxAdvanceBookingDays}
                onChange={(e) => handleSettingChange('maxAdvanceBookingDays', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeSlots">Time Slot Intervals (minutes)</Label>
              <Select
                value={settings.timeSlotInterval}
                onValueChange={(value) => handleSettingChange('timeSlotInterval', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reminder Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Reminder Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Reminders</Label>
                <p className="text-sm text-gray-500">Send email reminders to clients</p>
              </div>
              <Switch
                checked={settings.emailRemindersEnabled}
                onCheckedChange={(checked) => handleSettingChange('emailRemindersEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SMS Reminders</Label>
                <p className="text-sm text-gray-500">Send text message reminders</p>
              </div>
              <Switch
                checked={settings.smsRemindersEnabled}
                onCheckedChange={(checked) => handleSettingChange('smsRemindersEnabled', checked)}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="defaultReminder">Default Reminder Time (minutes before)</Label>
              <Select
                value={settings.defaultReminderTime}
                onValueChange={(value) => handleSettingChange('defaultReminderTime', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="1440">24 hours</SelectItem>
                  <SelectItem value="2880">48 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondReminder">Second Reminder Time (minutes before)</Label>
              <Select
                value={settings.secondReminderTime}
                onValueChange={(value) => handleSettingChange('secondReminderTime', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Calendar Integration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Google Calendar Sync</Label>
                <p className="text-sm text-gray-500">Sync with Google Calendar</p>
              </div>
              <Switch
                checked={settings.googleCalendarSync}
                onCheckedChange={(checked) => handleSettingChange('googleCalendarSync', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Outlook Calendar Sync</Label>
                <p className="text-sm text-gray-500">Sync with Microsoft Outlook</p>
              </div>
              <Switch
                checked={settings.outlookCalendarSync}
                onCheckedChange={(checked) => handleSettingChange('outlookCalendarSync', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>External Calendar Sync</Label>
                <p className="text-sm text-gray-500">Allow external calendar integration</p>
              </div>
              <Switch
                checked={settings.syncExternalCalendar}
                onCheckedChange={(checked) => handleSettingChange('syncExternalCalendar', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Availability & Booking Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Availability & Booking</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Unavailable Slots</Label>
                <p className="text-sm text-gray-500">Display unavailable time slots</p>
              </div>
              <Switch
                checked={settings.showUnavailableSlots}
                onCheckedChange={(checked) => handleSettingChange('showUnavailableSlots', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Booking Outside Hours</Label>
                <p className="text-sm text-gray-500">Allow appointments outside normal hours</p>
              </div>
              <Switch
                checked={settings.allowBookingOutsideHours}
                onCheckedChange={(checked) => handleSettingChange('allowBookingOutsideHours', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Confirm Appointments</Label>
                <p className="text-sm text-gray-500">Automatically confirm new appointments</p>
              </div>
              <Switch
                checked={settings.autoConfirmAppointments}
                onCheckedChange={(checked) => handleSettingChange('autoConfirmAppointments', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Waitlist</Label>
                <p className="text-sm text-gray-500">Allow clients to join appointment waitlist</p>
              </div>
              <Switch
                checked={settings.waitlistEnabled}
                onCheckedChange={(checked) => handleSettingChange('waitlistEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Notify Waitlist</Label>
                <p className="text-sm text-gray-500">Automatically notify when slots become available</p>
              </div>
              <Switch
                checked={settings.autoNotifyWaitlist}
                onCheckedChange={(checked) => handleSettingChange('autoNotifyWaitlist', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Import/Export Section */}
      <Card>
        <CardHeader>
          <CardTitle>Import/Export</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium">Export Schedule Data</h3>
              <p className="text-sm text-gray-600">Download your schedule and appointment data</p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Export CSV
                </Button>
                <Button variant="outline" size="sm">
                  Export PDF
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Import Schedule Data</h3>
              <p className="text-sm text-gray-600">Import existing schedule data</p>
              <Button variant="outline" size="sm">
                Import CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchedulingSettings;
