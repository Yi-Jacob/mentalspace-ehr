
import React from 'react';
import { Label } from '@/components/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/ui/select';

interface FrequencySectionProps {
  value: string;
  onChange: (value: string) => void;
}

const FrequencySection: React.FC<FrequencySectionProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="frequency">Frequency</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="twice_weekly">Twice a Week</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="biweekly">Biweekly</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
          <SelectItem value="one_time">One Time</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FrequencySection;
