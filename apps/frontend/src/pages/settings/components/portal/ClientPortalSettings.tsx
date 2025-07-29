
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Input } from '@/components/basic/input';
import { Label } from '@/components/basic/label';
import { Switch } from '@/components/basic/switch';
import { Textarea } from '@/components/basic/textarea';
import { Monitor } from 'lucide-react';

interface ClientPortalSettingsProps {
  settings: {
    enabled: boolean;
    allowSelfScheduling: boolean;
    allowCancellations: boolean;
    requireConfirmation: boolean;
    customWelcomeMessage: string;
    portalDomain: string;
    allowDocumentUpload: boolean;
    showAppointmentHistory: boolean;
    enablePaymentPortal: boolean;
  };
  onSettingsChange: (newSettings: any) => void;
}

const ClientPortalSettings: React.FC<ClientPortalSettingsProps> = ({ settings, onSettingsChange }) => {
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
          <Monitor className="h-5 w-5" />
          <span>Client Portal</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="portalEnabled">Enable client portal</Label>
          <Switch
            id="portalEnabled"
            checked={settings.enabled}
            onCheckedChange={(checked) => updateSetting('enabled', checked)}
          />
        </div>
        
        <div>
          <Label htmlFor="portalDomain">Portal Domain</Label>
          <Input
            id="portalDomain"
            value={settings.portalDomain}
            onChange={(e) => updateSetting('portalDomain', e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="selfScheduling">Allow self-scheduling</Label>
          <Switch
            id="selfScheduling"
            checked={settings.allowSelfScheduling}
            onCheckedChange={(checked) => updateSetting('allowSelfScheduling', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="allowCancellations">Allow appointment cancellations</Label>
          <Switch
            id="allowCancellations"
            checked={settings.allowCancellations}
            onCheckedChange={(checked) => updateSetting('allowCancellations', checked)}
          />
        </div>

        <div>
          <Label htmlFor="welcomeMessage">Custom welcome message</Label>
          <Textarea
            id="welcomeMessage"
            value={settings.customWelcomeMessage}
            onChange={(e) => updateSetting('customWelcomeMessage', e.target.value)}
            placeholder="Welcome to our patient portal..."
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="allowDocumentUpload">Allow document uploads</Label>
          <Switch
            id="allowDocumentUpload"
            checked={settings.allowDocumentUpload}
            onCheckedChange={(checked) => updateSetting('allowDocumentUpload', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="showAppointmentHistory">Show appointment history</Label>
          <Switch
            id="showAppointmentHistory"
            checked={settings.showAppointmentHistory}
            onCheckedChange={(checked) => updateSetting('showAppointmentHistory', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="enablePaymentPortal">Enable payment portal</Label>
          <Switch
            id="enablePaymentPortal"
            checked={settings.enablePaymentPortal}
            onCheckedChange={(checked) => updateSetting('enablePaymentPortal', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientPortalSettings;
