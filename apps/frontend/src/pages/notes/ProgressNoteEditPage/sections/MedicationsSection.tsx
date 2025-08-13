
import React from 'react';
import { TextareaField } from '@/components/basic/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { ProgressNoteFormData } from '@/types/noteType';

interface MedicationsSectionProps {
  formData: ProgressNoteFormData;
  updateFormData: (updates: Partial<ProgressNoteFormData>) => void;
}

const MedicationsSection: React.FC<MedicationsSectionProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Medications</CardTitle>
        <p className="text-sm text-gray-600">Document current medications and any changes discussed</p>
      </CardHeader>
      <CardContent>
        <TextareaField
          id="medicationsContent"
          label="Current medications, changes, compliance, and side effects discussed"
          value={formData.medicationsContent || ''}
          onChange={(e) => updateFormData({ medicationsContent: e.target.value })}
          placeholder="Document current medications, any changes made, medication compliance, side effects discussed, and client's response to medications..."
          rows={6}
        />
      </CardContent>
    </Card>
  );
};

export default MedicationsSection;
