
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/ui/select';

type CalendarViewType = 'day' | 'week' | 'month' | 'list';

interface CalendarViewSelectorProps {
  viewType: CalendarViewType;
  onViewTypeChange: (viewType: CalendarViewType) => void;
}

const CalendarViewSelector: React.FC<CalendarViewSelectorProps> = ({
  viewType,
  onViewTypeChange
}) => {
  return (
    <Select value={viewType} onValueChange={(value: CalendarViewType) => onViewTypeChange(value)}>
      <SelectTrigger className="w-32 bg-white/20 border-white/30 text-white backdrop-blur-sm hover:bg-white/30 transition-all duration-200">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-white border-0 shadow-2xl">
        <SelectItem value="day" className="hover:bg-blue-50 transition-colors">Day</SelectItem>
        <SelectItem value="week" className="hover:bg-blue-50 transition-colors">Week</SelectItem>
        <SelectItem value="month" className="hover:bg-blue-50 transition-colors">Month</SelectItem>
        <SelectItem value="list" className="hover:bg-blue-50 transition-colors">List</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default CalendarViewSelector;
