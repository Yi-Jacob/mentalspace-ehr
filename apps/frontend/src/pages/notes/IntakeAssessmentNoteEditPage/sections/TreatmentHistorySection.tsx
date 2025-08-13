import React from 'react';
import { Label } from '@/components/basic/label';
import { RadioGroup, RadioGroupItem } from '@/components/basic/radio-group';
import { Checkbox } from '@/components/basic/checkbox';
import { TextareaField } from '@/components/basic/textarea';
import { IntakeFormData } from '@/types/noteType';
import { TREATMENT_TYPES } from '@/types/enums/notesEnum';

interface TreatmentHistorySectionProps {
  formData: IntakeFormData;
  updateFormData: (updates: Partial<IntakeFormData>) => void;
  clientData: any;
}

const TreatmentHistorySection: React.FC<TreatmentHistorySectionProps> = ({
  formData,
  updateFormData,
}) => {
  const handleTreatmentTypeChange = (type: string, checked: boolean) => {
    const updated = checked
      ? [...formData.treatmentTypes, type]
      : formData.treatmentTypes.filter(t => t !== type);
    updateFormData({ treatmentTypes: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">Prior Treatment History</Label>
        <RadioGroup
          value={formData.hasPriorTreatment.toString()}
          onValueChange={(value) => updateFormData({ hasPriorTreatment: value === 'true' })}
          className="mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="has-treatment" />
            <Label htmlFor="has-treatment">Client has prior treatment history</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="no-treatment" />
            <Label htmlFor="no-treatment">Client does not have prior treatment history</Label>
          </div>
        </RadioGroup>
      </div>

      {formData.hasPriorTreatment && (
        <div className="space-y-6 border-l-2 border-blue-200 pl-6">
          <div>
            <Label className="text-base font-medium">Treatment Types</Label>
            <p className="text-sm text-gray-600 mb-3">Select all types of treatment the client has received:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {TREATMENT_TYPES.map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`treatment-${type.value}`}
                    checked={formData.treatmentTypes.includes(type.value)}
                    onCheckedChange={(checked) => 
                      handleTreatmentTypeChange(type.value, checked as boolean)
                    }
                  />
                  <Label htmlFor={`treatment-${type.value}`} className="text-sm">
                    {type.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <TextareaField
            id="treatmentDetails"
            label="Treatment Details"
            placeholder="Provide details about previous treatment including providers, duration, specific therapies received, medications tried, etc..."
            value={formData.treatmentDetails}
            onChange={(e) => updateFormData({ treatmentDetails: e.target.value })}
            rows={4}
          />

          <TextareaField
            id="treatmentEffectiveness"
            label="Treatment Effectiveness"
            placeholder="Describe the effectiveness of previous treatments. What worked well? What didn't work? Any adverse reactions or concerns?"
            value={formData.treatmentEffectiveness}
            onChange={(e) => updateFormData({ treatmentEffectiveness: e.target.value })}
            rows={3}
          />
        </div>
      )}
    </div>
  );
};

export default TreatmentHistorySection;
