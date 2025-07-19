
import React from 'react';
import { Label } from '@/components/shared/ui/label';
import { Checkbox } from '@/components/shared/ui/checkbox';

interface NoRiskCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const NoRiskCheckbox: React.FC<NoRiskCheckboxProps> = ({
  checked,
  onCheckedChange,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="noRiskPresent"
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
      <Label htmlFor="noRiskPresent">
        Patient denies all areas of risk. No contrary clinical indications present.
      </Label>
    </div>
  );
};
