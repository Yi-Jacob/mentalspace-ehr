
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Network } from 'lucide-react';

interface HealthInformationExchangeSettingsProps {
  settings: {
    enabled: boolean;
    registries: any[];
    autoQuery: boolean;
    shareLevel: string;
  };
  onSettingsChange: (newSettings: any) => void;
  onConnectHIE: () => void;
}

const HealthInformationExchangeSettings: React.FC<HealthInformationExchangeSettingsProps> = ({ 
  settings, 
  onSettingsChange, 
  onConnectHIE 
}) => {
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
          <Network className="h-5 w-5" />
          <span>Health Information Exchange</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="hieEnabled">Enable HIE integration</Label>
          <Switch
            id="hieEnabled"
            checked={settings.enabled}
            onCheckedChange={(checked) => updateSetting('enabled', checked)}
          />
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-4">
            Connect to Health Information Exchange registries to share and receive patient information securely with other healthcare providers.
          </p>
        </div>

        <div>
          <Label htmlFor="shareLevel">Information sharing level</Label>
          <Select 
            value={settings.shareLevel} 
            onValueChange={(value) => updateSetting('shareLevel', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="minimal">Minimal (Demographics only)</SelectItem>
              <SelectItem value="summary">Summary (Demographics + Care summaries)</SelectItem>
              <SelectItem value="detailed">Detailed (Full clinical records)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="autoQuery">Auto-query patient records</Label>
          <Switch
            id="autoQuery"
            checked={settings.autoQuery}
            onCheckedChange={(checked) => updateSetting('autoQuery', checked)}
          />
        </div>

        <div>
          <Button onClick={onConnectHIE} variant="outline">
            Connect to HIE Registry
          </Button>
        </div>

        {settings.registries.length === 0 && (
          <div className="text-sm text-gray-500">
            No HIE registries connected
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HealthInformationExchangeSettings;
