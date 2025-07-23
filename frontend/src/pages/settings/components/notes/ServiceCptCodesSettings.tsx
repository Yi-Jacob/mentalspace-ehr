
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Code } from 'lucide-react';

interface ServiceCptCodesSettingsProps {
  settings: {
    defaultCodes: string[];
    customCodes: string[];
    allowCustomCodes: boolean;
  };
  onSettingsChange: (newSettings: any) => void;
  onAddCptCode: () => void;
}

const ServiceCptCodesSettings: React.FC<ServiceCptCodesSettingsProps> = ({ 
  settings, 
  onSettingsChange, 
  onAddCptCode 
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
          <Code className="h-5 w-5" />
          <span>Service CPT Codes</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Default CPT Codes</Label>
          <div className="mt-2 space-y-2">
            {settings.defaultCodes.map((code, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded">
                <span className="font-mono">{code}</span>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="allowCustomCodes">Allow custom CPT codes</Label>
          <Switch
            id="allowCustomCodes"
            checked={settings.allowCustomCodes}
            onCheckedChange={(checked) => updateSetting('allowCustomCodes', checked)}
          />
        </div>

        <div>
          <Button onClick={onAddCptCode} variant="outline">
            Add Custom CPT Code
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCptCodesSettings;
