import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Save,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Label } from '@/components/basic/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/basic/card';
import { Switch } from '@/components/basic/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { toast } from 'sonner';
import { PracticeSettingsService, PracticeSettings, UpdatePracticeSettingsRequest } from '@/services/practiceSettingsService';

const ClientSettingsTab: React.FC = () => {
  const [formData, setFormData] = useState({
    requireIntakeForm: true,
    allowSelfRegistration: false,
    requireInsuranceVerification: true,
    allowOnlineScheduling: true,
    requireEmergencyContact: true,
    allowPortalAccess: true,
    dataRetentionYears: 7,
    allowTextReminders: true,
    allowEmailReminders: true,
    requireConsentForms: true,
    allowFileUploads: true,
    maxFileSizeMB: 10,
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
      
      // Load client settings from the settings object
      const clientSettings = settings.clientSettings || {};
      setFormData({
        requireIntakeForm: clientSettings.requireIntakeForm ?? true,
        allowSelfRegistration: clientSettings.allowSelfRegistration ?? false,
        requireInsuranceVerification: clientSettings.requireInsuranceVerification ?? true,
        allowOnlineScheduling: clientSettings.allowOnlineScheduling ?? true,
        requireEmergencyContact: clientSettings.requireEmergencyContact ?? true,
        allowPortalAccess: clientSettings.allowPortalAccess ?? true,
        dataRetentionYears: clientSettings.dataRetentionYears ?? 7,
        allowTextReminders: clientSettings.allowTextReminders ?? true,
        allowEmailReminders: clientSettings.allowEmailReminders ?? true,
        requireConsentForms: clientSettings.requireConsentForms ?? true,
        allowFileUploads: clientSettings.allowFileUploads ?? true,
        maxFileSizeMB: clientSettings.maxFileSizeMB ?? 10,
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
      
      const updateData: UpdatePracticeSettingsRequest = {
        clientSettings: formData,
      };

      const updatedSettings = await PracticeSettingsService.updatePracticeSettings(updateData);
      setOriginalData(updatedSettings);
      toast.success('Client settings updated successfully');
    } catch (error) {
      console.error('Failed to update client settings:', error);
      toast.error('Failed to update client settings');
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = () => {
    if (!originalData) return false;
    
    const originalClientSettings = originalData.clientSettings || {};
    return JSON.stringify(formData) !== JSON.stringify({
      requireIntakeForm: originalClientSettings.requireIntakeForm ?? true,
      allowSelfRegistration: originalClientSettings.allowSelfRegistration ?? false,
      requireInsuranceVerification: originalClientSettings.requireInsuranceVerification ?? true,
      allowOnlineScheduling: originalClientSettings.allowOnlineScheduling ?? true,
      requireEmergencyContact: originalClientSettings.requireEmergencyContact ?? true,
      allowPortalAccess: originalClientSettings.allowPortalAccess ?? true,
      dataRetentionYears: originalClientSettings.dataRetentionYears ?? 7,
      allowTextReminders: originalClientSettings.allowTextReminders ?? true,
      allowEmailReminders: originalClientSettings.allowEmailReminders ?? true,
      requireConsentForms: originalClientSettings.requireConsentForms ?? true,
      allowFileUploads: originalClientSettings.allowFileUploads ?? true,
      maxFileSizeMB: originalClientSettings.maxFileSizeMB ?? 10,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading client settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Client Onboarding */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserCheck className="h-5 w-5" />
            <span>Client Onboarding</span>
          </CardTitle>
          <CardDescription>
            Configure the client onboarding process and requirements.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="requireIntakeForm">Require Intake Form</Label>
                <p className="text-sm text-gray-600">Require clients to complete intake form</p>
              </div>
              <Switch 
                checked={formData.requireIntakeForm} 
                onCheckedChange={(checked) => handleInputChange('requireIntakeForm', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="allowSelfRegistration">Allow Self Registration</Label>
                <p className="text-sm text-gray-600">Allow clients to register themselves</p>
              </div>
              <Switch 
                checked={formData.allowSelfRegistration} 
                onCheckedChange={(checked) => handleInputChange('allowSelfRegistration', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="requireInsuranceVerification">Require Insurance Verification</Label>
                <p className="text-sm text-gray-600">Verify insurance before first appointment</p>
              </div>
              <Switch 
                checked={formData.requireInsuranceVerification} 
                onCheckedChange={(checked) => handleInputChange('requireInsuranceVerification', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="requireEmergencyContact">Require Emergency Contact</Label>
                <p className="text-sm text-gray-600">Require emergency contact information</p>
              </div>
              <Switch 
                checked={formData.requireEmergencyContact} 
                onCheckedChange={(checked) => handleInputChange('requireEmergencyContact', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="requireConsentForms">Require Consent Forms</Label>
                <p className="text-sm text-gray-600">Require signed consent forms</p>
              </div>
              <Switch 
                checked={formData.requireConsentForms} 
                onCheckedChange={(checked) => handleInputChange('requireConsentForms', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Portal & Access */}
      <Card>
        <CardHeader>
          <CardTitle>Client Portal & Access</CardTitle>
          <CardDescription>
            Configure client portal access and self-service options.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="allowPortalAccess">Allow Portal Access</Label>
                <p className="text-sm text-gray-600">Allow clients to access their portal</p>
              </div>
              <Switch 
                checked={formData.allowPortalAccess} 
                onCheckedChange={(checked) => handleInputChange('allowPortalAccess', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="allowOnlineScheduling">Allow Online Scheduling</Label>
                <p className="text-sm text-gray-600">Allow clients to schedule appointments online</p>
              </div>
              <Switch 
                checked={formData.allowOnlineScheduling} 
                onCheckedChange={(checked) => handleInputChange('allowOnlineScheduling', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="allowFileUploads">Allow File Uploads</Label>
                <p className="text-sm text-gray-600">Allow clients to upload files</p>
              </div>
              <Switch 
                checked={formData.allowFileUploads} 
                onCheckedChange={(checked) => handleInputChange('allowFileUploads', checked)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxFileSizeMB">Max File Size (MB)</Label>
              <Input
                id="maxFileSizeMB"
                type="number"
                min="1"
                max="100"
                value={formData.maxFileSizeMB}
                onChange={(e) => handleInputChange('maxFileSizeMB', parseInt(e.target.value) || 10)}
                disabled={!formData.allowFileUploads}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Communication & Data */}
      <Card>
        <CardHeader>
          <CardTitle>Communication & Data Management</CardTitle>
          <CardDescription>
            Configure communication preferences and data retention policies.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="allowTextReminders">Allow Text Reminders</Label>
                <p className="text-sm text-gray-600">Send appointment reminders via text</p>
              </div>
              <Switch 
                checked={formData.allowTextReminders} 
                onCheckedChange={(checked) => handleInputChange('allowTextReminders', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="allowEmailReminders">Allow Email Reminders</Label>
                <p className="text-sm text-gray-600">Send appointment reminders via email</p>
              </div>
              <Switch 
                checked={formData.allowEmailReminders} 
                onCheckedChange={(checked) => handleInputChange('allowEmailReminders', checked)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataRetentionYears">Data Retention (years)</Label>
              <Input
                id="dataRetentionYears"
                type="number"
                min="1"
                max="20"
                value={formData.dataRetentionYears}
                onChange={(e) => handleInputChange('dataRetentionYears', parseInt(e.target.value) || 7)}
              />
              <p className="text-sm text-gray-600">
                How long to retain client data after last contact
              </p>
            </div>
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

export default ClientSettingsTab;
