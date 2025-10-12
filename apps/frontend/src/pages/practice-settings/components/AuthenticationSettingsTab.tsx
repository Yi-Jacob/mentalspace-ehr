import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Save,
  Loader2,
  Mail,
  Clock
} from 'lucide-react';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Label } from '@/components/basic/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/basic/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { toast } from 'sonner';
import { PracticeSettingsService, PracticeSettings, UpdatePracticeSettingsRequest } from '@/services/practiceSettingsService';

const AuthenticationSettingsTab: React.FC = () => {
  const [formData, setFormData] = useState({
    jwtExpiresIn: '24h',
    emailFrom: '',
    passwordResetExpirationMinutes: 60,
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
      
      // Load auth settings from the settings object
      const authSettings = settings.authSettings || {};
      setFormData({
        jwtExpiresIn: authSettings.jwtExpiresIn || '24h',
        emailFrom: authSettings.emailFrom || '',
        passwordResetExpirationMinutes: authSettings.passwordResetExpirationMinutes || 60,
      });
    } catch (error) {
      console.error('Failed to load practice settings:', error);
      toast.error('Failed to load practice settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const updateData: UpdatePracticeSettingsRequest = {
        authSettings: formData,
      };

      const updatedSettings = await PracticeSettingsService.updatePracticeSettings(updateData);
      setOriginalData(updatedSettings);
      toast.success('Authentication settings updated successfully');
    } catch (error) {
      console.error('Failed to update authentication settings:', error);
      toast.error('Failed to update authentication settings');
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = () => {
    if (!originalData) return false;
    
    const originalAuthSettings = originalData.authSettings || {};
    return JSON.stringify(formData) !== JSON.stringify({
      jwtExpiresIn: originalAuthSettings.jwtExpiresIn || '24h',
      emailFrom: originalAuthSettings.emailFrom || '',
      passwordResetExpirationMinutes: originalAuthSettings.passwordResetExpirationMinutes || 60,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading authentication settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* JWT Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5" />
            <span>JWT Token Settings</span>
          </CardTitle>
          <CardDescription>
            Configure JWT token expiration and security settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jwtExpiresIn">JWT Token Expiration</Label>
            <Select 
              value={formData.jwtExpiresIn} 
              onValueChange={(value) => handleInputChange('jwtExpiresIn', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select expiration time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15m">15 Minutes</SelectItem>
                <SelectItem value="30m">30 Minutes</SelectItem>
                <SelectItem value="1h">1 Hour</SelectItem>
                <SelectItem value="6h">6 Hours</SelectItem>
                <SelectItem value="12h">12 Hours</SelectItem>
                <SelectItem value="24h">24 Hours</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-600">
              How long JWT tokens remain valid before requiring re-authentication.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Email Configuration</span>
          </CardTitle>
          <CardDescription>
            Configure email settings for system notifications and communications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emailFrom">Email From Address</Label>
            <Input
              id="emailFrom"
              type="email"
              value={formData.emailFrom}
              onChange={(e) => handleInputChange('emailFrom', e.target.value)}
              placeholder="noreply@practice.com"
            />
            <p className="text-sm text-gray-600">
              The email address that system notifications and password reset emails will be sent from.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Password Reset Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Password Reset Settings</span>
          </CardTitle>
          <CardDescription>
            Configure password reset token expiration and security settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="passwordResetExpirationMinutes">Password Reset Token Expiration (Minutes)</Label>
            <Input
              id="passwordResetExpirationMinutes"
              type="number"
              min="5"
              max="1440"
              value={formData.passwordResetExpirationMinutes}
              onChange={(e) => handleInputChange('passwordResetExpirationMinutes', parseInt(e.target.value) || 60)}
              placeholder="60"
            />
            <p className="text-sm text-gray-600">
              How long password reset tokens remain valid (5 minutes to 24 hours).
            </p>
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

export default AuthenticationSettingsTab;
