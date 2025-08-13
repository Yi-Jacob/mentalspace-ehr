import React, { useState } from 'react';
import { SelectField } from '@/components/basic/select';
import { Checkbox } from '@/components/basic/checkbox';
import { Label } from '@/components/basic/label';
import { IntakeFormData } from '@/types/noteType';
import ValidatedTextarea from '@/components/form/ValidatedTextarea';
import FormErrorBoundary from '@/components/FormErrorBoundary';
import { validationSchemas } from '@/utils/validation';
import { PRESENTING_PROBLEMS, SYMPTOM_ONSET_OPTIONS, SYMPTOM_SEVERITY_OPTIONS } from '@/types/enums/notesEnum';

interface PresentingProblemSectionProps {
  formData: IntakeFormData;
  updateFormData: (updates: Partial<IntakeFormData>) => void;
  clientData: any;
}

const PresentingProblemSection: React.FC<PresentingProblemSectionProps> = ({
  formData,
  updateFormData,
}) => {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleAdditionalConcernChange = (concern: string, checked: boolean) => {
    const updated = checked
      ? [...formData.additionalConcerns, concern]
      : formData.additionalConcerns.filter(c => c !== concern);
    updateFormData({ additionalConcerns: updated });
  };

  const handleValidationChange = (field: string) => (isValid: boolean, error?: string) => {
    setValidationErrors(prev => ({
      ...prev,
      [field]: error || ''
    }));
  };

  return (
    <FormErrorBoundary formName="Presenting Problem">
      <div className="space-y-6">
        <SelectField
          label="Primary Presenting Problem"
          value={formData.primaryProblem}
          onValueChange={(value) => updateFormData({ primaryProblem: value })}
          options={PRESENTING_PROBLEMS}
          placeholder="Select primary presenting problem"
          required
        />

        <div>
          <Label>Additional Concerns</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
            {PRESENTING_PROBLEMS.filter(p => p.value !== formData.primaryProblem).map((concern) => (
              <div key={concern.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`concern-${concern.value}`}
                  checked={formData.additionalConcerns.includes(concern.value)}
                  onCheckedChange={(checked) => 
                    handleAdditionalConcernChange(concern.value, checked as boolean)
                  }
                />
                <Label htmlFor={`concern-${concern.value}`} className="text-sm">
                  {concern.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Symptom Onset"
            value={formData.symptomOnset}
            onValueChange={(value) => updateFormData({ symptomOnset: value })}
            options={SYMPTOM_ONSET_OPTIONS}
            placeholder="When did symptoms begin?"
            required
          />

          <SelectField
            label="Symptom Severity"
            value={formData.symptomSeverity}
            onValueChange={(value) => updateFormData({ symptomSeverity: value })}
            options={SYMPTOM_SEVERITY_OPTIONS}
            placeholder="Select severity level"
            required
          />
        </div>

        <ValidatedTextarea
          id="detailedDescription"
          label="Detailed Description"
          value={formData.detailedDescription}
          onChange={(value) => updateFormData({ detailedDescription: value })}
          onValidationChange={handleValidationChange('detailedDescription')}
          validation={validationSchemas.requiredText}
          placeholder="Provide a detailed description of the presenting problem, including specific symptoms, triggers, and circumstances..."
          required
          rows={4}
        />

        <ValidatedTextarea
          id="impactOnFunctioning"
          label="Impact on Functioning"
          value={formData.impactOnFunctioning}
          onChange={(value) => updateFormData({ impactOnFunctioning: value })}
          onValidationChange={handleValidationChange('impactOnFunctioning')}
          validation={validationSchemas.requiredText}
          placeholder="Describe how the presenting problem affects the client's daily functioning, work, relationships, and quality of life..."
          required
          rows={3}
        />
      </div>
    </FormErrorBoundary>
  );
};

export default PresentingProblemSection;
