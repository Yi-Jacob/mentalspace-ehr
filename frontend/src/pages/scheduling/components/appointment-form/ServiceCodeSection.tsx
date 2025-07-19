
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ServiceCodeSectionProps {
  value: string;
  onChange: (value: string) => void;
}

const ServiceCodeSection: React.FC<ServiceCodeSectionProps> = ({
  value,
  onChange
}) => {
  const serviceCodes = [
    { code: '90834', description: 'Psychotherapy, 45 min' },
    { code: '90837', description: 'Psychotherapy, 60 min' },
    { code: '90791', description: 'Psychiatric diagnostic evaluation' },
    { code: '90792', description: 'Psychiatric diagnostic evaluation with medical services' },
    { code: '90847', description: 'Family psychotherapy with patient present' },
    { code: '90853', description: 'Group psychotherapy' },
  ];

  return (
    <div className="space-y-2">
      <Label htmlFor="service_code">Service Code</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select service code" />
        </SelectTrigger>
        <SelectContent>
          {serviceCodes.map((service) => (
            <SelectItem key={service.code} value={service.code}>
              {service.code}: {service.description}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ServiceCodeSection;
