
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, 
  CreditCard, 
  Database, 
  Shield, 
  Bell, 
  Image, 
  FileText, 
  Lock,
  Palette
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AccountAccessSettings: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    practiceName: 'CHC Therapy',
    practiceAddress: '',
    practicePhone: '',
    practiceEmail: '',
    practiceWebsite: '',
    practiceTimezone: 'America/New_York',
    patientRecordsFeatures: {
      autoSave: true,
      versionControl: true,
      auditTrail: true,
      encryption: true,
    },
    securitySettings: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAttempts: 5,
    },
    dashboardReminders: {
      enabled: true,
      overdueNotes: true,
      upcomingAppointments: true,
      billing: true,
      compliance: true,
    },
    displayPreferences: {
      theme: 'light',
      fontSize: 'medium',
      compactMode: false,
      showTips: true,
    }
  });

  const handleSave = () => {
    toast({
      title: 'Settings Saved',
      description: 'Your practice settings have been updated successfully.',
    });
  };

  const handleLogoUpload = () => {
    toast({
      title: 'Logo Upload',
      description: 'Logo upload functionality would be implemented here.',
    });
  };

  const handlePasswordChange = () => {
    toast({
      title: 'Password Change',
      description: 'Password change functionality would be implemented here.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Practice Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>Practice Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="practiceName">Practice Name</Label>
              <Input
                id="practiceName"
                value={settings.practiceName}
                onChange={(e) => setSettings({...settings, practiceName: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="practiceEmail">Email</Label>
              <Input
                id="practiceEmail"
                type="email"
                value={settings.practiceEmail}
                onChange={(e) => setSettings({...settings, practiceEmail: e.target.value})}
                placeholder="contact@chctherapy.com"
              />
            </div>
            <div>
              <Label htmlFor="practicePhone">Phone Number</Label>
              <Input
                id="practicePhone"
                value={settings.practicePhone}
                onChange={(e) => setSettings({...settings, practicePhone: e.target.value})}
                placeholder="(555) 123-4567"
              />
            </div>
            <div>
              <Label htmlFor="practiceWebsite">Website</Label>
              <Input
                id="practiceWebsite"
                value={settings.practiceWebsite}
                onChange={(e) => setSettings({...settings, practiceWebsite: e.target.value})}
                placeholder="www.chctherapy.com"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="practiceAddress">Address</Label>
            <Textarea
              id="practiceAddress"
              value={settings.practiceAddress}
              onChange={(e) => setSettings({...settings, practiceAddress: e.target.value})}
              placeholder="Enter practice address"
            />
          </div>
          <div>
            <Label htmlFor="timezone">Timezone</Label>
            <Select value={settings.practiceTimezone} onValueChange={(value) => setSettings({...settings, practiceTimezone: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/New_York">Eastern Time</SelectItem>
                <SelectItem value="America/Chicago">Central Time</SelectItem>
                <SelectItem value="America/Denver">Mountain Time</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* MentalSpace Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>MentalSpace Subscription</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Current Plan: Professional</h4>
                <p className="text-sm text-gray-600">Billed monthly - $199/month</p>
              </div>
              <Button variant="outline">Manage Subscription</Button>
            </div>
            <Separator />
            <div className="text-sm text-gray-600">
              <p>Next billing date: January 15, 2025</p>
              <p>Payment method: •••• •••• •••• 1234</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient Records */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Patient Records</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="autoSave">Auto-save patient records</Label>
            <Switch
              id="autoSave"
              checked={settings.patientRecordsFeatures.autoSave}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                patientRecordsFeatures: {...settings.patientRecordsFeatures, autoSave: checked}
              })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="versionControl">Enable version control</Label>
            <Switch
              id="versionControl"
              checked={settings.patientRecordsFeatures.versionControl}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                patientRecordsFeatures: {...settings.patientRecordsFeatures, versionControl: checked}
              })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="auditTrail">Maintain audit trail</Label>
            <Switch
              id="auditTrail"
              checked={settings.patientRecordsFeatures.auditTrail}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                patientRecordsFeatures: {...settings.patientRecordsFeatures, auditTrail: checked}
              })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="twoFactor">Two-factor authentication</Label>
            <Switch
              id="twoFactor"
              checked={settings.securitySettings.twoFactorAuth}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                securitySettings: {...settings.securitySettings, twoFactorAuth: checked}
              })}
            />
          </div>
          <div>
            <Label htmlFor="sessionTimeout">Session timeout (minutes)</Label>
            <Input
              id="sessionTimeout"
              type="number"
              value={settings.securitySettings.sessionTimeout}
              onChange={(e) => setSettings({
                ...settings,
                securitySettings: {...settings.securitySettings, sessionTimeout: parseInt(e.target.value)}
              })}
            />
          </div>
          <div>
            <Label htmlFor="passwordExpiry">Password expiry (days)</Label>
            <Input
              id="passwordExpiry"
              type="number"
              value={settings.securitySettings.passwordExpiry}
              onChange={(e) => setSettings({
                ...settings,
                securitySettings: {...settings.securitySettings, passwordExpiry: parseInt(e.target.value)}
              })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Reminders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Dashboard Reminders</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="overdueNotes">Overdue notes reminders</Label>
            <Switch
              id="overdueNotes"
              checked={settings.dashboardReminders.overdueNotes}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                dashboardReminders: {...settings.dashboardReminders, overdueNotes: checked}
              })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="upcomingAppointments">Upcoming appointments</Label>
            <Switch
              id="upcomingAppointments"
              checked={settings.dashboardReminders.upcomingAppointments}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                dashboardReminders: {...settings.dashboardReminders, upcomingAppointments: checked}
              })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="billing">Billing reminders</Label>
            <Switch
              id="billing"
              checked={settings.dashboardReminders.billing}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                dashboardReminders: {...settings.dashboardReminders, billing: checked}
              })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Practice Logo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Image className="h-5 w-5" />
            <span>Practice Logo</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Upload a practice logo to be used on printed documents and patient portal.
            </p>
            <Button onClick={handleLogoUpload} variant="outline">
              Upload Logo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Activity Log</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Search and review user activity logs to track system access and changes.
            </p>
            <Button variant="outline">View Activity Log</Button>
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5" />
            <span>Change Your Password</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Update your password to maintain account security.
            </p>
            <Button onClick={handlePasswordChange} variant="outline">
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Display Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <span>Display Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="theme">Theme</Label>
            <Select value={settings.displayPreferences.theme} onValueChange={(value) => setSettings({
              ...settings,
              displayPreferences: {...settings.displayPreferences, theme: value}
            })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="fontSize">Font Size</Label>
            <Select value={settings.displayPreferences.fontSize} onValueChange={(value) => setSettings({
              ...settings,
              displayPreferences: {...settings.displayPreferences, fontSize: value}
            })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="compactMode">Compact mode</Label>
            <Switch
              id="compactMode"
              checked={settings.displayPreferences.compactMode}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                displayPreferences: {...settings.displayPreferences, compactMode: checked}
              })}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="px-8">
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default AccountAccessSettings;
