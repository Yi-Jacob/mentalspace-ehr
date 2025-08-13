
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import ValidatedTextarea from '@/components/form/ValidatedTextarea';
import { z } from 'zod';
import { TreatmentPlanFormData } from '@/types/noteType';

interface PresentingProblemSectionProps {
  formData: TreatmentPlanFormData;
  updateFormData: (updates: Partial<TreatmentPlanFormData>) => void;
  clientData?: any;
}

const PresentingProblemSection: React.FC<PresentingProblemSectionProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Presenting Problem</CardTitle>
      </CardHeader>
      <CardContent>
        <ValidatedTextarea
          id="presenting-problem"
          label="Presenting Problem *"
          value={formData.presentingProblem}
          onChange={(value) => updateFormData({ presentingProblem: value })}
          validation={z.string().min(10, 'Presenting problem must be at least 10 characters')}
          placeholder="Describe the client's presenting problem and current symptoms..."
          required
          rows={6}
          maxLength={2000}
        />
      </CardContent>
    </Card>
  );
};

export default PresentingProblemSection;
