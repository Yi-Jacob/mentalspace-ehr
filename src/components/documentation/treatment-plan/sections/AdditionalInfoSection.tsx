
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ValidatedTextarea from '@/components/form/ValidatedTextarea';
import { z } from 'zod';
import { TreatmentPlanFormData } from '../types/TreatmentPlanFormData';

interface AdditionalInfoSectionProps {
  formData: TreatmentPlanFormData;
  updateFormData: (updates: Partial<TreatmentPlanFormData>) => void;
}

const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Information</CardTitle>
      </CardHeader>
      <CardContent>
        <ValidatedTextarea
          id="additional-information"
          label="Additional Information"
          value={formData.additionalInformation}
          onChange={(value) => updateFormData({ additionalInformation: value })}
          validation={z.string().optional()}
          placeholder="Any additional information relevant to the treatment plan..."
          rows={6}
          maxLength={2000}
        />
      </CardContent>
    </Card>
  );
};

export default AdditionalInfoSection;
