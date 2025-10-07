import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Save,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Label } from '@/components/basic/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/basic/card';
import { toast } from 'sonner';
import { PracticeSettingsService, PracticeSettings, UpdatePracticeSettingsRequest } from '@/services/practiceSettingsService';

const SchedulingTab: React.FC = () => {
  const [formData, setFormData] = useState({
    startWorkTime: '09:00',
    endWorkTime: '17:00',
    lunchStartTime: '12:00',
    lunchEndTime: '13:00',
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
      
      // Load scheduling settings from the settings object
      const schedulingSettings = settings.schedulingSettings || {};
      setFormData({
        startWorkTime: schedulingSettings.startWorkTime || '09:00',
        endWorkTime: schedulingSettings.endWorkTime || '17:00',
        lunchStartTime: schedulingSettings.lunchStartTime || '12:00',
        lunchEndTime: schedulingSettings.lunchEndTime || '13:00',
      });
    } catch (error) {
      console.error('Failed to load practice settings:', error);
      toast.error('Failed to load practice settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const updateData: UpdatePracticeSettingsRequest = {
        schedulingSettings: formData,
      };

      const updatedSettings = await PracticeSettingsService.updatePracticeSettings(updateData);
      setOriginalData(updatedSettings);
      toast.success('Scheduling settings updated successfully');
    } catch (error) {
      console.error('Failed to update scheduling settings:', error);
      toast.error('Failed to update scheduling settings');
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = () => {
    if (!originalData) return false;
    
    const originalSchedulingSettings = originalData.schedulingSettings || {};
    return JSON.stringify(formData) !== JSON.stringify({
      startWorkTime: originalSchedulingSettings.startWorkTime || '09:00',
      endWorkTime: originalSchedulingSettings.endWorkTime || '17:00',
      lunchStartTime: originalSchedulingSettings.lunchStartTime || '12:00',
      lunchEndTime: originalSchedulingSettings.lunchEndTime || '13:00',
    });
  };

  if (isLoading) {
  return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading scheduling settings...</span>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Work Schedule Settings */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Work Schedule Settings</span>
        </CardTitle>
        <CardDescription>
            Configure default work hours and lunch break times for your practice.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
              <Label htmlFor="startWorkTime">Start Work Time</Label>
                  <Input
                id="startWorkTime"
                    type="time"
                value={formData.startWorkTime}
                onChange={(e) => handleInputChange('startWorkTime', e.target.value)}
              />
              <p className="text-sm text-gray-600">
                Default start time for work schedules
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="endWorkTime">End Work Time</Label>
              <Input
                id="endWorkTime"
                type="time"
                value={formData.endWorkTime}
                onChange={(e) => handleInputChange('endWorkTime', e.target.value)}
              />
              <p className="text-sm text-gray-600">
                Default end time for work schedules
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lunchStartTime">Lunch Start Time</Label>
              <Input
                id="lunchStartTime"
                type="time"
                value={formData.lunchStartTime}
                onChange={(e) => handleInputChange('lunchStartTime', e.target.value)}
              />
              <p className="text-sm text-gray-600">
                Default lunch break start time
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lunchEndTime">Lunch End Time</Label>
              <Input
                id="lunchEndTime"
                type="time"
                value={formData.lunchEndTime}
                onChange={(e) => handleInputChange('lunchEndTime', e.target.value)}
              />
              <p className="text-sm text-gray-600">
                Default lunch break end time
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

export default SchedulingTab;
