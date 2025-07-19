
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/card';
import { Button } from '@/components/shared/ui/button';
import { Label } from '@/components/shared/ui/label';
import { Switch } from '@/components/shared/ui/switch';
import { MapPin } from 'lucide-react';

interface MultipleLocationsSettingsProps {
  settings: {
    enabled: boolean;
    defaultLocation: string;
    locations: any[];
    allowLocationSelection: boolean;
  };
  onSettingsChange: (newSettings: any) => void;
}

const MultipleLocationsSettings: React.FC<MultipleLocationsSettingsProps> = ({ settings, onSettingsChange }) => {
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
          <MapPin className="h-5 w-5" />
          <span>Multiple Practice Locations</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="multipleLocations">Enable multiple locations</Label>
          <Switch
            id="multipleLocations"
            checked={settings.enabled}
            onCheckedChange={(checked) => updateSetting('enabled', checked)}
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
            checked={settings.allowLocationSelection}
            onCheckedChange={(checked) => updateSetting('allowLocationSelection', checked)}
          />
        </div>

        {settings.enabled && (
          <div>
            <Button variant="outline">Manage Locations</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MultipleLocationsSettings;
