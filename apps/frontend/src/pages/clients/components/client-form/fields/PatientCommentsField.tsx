
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ClientFormData } from '@/types/client';

interface PatientCommentsFieldProps {
  formData: ClientFormData;
  setFormData: React.Dispatch<React.SetStateAction<ClientFormData>>;
}

export const PatientCommentsField: React.FC<PatientCommentsFieldProps> = ({ formData, setFormData }) => {
  return (
    <div>
      <Label htmlFor="patient_comments">Patient Comments</Label>
      <Textarea
        id="patient_comments"
        value={formData.patient_comments}
        onChange={(e) => setFormData(prev => ({...prev, patient_comments: e.target.value}))}
        placeholder="Non-clinical information such as scheduling or billing comments..."
        rows={3}
      />
    </div>
  );
};
