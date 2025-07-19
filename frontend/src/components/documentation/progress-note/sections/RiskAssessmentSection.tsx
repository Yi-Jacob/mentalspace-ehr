
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/card';
import { Button } from '@/components/shared/ui/button';
import { Plus } from 'lucide-react';
import { ProgressNoteFormData } from '../types/ProgressNoteFormData';
import { RiskAreaCard } from './risk-assessment/RiskAreaCard';
import { NoRiskCheckbox } from './risk-assessment/NoRiskCheckbox';

interface RiskAssessmentSectionProps {
  formData: ProgressNoteFormData;
  updateFormData: (updates: Partial<ProgressNoteFormData>) => void;
}

const AREA_OF_RISK_OPTIONS = [
  'Inability to care for self',
  'Inability to care for others',
  'Aggression toward others',
  'Aggression toward property',
  'Self-harm',
  'Suicide',
  'Violence',
  'Substance abuse',
  'Elopement/Wandering',
  'Sexual acting out',
  'Fire setting',
  'Other'
];

const RiskAssessmentSection: React.FC<RiskAssessmentSectionProps> = ({
  formData,
  updateFormData,
}) => {
  const addRiskArea = () => {
    const newRiskArea = {
      areaOfRisk: '',
      levelOfRisk: 'Low' as const,
      intentToAct: 'No' as const,
      planToAct: 'No' as const,
      meansToAct: 'No' as const,
      riskFactors: '',
      protectiveFactors: '',
      additionalDetails: '',
    };
    
    updateFormData({
      riskAreas: [...(formData.riskAreas || []), newRiskArea]
    });
  };

  const updateRiskArea = (index: number, updates: any) => {
    const updatedRiskAreas = [...(formData.riskAreas || [])];
    updatedRiskAreas[index] = { ...updatedRiskAreas[index], ...updates };
    updateFormData({ riskAreas: updatedRiskAreas });
  };

  const removeRiskArea = (index: number) => {
    const updatedRiskAreas = formData.riskAreas?.filter((_, i) => i !== index) || [];
    updateFormData({ riskAreas: updatedRiskAreas });
  };

  const handleNoRiskChange = (checked: boolean) => {
    updateFormData({ 
      noRiskPresent: checked,
      riskAreas: checked ? [] : formData.riskAreas
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Assessment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <NoRiskCheckbox
          checked={formData.noRiskPresent || false}
          onCheckedChange={handleNoRiskChange}
        />

        {!formData.noRiskPresent && (
          <div className="space-y-6">
            {formData.riskAreas?.map((riskArea, index) => (
              <RiskAreaCard
                key={index}
                riskArea={riskArea}
                index={index}
                onUpdate={updateRiskArea}
                onRemove={removeRiskArea}
                areaOfRiskOptions={AREA_OF_RISK_OPTIONS}
              />
            ))}

            <Button type="button" onClick={addRiskArea} variant="outline" className="text-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Area of Risk
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RiskAssessmentSection;
