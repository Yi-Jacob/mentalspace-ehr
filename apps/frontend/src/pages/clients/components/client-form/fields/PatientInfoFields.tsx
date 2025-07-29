
import React from 'react';
import { Input } from '@/components/basic/input';
import { Label } from '@/components/basic/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { ClientFormData } from '@/types/client';

interface PatientInfoFieldsProps {
  formData: ClientFormData;
  setFormData: React.Dispatch<React.SetStateAction<ClientFormData>>;
}

export const PatientInfoFields: React.FC<PatientInfoFieldsProps> = ({ formData, setFormData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="firstName">First Name *</Label>
        <Input
          id="firstName"
          value={formData.firstName}
          onChange={(e) => setFormData(prev => ({...prev, firstName: e.target.value}))}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="lastName">Last Name *</Label>
        <Input
          id="lastName"
          value={formData.lastName}
          onChange={(e) => setFormData(prev => ({...prev, lastName: e.target.value}))}
          required
        />
      </div>

      <div>
        <Label htmlFor="middleName">Middle Name</Label>
        <Input
          id="middleName"
          value={formData.middleName}
          onChange={(e) => setFormData(prev => ({...prev, middleName: e.target.value}))}
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
        <Label htmlFor="preferredName">Preferred Name</Label>
        <Input
          id="preferredName"
          value={formData.preferredName}
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
