
import React from 'react';
import { CardHeader } from '@/components/basic/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Button } from '@/components/basic/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getCalendarTitle } from '../utils/calendarUtils';

type CalendarViewType = 'day' | 'week' | 'month';

interface CalendarHeaderProps {
  currentDate: Date;
  viewType: CalendarViewType;
  onViewTypeChange: (viewType: CalendarViewType) => void;
  onNavigateDate: (direction: 'prev' | 'next') => void;
  onTodayClick: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  viewType,
  onViewTypeChange,
  onNavigateDate,
  onTodayClick
}) => {
  return (
    <CardHeader className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
      <div className="flex items-center justify-between">
        <Select value={viewType} onValueChange={(value: CalendarViewType) => onViewTypeChange(value)}>
          <SelectTrigger className="w-32 bg-white/20 border-white/30 text-white backdrop-blur-sm hover:bg-white/30 transition-all duration-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border-0 shadow-2xl">
            <SelectItem value="day" className="hover:bg-blue-50 transition-colors">Day</SelectItem>
            <SelectItem value="week" className="hover:bg-blue-50 transition-colors">Week</SelectItem>
            <SelectItem value="month" className="hover:bg-blue-50 transition-colors">Month</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigateDate('prev')}
            className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm transition-all duration-200"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold min-w-[200px] text-center">
            {getCalendarTitle(currentDate, viewType)}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigateDate('next')}
            className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm transition-all duration-200"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onTodayClick}
          className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm transition-all duration-200"
        >
          Today
        </Button>
      </div>
    </CardHeader>
  );
};

export default CalendarHeader;
