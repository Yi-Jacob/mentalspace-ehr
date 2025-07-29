
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Input } from '@/components/basic/input';
import { Label } from '@/components/basic/label';
import { Checkbox } from '@/components/basic/checkbox';
import { TreatmentPlanFormData } from '../types/TreatmentPlanFormData';
import FrequencySelect from '../../components/shared/FrequencySelect';

interface FrequencySectionProps {
  formData: TreatmentPlanFormData;
  updateFormData: (updates: Partial<TreatmentPlanFormData>) => void;
  clientData?: any;
}

const FrequencySection: React.FC<FrequencySectionProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Frequency of Treatment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FrequencySelect
          label="Prescribed Frequency of Treatment"
          value={formData.prescribedFrequency}
          onChange={(value) => updateFormData({ prescribedFrequency: value })}
          required
        />

        <div className="flex items-center space-x-2">
          <Checkbox
            id="medical-necessity"
            checked={formData.medicalNecessityDeclaration}
            onCheckedChange={(checked) => 
              updateFormData({ medicalNecessityDeclaration: checked as boolean })
            }
          />
          <Label htmlFor="medical-necessity" className="text-sm">
            I declare that these services are medically necessary and appropriate to the recipient's diagnosis and needs.
          </Label>
        </div>
      </CardContent>
    </Card>
  );
};

export default FrequencySection;
