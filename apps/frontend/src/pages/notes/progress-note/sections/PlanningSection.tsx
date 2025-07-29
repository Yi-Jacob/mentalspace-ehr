
import React from 'react';
import { Label } from '@/components/basic/label';
import { Textarea } from '@/components/basic/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { ProgressNoteFormData } from '../types/ProgressNoteFormData';
import SmartTemplates from '../components/SmartTemplates';

interface PlanningSectionProps {
  formData: ProgressNoteFormData;
  updateFormData: (updates: Partial<ProgressNoteFormData>) => void;
}

const PRESCRIBED_FREQUENCY_OPTIONS = [
  'As Needed',
  'Twice a Week',
  'Weekly',
  'Every 2 Weeks',
  'Every 4 Weeks',
  'Every Month',
  'Every 2 Months',
  'Every 3 Months',
  'Every 4 Months'
];

const PlanningSection: React.FC<PlanningSectionProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <Card className="border-l-4 border-l-purple-500">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-transparent">
        <CardTitle className="text-purple-900">Planning</CardTitle>
        <p className="text-sm text-purple-700">Plan for future sessions and treatment direction</p>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-3">
          <Label htmlFor="planContent" className="text-sm font-medium">Plan for Future Sessions</Label>
          
          <SmartTemplates
            fieldType="plan"
            currentFieldValue={formData.planContent}
            onInsertTemplate={(content) => updateFormData({ planContent: content })}
          />
          
          <Textarea
            id="planContent"
            value={formData.planContent || ''}
            onChange={(e) => updateFormData({ planContent: e.target.value })}
            placeholder="Document plans for future sessions, homework assignments, goals to work on, and any other therapeutic planning..."
            rows={6}
            className="min-h-[120px]"
          />
          <div className="text-xs text-gray-500 mt-1">
            Tip: Include homework assignments, goals for next session, and any follow-up actions needed
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="recommendation" className="text-sm font-medium">Recommendation</Label>
            <Select
              value={formData.recommendation}
              onValueChange={(value: any) => updateFormData({ recommendation: value })}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select recommendation" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="Continue current therapeutic focus">
                  Continue current therapeutic focus
                </SelectItem>
                <SelectItem value="Change treatment goals or objectives">
                  Change treatment goals or objectives
                </SelectItem>
                <SelectItem value="Terminate treatment">
                  Terminate treatment
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prescribedFrequency" className="text-sm font-medium">Prescribed Frequency of Treatment</Label>
            <Select
              value={formData.prescribedFrequency}
              onValueChange={(value) => updateFormData({ prescribedFrequency: value })}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {PRESCRIBED_FREQUENCY_OPTIONS.map((frequency) => (
                  <SelectItem key={frequency} value={frequency}>
                    {frequency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanningSection;
