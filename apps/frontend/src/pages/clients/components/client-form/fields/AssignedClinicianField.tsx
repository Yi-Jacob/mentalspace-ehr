
import React from 'react';
import { Label } from '@/components/basic/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { ClientFormData } from '@/types/client';

interface AssignedClinicianFieldProps {
  formData: ClientFormData;
  setFormData: React.Dispatch<React.SetStateAction<ClientFormData>>;
}

export const AssignedClinicianField: React.FC<AssignedClinicianFieldProps> = ({ formData, setFormData }) => {
  return (
    <div>
      <Label htmlFor="assigned_clinician_id">Assigned Clinician</Label>
      <Select 
        value={formData.assigned_clinician_id} 
        onValueChange={(value) => setFormData(prev => ({...prev, assigned_clinician_id: value}))}
      >
        <SelectTrigger>
          <SelectValue placeholder="-- Unassigned --" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="unassigned">-- Unassigned --</SelectItem>
          {/* Future: Add clinicians from database */}
        </SelectContent>
      </Select>
    </div>
  );
};
