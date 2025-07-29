
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Label } from '@/components/basic/label';
import { Switch } from '@/components/basic/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Calendar } from 'lucide-react';

interface CalendarSyncSettingsProps {
  settings: {
    googleCalendar: boolean;
    outlook365: boolean;
    appleCalendar: boolean;
    syncInterval: number;
    twoWaySync: boolean;
  };
  onSettingsChange: (newSettings: any) => void;
}

const CalendarSyncSettings: React.FC<CalendarSyncSettingsProps> = ({ settings, onSettingsChange }) => {
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
          <Calendar className="h-5 w-5" />
          <span>Sync Calendars With Other Applications</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="googleCalendar">Google Calendar</Label>
          <Switch
            id="googleCalendar"
            checked={settings.googleCalendar}
            onCheckedChange={(checked) => updateSetting('googleCalendar', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="outlook365">Outlook 365</Label>
          <Switch
            id="outlook365"
            checked={settings.outlook365}
            onCheckedChange={(checked) => updateSetting('outlook365', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="appleCalendar">Apple Calendar</Label>
          <Switch
            id="appleCalendar"
            checked={settings.appleCalendar}
            onCheckedChange={(checked) => updateSetting('appleCalendar', checked)}
          />
        </div>

        <div>
          <Label htmlFor="syncInterval">Sync interval (minutes)</Label>
          <Select value={settings.syncInterval.toString()} onValueChange={(value) => updateSetting('syncInterval', parseInt(value))}>
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
            checked={settings.twoWaySync}
            onCheckedChange={(checked) => updateSetting('twoWaySync', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarSyncSettings;
