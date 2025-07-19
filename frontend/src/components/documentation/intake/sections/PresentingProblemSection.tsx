import React, { useState } from 'react';
import { Label } from '@/components/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/ui/select';
import { Checkbox } from '@/components/shared/ui/checkbox';
import { IntakeFormData } from '../types/IntakeFormData';
import ValidatedTextarea from '@/components/form/ValidatedTextarea';
import FormErrorBoundary from '@/components/FormErrorBoundary';
import { validationSchemas } from '@/utils/validation';

const PRESENTING_PROBLEMS = [
  'Anxiety',
  'Depression',
  'Trauma / PTSD',
  'Stress Management',
  'Relationship Issues',
  'Grief / Loss',
  'Anger Management',
  'Substance Use / Addiction',
  'Behavioral Issues',
  'Bipolar Symptoms',
  'Psychosis / Schizophrenia',
  'Eating Disorder Concerns',
  'Personality Disorder Concerns',
  'Sexual / Gender Identity Concerns',
  'Other',
];

const SYMPTOM_ONSET_OPTIONS = [
  'Recent (Less than 1 month)',
  'Acute (1-3 months)',
  'Subacute (3-6 months)',
  'Chronic (6+ months)',
  'Episodic (Comes and goes)',
  'Longstanding (Years)',
  'Since childhood',
  'Unknown / Not specified',
];

const SEVERITY_OPTIONS = [
  'Mild',
  'Moderate',
  'Severe',
  'Extreme',
  'Fluctuating',
];

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
        <div>
          <Label htmlFor="primaryProblem">Primary Presenting Problem *</Label>
          <Select
            value={formData.primaryProblem}
            onValueChange={(value) => updateFormData({ primaryProblem: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select primary presenting problem" />
            </SelectTrigger>
            <SelectContent>
              {PRESENTING_PROBLEMS.map((problem) => (
                <SelectItem key={problem} value={problem}>
                  {problem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Additional Concerns</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
            {PRESENTING_PROBLEMS.filter(p => p !== formData.primaryProblem).map((concern) => (
              <div key={concern} className="flex items-center space-x-2">
                <Checkbox
                  id={`concern-${concern}`}
                  checked={formData.additionalConcerns.includes(concern)}
                  onCheckedChange={(checked) => 
                    handleAdditionalConcernChange(concern, checked as boolean)
                  }
                />
                <Label htmlFor={`concern-${concern}`} className="text-sm">
                  {concern}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="symptomOnset">Symptom Onset *</Label>
            <Select
              value={formData.symptomOnset}
              onValueChange={(value) => updateFormData({ symptomOnset: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="When did symptoms begin?" />
              </SelectTrigger>
              <SelectContent>
                {SYMPTOM_ONSET_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="symptomSeverity">Symptom Severity *</Label>
            <Select
              value={formData.symptomSeverity}
              onValueChange={(value) => updateFormData({ symptomSeverity: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select severity level" />
              </SelectTrigger>
              <SelectContent>
                {SEVERITY_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
