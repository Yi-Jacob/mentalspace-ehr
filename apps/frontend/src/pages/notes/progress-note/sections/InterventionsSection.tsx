
import React from 'react';
import { Checkbox } from '@/components/basic/checkbox';
import { Label } from '@/components/basic/label';
import { TextareaField } from '@/components/basic/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { ProgressNoteFormData } from '@/types/noteType';
import { INTERVENTION_STRATEGIES } from '@/types/enums/notesEnum';
import SmartTemplates from '../components/SmartTemplates';

interface InterventionsSectionProps {
  formData: ProgressNoteFormData;
  updateFormData: (updates: Partial<ProgressNoteFormData>) => void;
}

const InterventionsSection: React.FC<InterventionsSectionProps> = ({
  formData,
  updateFormData,
}) => {
  const handleInterventionChange = (intervention: string, checked: boolean) => {
    const currentInterventions = formData.selectedInterventions || [];
    let updatedInterventions;

    if (checked) {
      updatedInterventions = [...currentInterventions, intervention];
    } else {
      updatedInterventions = currentInterventions.filter(i => i !== intervention);
    }

    updateFormData({ selectedInterventions: updatedInterventions });
  };

  return (
    <Card className="border-l-4 border-l-orange-500">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-transparent">
        <CardTitle className="text-orange-900">Interventions Used</CardTitle>
        <p className="text-sm text-orange-700">Select all interventions used during this session</p>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h4 className="font-medium text-orange-900 mb-3">Evidence-Based Interventions</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {INTERVENTION_STRATEGIES.map((intervention) => (
              <div key={intervention.value} className="flex items-center space-x-2">
                <Checkbox
                  id={intervention.value}
                  checked={formData.selectedInterventions?.includes(intervention.value) || false}
                  onCheckedChange={(checked) => handleInterventionChange(intervention.value, checked as boolean)}
                />
                <Label htmlFor={intervention.value} className="text-sm cursor-pointer">
                  {intervention.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <TextareaField
            id="otherInterventions"
            label="Other Interventions & Session Details"
            value={formData.otherInterventions || ''}
            onChange={(e) => updateFormData({ otherInterventions: e.target.value })}
            placeholder="Describe any other interventions used, specific techniques applied, client responses, and detailed session content..."
            rows={4}
            className="min-h-[100px]"
          />
          
          <SmartTemplates
            fieldType="intervention"
            currentFieldValue={formData.otherInterventions}
            onInsertTemplate={(content) => updateFormData({ otherInterventions: content })}
          />
          
          <div className="text-xs text-gray-500 mt-1">
            Tip: Include specific techniques, client responses, homework assigned, and any modifications made
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InterventionsSection;
