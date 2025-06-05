
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { User, Shield, Building, Clock } from 'lucide-react';
import { usePracticeSettings } from '@/hooks/usePracticeSettings';

const AccountAccessSettings: React.FC = () => {
  const { settings, updateSettings, isLoading, isUpdating } = usePracticeSettings();

  const practiceInfo = {
    practice_name: settings?.practice_name || '',
    practice_address: settings?.practice_address || {},
    practice_contact: settings?.practice_contact || {},
    business_hours: settings?.business_hours || {},
    security_settings: settings?.security_settings || {}
  };

  const updatePracticeInfo = (field: string, value: any) => {
    updateSettings({ [field]: value });
  };

  const updateNestedSetting = (category: string, field: string, value: any) => {
    const currentSettings = settings?.[category as keyof typeof settings] || {};
    updateSettings({
      [category]: {
        ...currentSettings,
        [field]: value
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Practice Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>Practice Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="practiceName">Practice Name</Label>
            <Input
              id="practiceName"
              value={practiceInfo.practice_name}
              onChange={(e) => updatePracticeInfo('practice_name', e.target.value)}
              placeholder="Enter practice name"
            />
          </div>

          <div>
            <Label htmlFor="practiceAddress">Practice Address</Label>
            <Textarea
              id="practiceAddress"
              value={practiceInfo.practice_address.full_address || ''}
              onChange={(e) => updateNestedSetting('practice_address', 'full_address', e.target.value)}
              placeholder="Enter practice address"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="practicePhone">Phone Number</Label>
              <Input
                id="practicePhone"
                value={practiceInfo.practice_contact.phone || ''}
                onChange={(e) => updateNestedSetting('practice_contact', 'phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
            <div>
              <Label htmlFor="practiceEmail">Email</Label>
              <Input
                id="practiceEmail"
                type="email"
                value={practiceInfo.practice_contact.email || ''}
                onChange={(e) => updateNestedSetting('practice_contact', 'email', e.target.value)}
                placeholder="practice@example.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Business Hours</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="openTime">Opening Time</Label>
              <Input
                id="openTime"
                type="time"
                value={practiceInfo.business_hours.open_time || '09:00'}
                onChange={(e) => updateNestedSetting('business_hours', 'open_time', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="closeTime">Closing Time</Label>
              <Input
                id="closeTime"
                type="time"
                value={practiceInfo.business_hours.close_time || '17:00'}
                onChange={(e) => updateNestedSetting('business_hours', 'close_time', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="timezone">Time Zone</Label>
            <Select 
              value={practiceInfo.business_hours.timezone || 'America/New_York'}
              onValueChange={(value) => updateNestedSetting('business_hours', 'timezone', value)}
            >
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

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="twoFactor">Enable Two-Factor Authentication</Label>
            <Switch
              id="twoFactor"
              checked={practiceInfo.security_settings.two_factor_enabled || false}
              onCheckedChange={(checked) => updateNestedSetting('security_settings', 'two_factor_enabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="sessionTimeout">Auto-logout after inactivity</Label>
            <Switch
              id="sessionTimeout"
              checked={practiceInfo.security_settings.session_timeout_enabled || false}
              onCheckedChange={(checked) => updateNestedSetting('security_settings', 'session_timeout_enabled', checked)}
            />
          </div>

          <div>
            <Label htmlFor="sessionTimeoutMinutes">Session timeout (minutes)</Label>
            <Select 
              value={String(practiceInfo.security_settings.session_timeout_minutes || 30)}
              onValueChange={(value) => updateNestedSetting('security_settings', 'session_timeout_minutes', Number(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button disabled={isUpdating}>
          {isUpdating ? 'Saving...' : 'Settings Auto-Saved'}
        </Button>
      </div>
    </div>
  );
};

export default AccountAccessSettings;
