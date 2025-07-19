
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getCalendarTitle } from '../utils/calendarUtils';

type CalendarViewType = 'day' | 'week' | 'month' | 'list';

interface CalendarNavigationProps {
  currentDate: Date;
  viewType: CalendarViewType;
  onNavigateDate: (direction: 'prev' | 'next') => void;
  onTodayClick: () => void;
}

const CalendarNavigation: React.FC<CalendarNavigationProps> = ({
  currentDate,
  viewType,
  onNavigateDate,
  onTodayClick
}) => {
  return (
    <div className="flex items-center justify-between mt-4">
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
  );
};

export default CalendarNavigation;
