
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { TreatmentPlanFormData } from '../types/TreatmentPlanFormData';

interface FrequencySectionProps {
  formData: TreatmentPlanFormData;
  updateFormData: (updates: Partial<TreatmentPlanFormData>) => void;
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
        <div>
          <Label htmlFor="prescribed-frequency">Prescribed Frequency of Treatment *</Label>
          <Input
            id="prescribed-frequency"
            value={formData.prescribedFrequency}
            onChange={(e) => updateFormData({ prescribedFrequency: e.target.value })}
            placeholder="e.g., Twice a Week"
          />
        </div>

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
