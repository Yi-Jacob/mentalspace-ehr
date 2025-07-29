
import React from 'react';
import { Label } from '@/components/basic/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';

interface MessagePriorityFieldProps {
  messagePriority: 'low' | 'normal' | 'high' | 'urgent';
  onPriorityChange: (value: 'low' | 'normal' | 'high' | 'urgent') => void;
}

const MessagePriorityField: React.FC<MessagePriorityFieldProps> = ({
  messagePriority,
  onPriorityChange,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="priority" className="text-sm font-medium">
        Priority
      </Label>
      <Select value={messagePriority} onValueChange={onPriorityChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="normal">Normal</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="urgent">Urgent</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default MessagePriorityField;
