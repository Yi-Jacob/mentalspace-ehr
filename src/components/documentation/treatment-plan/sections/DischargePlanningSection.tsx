
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ValidatedTextarea from '@/components/form/ValidatedTextarea';
import { z } from 'zod';
import { TreatmentPlanFormData } from '../types/TreatmentPlanFormData';

interface DischargePlanningSectionProps {
  formData: TreatmentPlanFormData;
  updateFormData: (updates: Partial<TreatmentPlanFormData>) => void;
}

const DischargePlanningSection: React.FC<DischargePlanningSectionProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Discharge Criteria/Planning</CardTitle>
      </CardHeader>
      <CardContent>
        <ValidatedTextarea
          id="discharge-criteria"
          label="Discharge Criteria/Planning *"
          value={formData.dischargeCriteria}
          onChange={(value) => updateFormData({ dischargeCriteria: value })}
          validation={z.string().min(10, 'Discharge criteria must be at least 10 characters')}
          placeholder="Describe the criteria and plan for discharge..."
          required
          rows={6}
          maxLength={2000}
        />
      </CardContent>
    </Card>
  );
};

export default DischargePlanningSection;
