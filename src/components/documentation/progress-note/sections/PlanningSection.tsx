
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressNoteFormData } from '../types/ProgressNoteFormData';

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
    <Card>
      <CardHeader>
        <CardTitle>Planning</CardTitle>
        <p className="text-sm text-gray-600">Plan for future sessions and treatment direction</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="planContent">Plan for Future Sessions</Label>
          <Textarea
            id="planContent"
            value={formData.planContent || ''}
            onChange={(e) => updateFormData({ planContent: e.target.value })}
            placeholder="Document plans for future sessions, homework assignments, goals to work on, and any other therapeutic planning..."
            rows={6}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="recommendation">Recommendation</Label>
          <Select
            value={formData.recommendation}
            onValueChange={(value: any) => updateFormData({ recommendation: value })}
          >
            <SelectTrigger>
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
          <Label htmlFor="prescribedFrequency">Prescribed Frequency of Treatment</Label>
          <Select
            value={formData.prescribedFrequency}
            onValueChange={(value) => updateFormData({ prescribedFrequency: value })}
          >
            <SelectTrigger>
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
      </CardContent>
    </Card>
  );
};

export default PlanningSection;
