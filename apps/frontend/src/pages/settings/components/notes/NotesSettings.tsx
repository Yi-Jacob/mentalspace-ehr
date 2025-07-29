
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Button } from '@/components/basic/button';
import { Label } from '@/components/basic/label';
import { Switch } from '@/components/basic/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { FileText } from 'lucide-react';

interface NotesSettingsProps {
  settings: {
    autoSave: boolean;
    autoSaveInterval: number;
    spellCheck: boolean;
    wordWrap: boolean;
    showWordCount: boolean;
    defaultTemplate: string;
    requiredFields: string[];
    signatureRequired: boolean;
    cosignatureRequired: boolean;
  };
  onSettingsChange: (newSettings: any) => void;
  onManageDictionary: () => void;
}

const NotesSettings: React.FC<NotesSettingsProps> = ({ 
  settings, 
  onSettingsChange, 
  onManageDictionary 
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
          <FileText className="h-5 w-5" />
          <span>Notes Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="autoSave">Auto-save notes</Label>
          <Switch
            id="autoSave"
            checked={settings.autoSave}
            onCheckedChange={(checked) => updateSetting('autoSave', checked)}
          />
        </div>

        <div>
          <Label htmlFor="autoSaveInterval">Auto-save interval (minutes)</Label>
          <Select 
            value={settings.autoSaveInterval.toString()} 
            onValueChange={(value) => updateSetting('autoSaveInterval', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 minute</SelectItem>
              <SelectItem value="3">3 minutes</SelectItem>
              <SelectItem value="5">5 minutes</SelectItem>
              <SelectItem value="10">10 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="spellCheck">Enable spell check</Label>
          <Switch
            id="spellCheck"
            checked={settings.spellCheck}
            onCheckedChange={(checked) => updateSetting('spellCheck', checked)}
          />
        </div>

        <div>
          <Button onClick={onManageDictionary} variant="outline">
            Manage Spell Check Dictionary
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="wordWrap">Enable word wrap</Label>
          <Switch
            id="wordWrap"
            checked={settings.wordWrap}
            onCheckedChange={(checked) => updateSetting('wordWrap', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="showWordCount">Show word count</Label>
          <Switch
            id="showWordCount"
            checked={settings.showWordCount}
            onCheckedChange={(checked) => updateSetting('showWordCount', checked)}
          />
        </div>

        <div>
          <Label htmlFor="defaultTemplate">Default note template</Label>
          <Select 
            value={settings.defaultTemplate} 
            onValueChange={(value) => updateSetting('defaultTemplate', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="progress_note">Progress Note</SelectItem>
              <SelectItem value="intake_assessment">Intake Assessment</SelectItem>
              <SelectItem value="treatment_plan">Treatment Plan</SelectItem>
              <SelectItem value="contact_note">Contact Note</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="signatureRequired">Require electronic signature</Label>
          <Switch
            id="signatureRequired"
            checked={settings.signatureRequired}
            onCheckedChange={(checked) => updateSetting('signatureRequired', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="cosignatureRequired">Require co-signature for trainees</Label>
          <Switch
            id="cosignatureRequired"
            checked={settings.cosignatureRequired}
            onCheckedChange={(checked) => updateSetting('cosignatureRequired', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default NotesSettings;
