
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface TelehealthSectionProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

const TelehealthSection: React.FC<TelehealthSectionProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="telehealth">Telehealth</Label>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="telehealth"
          checked={value}
          onCheckedChange={(checked) => onChange(!!checked)}
        />
        <Label htmlFor="telehealth" className="text-sm font-normal">
          Use TherapyNotes Telehealth
        </Label>
      </div>
    </div>
  );
};

export default TelehealthSection;
