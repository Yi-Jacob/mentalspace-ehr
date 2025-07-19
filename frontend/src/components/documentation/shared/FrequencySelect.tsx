
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/ui/select';
import { Label } from '@/components/shared/ui/label';

interface FrequencySelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const FREQUENCY_OPTIONS = [
  { value: 'twice-weekly', label: 'Twice a week' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'bi-weekly', label: 'Bi-weekly (every 2 weeks)' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'as-needed', label: 'As needed' },
  { value: 'daily', label: 'Daily' },
  { value: 'three-times-weekly', label: 'Three times a week' },
  { value: 'four-times-weekly', label: 'Four times a week' },
  { value: 'intensive-daily', label: 'Intensive daily' },
];

const FrequencySelect: React.FC<FrequencySelectProps> = ({
  label,
  value,
  onChange,
  required = false,
}) => {
  return (
    <div>
      <Label htmlFor="frequency-select">
        {label} {required && '*'}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="mt-1">
          <SelectValue placeholder="Select frequency" />
        </SelectTrigger>
        <SelectContent className="bg-white z-50">
          {FREQUENCY_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FrequencySelect;
