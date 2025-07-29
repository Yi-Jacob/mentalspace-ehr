
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Clinician {
  id: string;
  first_name: string;
  last_name: string;
}

interface ClinicianSectionProps {
  value: string;
  onChange: (value: string) => void;
  clinicians?: Clinician[];
}

const ClinicianSection: React.FC<ClinicianSectionProps> = ({
  value,
  onChange,
  clinicians
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="clinician">Clinician</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a clinician" />
        </SelectTrigger>
        <SelectContent>
          {clinicians?.map((clinician) => (
            <SelectItem key={clinician.id} value={clinician.id}>
              {clinician.first_name} {clinician.last_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ClinicianSection;
