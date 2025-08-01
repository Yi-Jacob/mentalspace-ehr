import React from 'react';
import { Checkbox } from '@/components/basic/checkbox';
import { Label } from '@/components/basic/label';

interface CheckboxItem {
  id: string;
  label: string;
  description?: string;
  displayName?: string;
}

interface CheckboxGroupProps {
  title: string;
  items: CheckboxItem[];
  checkedItems: string[];
  onToggle: (id: string) => void;
  showDescriptions?: boolean;
  className?: string;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  title,
  items,
  checkedItems,
  onToggle,
  showDescriptions = false,
  className = ""
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="font-semibold text-lg text-gray-700 border-b border-gray-200 pb-2">
        {title}
      </h3>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
            <Checkbox
              id={item.id}
              checked={checkedItems.includes(item.id)}
              onCheckedChange={() => onToggle(item.id)}
            />
            <div className="flex-1">
              <Label htmlFor={item.id} className="font-medium text-gray-700 cursor-pointer">
                {item.displayName || item.label}
              </Label>
              {showDescriptions && item.description && (
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckboxGroup; 