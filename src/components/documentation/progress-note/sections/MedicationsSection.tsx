
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressNoteFormData } from '../types/ProgressNoteFormData';

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
        <div className="space-y-2">
          <Label htmlFor="medicationsContent">
            Current medications, changes, compliance, and side effects discussed
          </Label>
          <Textarea
            id="medicationsContent"
            value={formData.medicationsContent || ''}
            onChange={(e) => updateFormData({ medicationsContent: e.target.value })}
            placeholder="Document current medications, any changes made, medication compliance, side effects discussed, and client's response to medications..."
            rows={6}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationsSection;
