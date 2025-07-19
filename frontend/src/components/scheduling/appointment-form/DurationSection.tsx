
import React from 'react';
import { Label } from '@/components/shared/ui/label';
import { Input } from '@/components/shared/ui/input';

interface DurationSectionProps {
  value: number;
  onChange: (value: number) => void;
}

const DurationSection: React.FC<DurationSectionProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="duration">Duration</Label>
      <div className="flex items-center space-x-2">
        <Input
          id="duration"
          type="number"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          className="w-20"
          min="1"
          max="480"
        />
        <span className="text-sm text-gray-500">minutes</span>
      </div>
    </div>
  );
};

export default DurationSection;
