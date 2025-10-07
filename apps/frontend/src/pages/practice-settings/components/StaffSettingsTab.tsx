import React, { useState, useEffect } from 'react';
import { 
  Users, 
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

const StaffSettingsTab: React.FC = () => {
  const [formData, setFormData] = useState({
    requireBackgroundCheck: true,
    requireLicenseVerification: true,
    allowSelfScheduling: true,
    requireSupervisorApproval: false,
    maxConcurrentSessions: 8,
    defaultWorkHours: {
      start: '09:00',
      end: '17:00'
    },
    allowOvertime: true,
    requireTimeTracking: true,
    performanceReviewFrequency: 'quarterly',
    allowRemoteWork: true,
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
      
      // Load staff settings from the settings object
      const staffSettings = settings.staffSettings || {};
      setFormData({
        requireBackgroundCheck: staffSettings.requireBackgroundCheck ?? true,
        requireLicenseVerification: staffSettings.requireLicenseVerification ?? true,
        allowSelfScheduling: staffSettings.allowSelfScheduling ?? true,
        requireSupervisorApproval: staffSettings.requireSupervisorApproval ?? false,
        maxConcurrentSessions: staffSettings.maxConcurrentSessions ?? 8,
        defaultWorkHours: staffSettings.defaultWorkHours || { start: '09:00', end: '17:00' },
        allowOvertime: staffSettings.allowOvertime ?? true,
        requireTimeTracking: staffSettings.requireTimeTracking ?? true,
        performanceReviewFrequency: staffSettings.performanceReviewFrequency || 'quarterly',
        allowRemoteWork: staffSettings.allowRemoteWork ?? true,
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

  const handleWorkHoursChange = (field: 'start' | 'end', value: string) => {
    setFormData(prev => ({
      ...prev,
      defaultWorkHours: {
        ...prev.defaultWorkHours,
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const updateData: UpdatePracticeSettingsRequest = {
        staffSettings: formData,
      };

      const updatedSettings = await PracticeSettingsService.updatePracticeSettings(updateData);
      setOriginalData(updatedSettings);
      toast.success('Staff settings updated successfully');
    } catch (error) {
      console.error('Failed to update staff settings:', error);
      toast.error('Failed to update staff settings');
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = () => {
    if (!originalData) return false;
    
    const originalStaffSettings = originalData.staffSettings || {};
    return JSON.stringify(formData) !== JSON.stringify({
      requireBackgroundCheck: originalStaffSettings.requireBackgroundCheck ?? true,
      requireLicenseVerification: originalStaffSettings.requireLicenseVerification ?? true,
      allowSelfScheduling: originalStaffSettings.allowSelfScheduling ?? true,
      requireSupervisorApproval: originalStaffSettings.requireSupervisorApproval ?? false,
      maxConcurrentSessions: originalStaffSettings.maxConcurrentSessions ?? 8,
      defaultWorkHours: originalStaffSettings.defaultWorkHours || { start: '09:00', end: '17:00' },
      allowOvertime: originalStaffSettings.allowOvertime ?? true,
      requireTimeTracking: originalStaffSettings.requireTimeTracking ?? true,
      performanceReviewFrequency: originalStaffSettings.performanceReviewFrequency || 'quarterly',
      allowRemoteWork: originalStaffSettings.allowRemoteWork ?? true,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading staff settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Staff Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Staff Requirements</span>
          </CardTitle>
          <CardDescription>
            Configure requirements and verification processes for staff members.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="requireBackgroundCheck">Require Background Check</Label>
                <p className="text-sm text-gray-600">Require background check for new staff</p>
              </div>
              <Switch 
                checked={formData.requireBackgroundCheck} 
                onCheckedChange={(checked) => handleInputChange('requireBackgroundCheck', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="requireLicenseVerification">Require License Verification</Label>
                <p className="text-sm text-gray-600">Verify professional licenses</p>
              </div>
              <Switch 
                checked={formData.requireLicenseVerification} 
                onCheckedChange={(checked) => handleInputChange('requireLicenseVerification', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="requireSupervisorApproval">Require Supervisor Approval</Label>
                <p className="text-sm text-gray-600">Require supervisor approval for schedule changes</p>
              </div>
              <Switch 
                checked={formData.requireSupervisorApproval} 
                onCheckedChange={(checked) => handleInputChange('requireSupervisorApproval', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="requireTimeTracking">Require Time Tracking</Label>
                <p className="text-sm text-gray-600">Require staff to track their time</p>
              </div>
              <Switch 
                checked={formData.requireTimeTracking} 
                onCheckedChange={(checked) => handleInputChange('requireTimeTracking', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scheduling & Work */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduling & Work Policies</CardTitle>
          <CardDescription>
            Configure scheduling policies and work-related settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="allowSelfScheduling">Allow Self Scheduling</Label>
                <p className="text-sm text-gray-600">Allow staff to manage their own schedules</p>
              </div>
              <Switch 
                checked={formData.allowSelfScheduling} 
                onCheckedChange={(checked) => handleInputChange('allowSelfScheduling', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="allowOvertime">Allow Overtime</Label>
                <p className="text-sm text-gray-600">Allow staff to work overtime</p>
              </div>
              <Switch 
                checked={formData.allowOvertime} 
                onCheckedChange={(checked) => handleInputChange('allowOvertime', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="allowRemoteWork">Allow Remote Work</Label>
                <p className="text-sm text-gray-600">Allow staff to work remotely</p>
              </div>
              <Switch 
                checked={formData.allowRemoteWork} 
                onCheckedChange={(checked) => handleInputChange('allowRemoteWork', checked)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxConcurrentSessions">Max Concurrent Sessions</Label>
              <Input
                id="maxConcurrentSessions"
                type="number"
                min="1"
                max="20"
                value={formData.maxConcurrentSessions}
                onChange={(e) => handleInputChange('maxConcurrentSessions', parseInt(e.target.value) || 8)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Work Hours & Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Work Hours & Performance</CardTitle>
          <CardDescription>
            Configure default work hours and performance review settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workStartTime">Default Start Time</Label>
              <Input
                id="workStartTime"
                type="time"
                value={formData.defaultWorkHours.start}
                onChange={(e) => handleWorkHoursChange('start', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workEndTime">Default End Time</Label>
              <Input
                id="workEndTime"
                type="time"
                value={formData.defaultWorkHours.end}
                onChange={(e) => handleWorkHoursChange('end', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="performanceReviewFrequency">Performance Review Frequency</Label>
              <Select 
                value={formData.performanceReviewFrequency} 
                onValueChange={(value) => handleInputChange('performanceReviewFrequency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="semi-annually">Semi-Annually</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
              </Select>
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

export default StaffSettingsTab;
