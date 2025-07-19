
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MessageCategoryFieldProps {
  messageCategory: 'clinical' | 'administrative' | 'urgent' | 'general';
  onCategoryChange: (value: 'clinical' | 'administrative' | 'urgent' | 'general') => void;
}

const MessageCategoryField: React.FC<MessageCategoryFieldProps> = ({
  messageCategory,
  onCategoryChange,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="category" className="text-sm font-medium">
        Category
      </Label>
      <Select value={messageCategory} onValueChange={onCategoryChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="general">General</SelectItem>
          <SelectItem value="clinical">Clinical</SelectItem>
          <SelectItem value="administrative">Administrative</SelectItem>
          <SelectItem value="urgent">Urgent</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default MessageCategoryField;
