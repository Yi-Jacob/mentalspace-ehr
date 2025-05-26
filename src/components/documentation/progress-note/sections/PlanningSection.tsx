
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
            <SelectContent>
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
          <Label htmlFor="prescribedFrequency">Prescribed Frequency</Label>
          <Input
            id="prescribedFrequency"
            value={formData.prescribedFrequency || ''}
            onChange={(e) => updateFormData({ prescribedFrequency: e.target.value })}
            placeholder="e.g., Weekly, Bi-weekly, Monthly"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanningSection;
