
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Label } from '@/components/basic/label';
import { Switch } from '@/components/basic/switch';
import { Textarea } from '@/components/basic/textarea';
import { Bell } from 'lucide-react';

interface AppointmentRemindersSettingsProps {
  settings: {
    enabled: boolean;
    emailReminders: boolean;
    smsReminders: boolean;
    reminderTiming: string[];
    customMessage: string;
    confirmationRequired: boolean;
  };
  onSettingsChange: (newSettings: any) => void;
}

const AppointmentRemindersSettings: React.FC<AppointmentRemindersSettingsProps> = ({ settings, onSettingsChange }) => {
  const updateSetting = (key: string, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  return (
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
            checked={settings.enabled}
            onCheckedChange={(checked) => updateSetting('enabled', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="emailReminders">Email reminders</Label>
          <Switch
            id="emailReminders"
            checked={settings.emailReminders}
            onCheckedChange={(checked) => updateSetting('emailReminders', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="smsReminders">SMS reminders</Label>
          <Switch
            id="smsReminders"
            checked={settings.smsReminders}
            onCheckedChange={(checked) => updateSetting('smsReminders', checked)}
          />
        </div>

        <div>
          <Label htmlFor="customMessage">Custom reminder message</Label>
          <Textarea
            id="customMessage"
            value={settings.customMessage}
            onChange={(e) => updateSetting('customMessage', e.target.value)}
            placeholder="Don't forget your appointment tomorrow at..."
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="confirmationRequired">Confirmation Required</Label>
          <Switch
            id="confirmationRequired"
            checked={settings.confirmationRequired}
            onCheckedChange={(checked) => updateSetting('confirmationRequired', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentRemindersSettings;
