
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings, Bell, Calendar, Clock, Users, Mail, Sparkles, Download, Upload, Save } from 'lucide-react';
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
    <div className="space-y-6 bg-gradient-to-br from-white to-green-50/30 min-h-screen p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl text-white shadow-lg">
            <Settings className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Scheduling Settings
            </h2>
            <p className="text-gray-600 mt-1">Configure your scheduling preferences and integrations</p>
          </div>
        </div>
        <Button 
          onClick={handleSaveSettings}
          className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-green-50/30 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center space-x-2 text-xl">
              <Clock className="h-5 w-5" />
              <span>General Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-2">
              <Label htmlFor="defaultDuration" className="text-sm font-semibold text-gray-700">Default Appointment Duration (minutes)</Label>
              <Select
                value={settings.defaultAppointmentDuration}
                onValueChange={(value) => handleSettingChange('defaultAppointmentDuration', value)}
              >
                <SelectTrigger className="bg-white/70 backdrop-blur-sm border-gray-200 focus:border-green-400 transition-all duration-200 hover:bg-white/90">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-0 shadow-2xl backdrop-blur-sm">
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                  <SelectItem value="120">120 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bufferTime" className="text-sm font-semibold text-gray-700">Buffer Time Between Appointments (minutes)</Label>
              <Select
                value={settings.bufferTimeBetweenAppointments}
                onValueChange={(value) => handleSettingChange('bufferTimeBetweenAppointments', value)}
              >
                <SelectTrigger className="bg-white/70 backdrop-blur-sm border-gray-200 focus:border-green-400 transition-all duration-200 hover:bg-white/90">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-0 shadow-2xl backdrop-blur-sm">
                  <SelectItem value="0">No buffer</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="advanceBooking" className="text-sm font-semibold text-gray-700">Maximum Advance Booking (days)</Label>
              <Input
                id="advanceBooking"
                type="number"
                value={settings.maxAdvanceBookingDays}
                onChange={(e) => handleSettingChange('maxAdvanceBookingDays', e.target.value)}
                className="bg-white/70 backdrop-blur-sm border-gray-200 focus:border-green-400 transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeSlots" className="text-sm font-semibold text-gray-700">Time Slot Intervals (minutes)</Label>
              <Select
                value={settings.timeSlotInterval}
                onValueChange={(value) => handleSettingChange('timeSlotInterval', value)}
              >
                <SelectTrigger className="bg-white/70 backdrop-blur-sm border-gray-200 focus:border-green-400 transition-all duration-200 hover:bg-white/90">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-0 shadow-2xl backdrop-blur-sm">
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reminder Settings */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center space-x-2 text-xl">
              <Bell className="h-5 w-5" />
              <span>Reminder Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold text-gray-700">Email Reminders</Label>
                <p className="text-sm text-gray-500">Send email reminders to clients</p>
              </div>
              <Switch
                checked={settings.emailRemindersEnabled}
                onCheckedChange={(checked) => handleSettingChange('emailRemindersEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold text-gray-700">SMS Reminders</Label>
                <p className="text-sm text-gray-500">Send text message reminders</p>
              </div>
              <Switch
                checked={settings.smsRemindersEnabled}
                onCheckedChange={(checked) => handleSettingChange('smsRemindersEnabled', checked)}
              />
            </div>

            <Separator className="bg-gradient-to-r from-blue-200 to-purple-200" />

            <div className="space-y-2">
              <Label htmlFor="defaultReminder" className="text-sm font-semibold text-gray-700">Default Reminder Time (minutes before)</Label>
              <Select
                value={settings.defaultReminderTime}
                onValueChange={(value) => handleSettingChange('defaultReminderTime', value)}
              >
                <SelectTrigger className="bg-white/70 backdrop-blur-sm border-gray-200 focus:border-blue-400 transition-all duration-200 hover:bg-white/90">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-0 shadow-2xl backdrop-blur-sm">
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="1440">24 hours</SelectItem>
                  <SelectItem value="2880">48 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondReminder" className="text-sm font-semibold text-gray-700">Second Reminder Time (minutes before)</Label>
              <Select
                value={settings.secondReminderTime}
                onValueChange={(value) => handleSettingChange('secondReminderTime', value)}
              >
                <SelectTrigger className="bg-white/70 backdrop-blur-sm border-gray-200 focus:border-blue-400 transition-all duration-200 hover:bg-white/90">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-0 shadow-2xl backdrop-blur-sm">
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Integration */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50/30 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center space-x-2 text-xl">
              <Calendar className="h-5 w-5" />
              <span>Calendar Integration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold text-gray-700">Google Calendar Sync</Label>
                <p className="text-sm text-gray-500">Sync with Google Calendar</p>
              </div>
              <Switch
                checked={settings.googleCalendarSync}
                onCheckedChange={(checked) => handleSettingChange('googleCalendarSync', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-red-50 rounded-xl border border-pink-200">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold text-gray-700">Outlook Calendar Sync</Label>
                <p className="text-sm text-gray-500">Sync with Microsoft Outlook</p>
              </div>
              <Switch
                checked={settings.outlookCalendarSync}
                onCheckedChange={(checked) => handleSettingChange('outlookCalendarSync', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold text-gray-700">External Calendar Sync</Label>
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
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-orange-50/30 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center space-x-2 text-xl">
              <Users className="h-5 w-5" />
              <span>Availability & Booking</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold text-gray-700">Show Unavailable Slots</Label>
                <p className="text-sm text-gray-500">Display unavailable time slots</p>
              </div>
              <Switch
                checked={settings.showUnavailableSlots}
                onCheckedChange={(checked) => handleSettingChange('showUnavailableSlots', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold text-gray-700">Allow Booking Outside Hours</Label>
                <p className="text-sm text-gray-500">Allow appointments outside normal hours</p>
              </div>
              <Switch
                checked={settings.allowBookingOutsideHours}
                onCheckedChange={(checked) => handleSettingChange('allowBookingOutsideHours', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-200">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold text-gray-700">Auto-Confirm Appointments</Label>
                <p className="text-sm text-gray-500">Automatically confirm new appointments</p>
              </div>
              <Switch
                checked={settings.autoConfirmAppointments}
                onCheckedChange={(checked) => handleSettingChange('autoConfirmAppointments', checked)}
              />
            </div>

            <Separator className="bg-gradient-to-r from-orange-200 to-pink-200" />

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold text-gray-700">Enable Waitlist</Label>
                <p className="text-sm text-gray-500">Allow clients to join appointment waitlist</p>
              </div>
              <Switch
                checked={settings.waitlistEnabled}
                onCheckedChange={(checked) => handleSettingChange('waitlistEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold text-gray-700">Auto-Notify Waitlist</Label>
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
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-indigo-50/30 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-xl">
            <Sparkles className="h-5 w-5" />
            <span>Import/Export</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-3">
                <Download className="h-6 w-6 text-blue-600" />
                <h3 className="font-semibold text-lg text-blue-800">Export Schedule Data</h3>
              </div>
              <p className="text-sm text-blue-700">Download your schedule and appointment data</p>
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="hover:bg-blue-100 hover:border-blue-400 transition-all duration-200"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="hover:bg-indigo-100 hover:border-indigo-400 transition-all duration-200"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>
            <div className="space-y-4 p-6 bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl border border-purple-200">
              <div className="flex items-center space-x-3">
                <Upload className="h-6 w-6 text-purple-600" />
                <h3 className="font-semibold text-lg text-purple-800">Import Schedule Data</h3>
              </div>
              <p className="text-sm text-purple-700">Import existing schedule data</p>
              <Button 
                variant="outline" 
                size="sm"
                className="hover:bg-purple-100 hover:border-purple-400 transition-all duration-200"
              >
                <Upload className="h-4 w-4 mr-2" />
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
