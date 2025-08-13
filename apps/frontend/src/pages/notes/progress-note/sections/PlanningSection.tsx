
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { SelectField } from '@/components/basic/select';
import { TextareaField } from '@/components/basic/textarea';
import { ProgressNoteFormData } from '@/types/noteType';
import { RECOMMENDATION_OPTIONS, PRESCRIBED_FREQUENCY_OPTIONS } from '@/types/enums/notesEnum';
import SmartTemplates from '../components/SmartTemplates';

interface PlanningSectionProps {
  formData: ProgressNoteFormData;
  updateFormData: (updates: Partial<ProgressNoteFormData>) => void;
}

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
          <TextareaField
            id="planContent"
            label="Plan for Future Sessions"
            value={formData.planContent || ''}
            onChange={(e) => updateFormData({ planContent: e.target.value })}
            placeholder="Document plans for future sessions, homework assignments, goals to work on, and any other therapeutic planning..."
            rows={6}
            className="min-h-[120px]"
          />
          
          <SmartTemplates
            fieldType="plan"
            currentFieldValue={formData.planContent}
            onInsertTemplate={(content) => updateFormData({ planContent: content })}
          />
          
          <div className="text-xs text-gray-500 mt-1">
            Tip: Include homework assignments, goals for next session, and any follow-up actions needed
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField
            label="Recommendation"
            value={formData.recommendation}
            onValueChange={(value: any) => updateFormData({ recommendation: value })}
            options={RECOMMENDATION_OPTIONS}
            placeholder="Select recommendation"
          />

          <SelectField
            label="Prescribed Frequency of Treatment"
            value={formData.prescribedFrequency}
            onValueChange={(value) => updateFormData({ prescribedFrequency: value })}
            options={PRESCRIBED_FREQUENCY_OPTIONS}
            placeholder="Select frequency"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanningSection;
