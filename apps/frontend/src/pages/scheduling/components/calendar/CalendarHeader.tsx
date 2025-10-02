import React from 'react';
import { Button } from '@/components/basic/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getCalendarTitle } from '../utils/calendarUtils';

type CalendarViewType = 'day' | 'week' | 'month';

interface CalendarHeaderProps {
  currentDate: Date;
  viewType: CalendarViewType;
  onNavigateDate: (direction: 'prev' | 'next') => void;
  onTodayClick: () => void;
  onViewChange: (view: CalendarViewType) => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  viewType,
  onNavigateDate,
  onTodayClick,
  onViewChange
}) => {
  return (
    <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="flex items-center justify-between px-4 py-3 rounded-t-lg">
        {/* Left side - Navigation and calendar title */}
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigateDate('prev')}
            className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm transition-all duration-200"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">
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
        
        {/* Right side - View type tabs */}
        <div className="flex items-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onTodayClick}
            className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm transition-all duration-200 mr-4 rounded"
          >
            Today
          </Button>
          
          {/* View type tabs */}
          <div className="flex">
            {[
              { key: 'month', label: 'Month' },
              { key: 'week', label: 'Week' },
              { key: 'day', label: 'Day' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => onViewChange(tab.key as CalendarViewType)}
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 border whitespace-nowrap ${
                  viewType === tab.key
                    ? 'bg-white text-blue-600 border-white'
                    : 'bg-transparent text-white border-white/30 hover:bg-white/10'
                } ${
                  tab.key === 'month' 
                    ? 'rounded-tl-lg border-r-0' 
                    : tab.key === 'day'
                    ? 'rounded-tr-lg border-l-0'
                    : 'border-x-0'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;