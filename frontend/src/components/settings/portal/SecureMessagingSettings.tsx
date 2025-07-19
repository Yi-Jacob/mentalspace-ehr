
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/card';
import { Input } from '@/components/shared/ui/input';
import { Label } from '@/components/shared/ui/label';
import { Switch } from '@/components/shared/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/ui/select';
import { MessageSquare } from 'lucide-react';

interface SecureMessagingSettingsProps {
  settings: {
    enabled: boolean;
    allowPatientInitiated: boolean;
    responseTime: string;
    emailNotifications: boolean;
    maxFileSize: number;
    allowedFileTypes: string[];
    messageRetention: number;
  };
  onSettingsChange: (newSettings: any) => void;
}

const SecureMessagingSettings: React.FC<SecureMessagingSettingsProps> = ({ settings, onSettingsChange }) => {
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
          <MessageSquare className="h-5 w-5" />
          <span>Secure Messaging</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="messagingEnabled">Enable secure messaging</Label>
          <Switch
            id="messagingEnabled"
            checked={settings.enabled}
            onCheckedChange={(checked) => updateSetting('enabled', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="patientInitiated">Allow patient-initiated messages</Label>
          <Switch
            id="patientInitiated"
            checked={settings.allowPatientInitiated}
            onCheckedChange={(checked) => updateSetting('allowPatientInitiated', checked)}
          />
        </div>

        <div>
          <Label htmlFor="responseTime">Expected response time (hours)</Label>
          <Select value={settings.responseTime} onValueChange={(value) => updateSetting('responseTime', value)}>
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
            value={settings.maxFileSize}
            onChange={(e) => updateSetting('maxFileSize', parseInt(e.target.value))}
          />
        </div>

        <div>
          <Label htmlFor="allowedFileTypes">Allowed file types</Label>
          <Input
            id="allowedFileTypes"
            value={settings.allowedFileTypes.join(', ')}
            onChange={(e) => updateSetting('allowedFileTypes', e.target.value.split(',').map(item => item.trim()))}
          />
        </div>

        <div>
          <Label htmlFor="messageRetention">Message retention (days)</Label>
          <Input
            id="messageRetention"
            type="number"
            value={settings.messageRetention}
            onChange={(e) => updateSetting('messageRetention', parseInt(e.target.value))}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SecureMessagingSettings;
