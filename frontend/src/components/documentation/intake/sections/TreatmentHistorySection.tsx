import React from 'react';
import { Label } from '@/components/shared/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/shared/ui/radio-group';
import { Checkbox } from '@/components/shared/ui/checkbox';
import { Textarea } from '@/components/shared/ui/textarea';
import { IntakeFormData } from '../types/IntakeFormData';

const TREATMENT_TYPES = [
  'Individual Therapy',
  'Group Therapy',
  'Family Therapy',
  'Couples Therapy',
  'Psychiatric Medication',
  'Substance Abuse Treatment',
  'Inpatient Hospitalization',
  'Partial Hospitalization (PHP)',
  'Intensive Outpatient Program (IOP)',
  'Support Group',
  'Other',
];

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
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`treatment-${type}`}
                    checked={formData.treatmentTypes.includes(type)}
                    onCheckedChange={(checked) => 
                      handleTreatmentTypeChange(type, checked as boolean)
                    }
                  />
                  <Label htmlFor={`treatment-${type}`} className="text-sm">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="treatmentDetails">Treatment Details</Label>
            <Textarea
              id="treatmentDetails"
              placeholder="Provide details about previous treatment including providers, duration, specific therapies received, medications tried, etc..."
              value={formData.treatmentDetails}
              onChange={(e) => updateFormData({ treatmentDetails: e.target.value })}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="treatmentEffectiveness">Treatment Effectiveness</Label>
            <Textarea
              id="treatmentEffectiveness"
              placeholder="Describe the effectiveness of previous treatments. What worked well? What didn't work? Any adverse reactions or concerns?"
              value={formData.treatmentEffectiveness}
              onChange={(e) => updateFormData({ treatmentEffectiveness: e.target.value })}
              rows={3}
            />
          </div>
        </div>
      )}

      {!formData.hasPriorTreatment && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-700">
            Client reports no prior treatment history. This will be documented in the intake assessment.
          </p>
        </div>
      )}
    </div>
  );
};

export default TreatmentHistorySection;
