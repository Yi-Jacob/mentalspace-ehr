
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClientFormData } from '@/types/client';

interface PatientInfoFieldsProps {
  formData: ClientFormData;
  setFormData: React.Dispatch<React.SetStateAction<ClientFormData>>;
}

export const PatientInfoFields: React.FC<PatientInfoFieldsProps> = ({ formData, setFormData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="first_name">First Name *</Label>
        <Input
          id="first_name"
          value={formData.first_name}
          onChange={(e) => setFormData(prev => ({...prev, first_name: e.target.value}))}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="last_name">Last Name *</Label>
        <Input
          id="last_name"
          value={formData.last_name}
          onChange={(e) => setFormData(prev => ({...prev, last_name: e.target.value}))}
          required
        />
      </div>

      <div>
        <Label htmlFor="middle_name">Middle Name</Label>
        <Input
          id="middle_name"
          value={formData.middle_name}
          onChange={(e) => setFormData(prev => ({...prev, middle_name: e.target.value}))}
        />
      </div>

      <div>
        <Label htmlFor="suffix">Suffix</Label>
        <Input
          id="suffix"
          value={formData.suffix}
          onChange={(e) => setFormData(prev => ({...prev, suffix: e.target.value}))}
          placeholder="Jr., Sr., III, etc."
        />
      </div>

      <div>
        <Label htmlFor="preferred_name">Preferred Name</Label>
        <Input
          id="preferred_name"
          value={formData.preferred_name}
          onChange={(e) => setFormData(prev => ({...prev, preferred_name: e.target.value}))}
        />
      </div>

      <div>
        <Label htmlFor="pronouns">Pronouns</Label>
        <Input
          id="pronouns"
          value={formData.pronouns}
          onChange={(e) => setFormData(prev => ({...prev, pronouns: e.target.value}))}
          placeholder="he/him, she/her, they/them, etc."
        />
      </div>
    </div>
  );
};
