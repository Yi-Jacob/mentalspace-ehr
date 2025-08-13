
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { SelectField } from '@/components/basic/select';
import { Checkbox } from '@/components/basic/checkbox';
import { Label } from '@/components/basic/label';
import { TreatmentPlanFormData } from '@/types/noteType';
import { SESSION_FREQUENCY_OPTIONS, SESSION_DURATION_OPTIONS, MODALITY_OPTIONS } from '@/types/enums/notesEnum';

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Session Frequency"
            value={formData.sessionFrequency}
            onValueChange={(value) => updateFormData({ sessionFrequency: value })}
            options={SESSION_FREQUENCY_OPTIONS}
            placeholder="Select session frequency"
          />

          <SelectField
            label="Session Duration"
            value={formData.sessionDuration}
            onValueChange={(value) => updateFormData({ sessionDuration: value })}
            options={SESSION_DURATION_OPTIONS}
            placeholder="Select session duration"
          />
        </div>

        <SelectField
          label="Treatment Modality"
          value={formData.modality}
          onValueChange={(value) => updateFormData({ modality: value })}
          options={MODALITY_OPTIONS}
          placeholder="Select treatment modality"
        />

        <SelectField
          label="Prescribed Frequency of Treatment"
          value={formData.prescribedFrequency}
          onValueChange={(value) => updateFormData({ prescribedFrequency: value })}
          options={SESSION_FREQUENCY_OPTIONS}
          placeholder="Select prescribed frequency"
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
