
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Code, 
  FileText, 
  Network
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DocumentationSettings: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    serviceCptCodes: {
      defaultCodes: ['90834', '90837', '90847', '90853'],
      customCodes: [],
      allowCustomCodes: true,
    },
    notesSettings: {
      autoSave: true,
      autoSaveInterval: 5,
      spellCheck: true,
      wordWrap: true,
      showWordCount: true,
      defaultTemplate: 'progress_note',
      requiredFields: ['presenting_problem', 'mental_status', 'plan'],
      signatureRequired: true,
      cosignatureRequired: false,
    },
    healthInformationExchange: {
      enabled: false,
      registries: [],
      autoQuery: false,
      shareLevel: 'minimal',
    }
  });

  const handleSave = () => {
    toast({
      title: 'Settings Saved',
      description: 'Documentation settings have been updated successfully.',
    });
  };

  const handleAddCptCode = () => {
    toast({
      title: 'Add CPT Code',
      description: 'CPT code management functionality would be implemented here.',
    });
  };

  const handleManageDictionary = () => {
    toast({
      title: 'Manage Dictionary',
      description: 'Spell check dictionary management would be implemented here.',
    });
  };

  const handleConnectHIE = () => {
    toast({
      title: 'Connect HIE',
      description: 'Health Information Exchange connection would be implemented here.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Service CPT Codes */}
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
              {settings.serviceCptCodes.defaultCodes.map((code, index) => (
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
              checked={settings.serviceCptCodes.allowCustomCodes}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                serviceCptCodes: {...settings.serviceCptCodes, allowCustomCodes: checked}
              })}
            />
          </div>

          <div>
            <Button onClick={handleAddCptCode} variant="outline">
              Add Custom CPT Code
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notes Settings */}
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
              checked={settings.notesSettings.autoSave}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                notesSettings: {...settings.notesSettings, autoSave: checked}
              })}
            />
          </div>

          <div>
            <Label htmlFor="autoSaveInterval">Auto-save interval (minutes)</Label>
            <Select value={settings.notesSettings.autoSaveInterval.toString()} onValueChange={(value) => setSettings({
              ...settings,
              notesSettings: {...settings.notesSettings, autoSaveInterval: parseInt(value)}
            })}>
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
              checked={settings.notesSettings.spellCheck}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                notesSettings: {...settings.notesSettings, spellCheck: checked}
              })}
            />
          </div>

          <div>
            <Button onClick={handleManageDictionary} variant="outline">
              Manage Spell Check Dictionary
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="wordWrap">Enable word wrap</Label>
            <Switch
              id="wordWrap"
              checked={settings.notesSettings.wordWrap}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                notesSettings: {...settings.notesSettings, wordWrap: checked}
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="showWordCount">Show word count</Label>
            <Switch
              id="showWordCount"
              checked={settings.notesSettings.showWordCount}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                notesSettings: {...settings.notesSettings, showWordCount: checked}
              })}
            />
          </div>

          <div>
            <Label htmlFor="defaultTemplate">Default note template</Label>
            <Select value={settings.notesSettings.defaultTemplate} onValueChange={(value) => setSettings({
              ...settings,
              notesSettings: {...settings.notesSettings, defaultTemplate: value}
            })}>
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
              checked={settings.notesSettings.signatureRequired}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                notesSettings: {...settings.notesSettings, signatureRequired: checked}
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="cosignatureRequired">Require co-signature for trainees</Label>
            <Switch
              id="cosignatureRequired"
              checked={settings.notesSettings.cosignatureRequired}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                notesSettings: {...settings.notesSettings, cosignatureRequired: checked}
              })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Health Information Exchange */}
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
              checked={settings.healthInformationExchange.enabled}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                healthInformationExchange: {...settings.healthInformationExchange, enabled: checked}
              })}
            />
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-4">
              Connect to Health Information Exchange registries to share and receive patient information securely with other healthcare providers.
            </p>
          </div>

          <div>
            <Label htmlFor="shareLevel">Information sharing level</Label>
            <Select value={settings.healthInformationExchange.shareLevel} onValueChange={(value) => setSettings({
              ...settings,
              healthInformationExchange: {...settings.healthInformationExchange, shareLevel: value}
            })}>
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
              checked={settings.healthInformationExchange.autoQuery}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                healthInformationExchange: {...settings.healthInformationExchange, autoQuery: checked}
              })}
            />
          </div>

          <div>
            <Button onClick={handleConnectHIE} variant="outline">
              Connect to HIE Registry
            </Button>
          </div>

          {settings.healthInformationExchange.registries.length === 0 && (
            <div className="text-sm text-gray-500">
              No HIE registries connected
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="px-8">
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default DocumentationSettings;
