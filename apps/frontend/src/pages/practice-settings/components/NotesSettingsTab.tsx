import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Save,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Label } from '@/components/basic/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/basic/card';
import { Switch } from '@/components/basic/switch';
import { Textarea } from '@/components/basic/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { toast } from 'sonner';
import { PracticeSettingsService, PracticeSettings, UpdatePracticeSettingsRequest } from '@/services/practiceSettingsService';
import { CPT_CODES_BY_TYPE } from '@/types/enums/notesEnum';
import { availableDiagnoses } from '@/data/diagnoses';

const NotesSettingsTab: React.FC = () => {
  const [formData, setFormData] = useState({
    autoSave: true,
    autoSaveInterval: 30,
    requireApproval: false,
    allowDraftNotes: true,
    noteRetentionDays: 2555, // 7 years default
    defaultNoteTemplate: '',
    allowNoteSharing: false,
    requireCoSignature: false,
    lockNotesAfterDays: 7,
    openaiApiKey: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [originalData, setOriginalData] = useState<PracticeSettings | null>(null);

  useEffect(() => {
    loadPracticeSettings();
  }, []);

  const loadPracticeSettings = async () => {
    try {
      setIsLoading(true);
      const settings = await PracticeSettingsService.getPracticeSettings();
      setOriginalData(settings);
      
      // Load note settings from the settings object
      const noteSettings = settings.noteSettings || {};
      const aiSettings = settings.aiSettings || {};
      setFormData({
        autoSave: noteSettings.autoSave ?? true,
        autoSaveInterval: noteSettings.autoSaveInterval ?? 30,
        requireApproval: noteSettings.requireApproval ?? false,
        allowDraftNotes: noteSettings.allowDraftNotes ?? true,
        noteRetentionDays: noteSettings.noteRetentionDays ?? 2555,
        defaultNoteTemplate: noteSettings.defaultNoteTemplate || '',
        allowNoteSharing: noteSettings.allowNoteSharing ?? false,
        requireCoSignature: noteSettings.requireCoSignature ?? false,
        lockNotesAfterDays: noteSettings.lockNotesAfterDays ?? 7,
        openaiApiKey: aiSettings.openaiApiKey || '',
      });
    } catch (error) {
      console.error('Failed to load practice settings:', error);
      toast.error('Failed to load practice settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Separate note settings and AI settings
      const { openaiApiKey, ...noteSettings } = formData;
      
      const updateData: UpdatePracticeSettingsRequest = {
        noteSettings: noteSettings,
        aiSettings: {
          openaiApiKey: openaiApiKey,
        },
      };

      const updatedSettings = await PracticeSettingsService.updatePracticeSettings(updateData);
      setOriginalData(updatedSettings);
      toast.success('Notes settings updated successfully');
    } catch (error) {
      console.error('Failed to update notes settings:', error);
      toast.error('Failed to update notes settings');
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = () => {
    if (!originalData) return false;
    
    const originalNoteSettings = originalData.noteSettings || {};
    const originalAiSettings = originalData.aiSettings || {};
    return JSON.stringify(formData) !== JSON.stringify({
      autoSave: originalNoteSettings.autoSave ?? true,
      autoSaveInterval: originalNoteSettings.autoSaveInterval ?? 30,
      requireApproval: originalNoteSettings.requireApproval ?? false,
      allowDraftNotes: originalNoteSettings.allowDraftNotes ?? true,
      noteRetentionDays: originalNoteSettings.noteRetentionDays ?? 2555,
      defaultNoteTemplate: originalNoteSettings.defaultNoteTemplate || '',
      allowNoteSharing: originalNoteSettings.allowNoteSharing ?? false,
      requireCoSignature: originalNoteSettings.requireCoSignature ?? false,
      lockNotesAfterDays: originalNoteSettings.lockNotesAfterDays ?? 7,
      openaiApiKey: originalAiSettings.openaiApiKey || '',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading notes settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Note Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Note Management</span>
          </CardTitle>
          <CardDescription>
            Configure how notes are created, saved, and managed in your practice.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoSave">Auto Save</Label>
                <p className="text-sm text-gray-600">Automatically save notes as you type</p>
              </div>
              <Switch 
                checked={formData.autoSave} 
                onCheckedChange={(checked) => handleInputChange('autoSave', checked)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="autoSaveInterval">Auto Save Interval (seconds)</Label>
              <Input
                id="autoSaveInterval"
                type="number"
                min="10"
                max="300"
                value={formData.autoSaveInterval}
                onChange={(e) => handleInputChange('autoSaveInterval', parseInt(e.target.value) || 30)}
                disabled={!formData.autoSave}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Settings */}
      <Card>
        <CardHeader>
          <CardTitle>AI Assistant Settings</CardTitle>
          <CardDescription>
            Configure AI assistant settings for note generation and analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="openaiApiKey">OpenAI API Key</Label>
            <Input
              id="openaiApiKey"
              type="password"
              value={formData.openaiApiKey}
              onChange={(e) => handleInputChange('openaiApiKey', e.target.value)}
              placeholder="sk-..."
            />
            <p className="text-sm text-gray-600">
              API key for OpenAI services used in AI assistant features.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CPT Codes Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Available CPT Codes</CardTitle>
          <CardDescription>
            Reference list of available CPT codes for billing and documentation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-h-96 overflow-y-auto">
            {Object.entries(CPT_CODES_BY_TYPE).map(([type, codes]) => (
              <div key={type} className="mb-6">
                <h4 className="font-semibold text-sm text-gray-700 mb-2 capitalize">
                  {type.replace('_', ' ')}
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {codes.map((code) => (
                    <div key={code.value} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                      <span className="font-mono text-blue-600">{code.value}</span>
                      <span className="text-gray-700">{code.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Diagnoses Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Available Diagnoses</CardTitle>
          <CardDescription>
            Reference list of available diagnoses for clinical documentation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-h-96 overflow-y-auto">
            {Object.entries(
              availableDiagnoses.reduce((acc, diagnosis) => {
                if (!acc[diagnosis.category]) {
                  acc[diagnosis.category] = [];
                }
                acc[diagnosis.category].push(diagnosis);
                return acc;
              }, {} as Record<string, typeof availableDiagnoses>)
            ).map(([category, diagnoses]) => (
              <div key={category} className="mb-6">
                <h4 className="font-semibold text-sm text-gray-700 mb-2">{category}</h4>
                <div className="grid grid-cols-1 gap-2">
                  {diagnoses.map((diagnosis) => (
                    <div key={diagnosis.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                      <span className="font-mono text-green-600">{diagnosis.code}</span>
                      <span className="text-gray-700">{diagnosis.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={!hasChanges() || isSaving}
          className="min-w-[120px]"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default NotesSettingsTab;
