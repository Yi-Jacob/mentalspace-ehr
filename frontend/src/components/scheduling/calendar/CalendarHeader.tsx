
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import CalendarNavigation from './CalendarNavigation';
import CalendarViewSelector from './CalendarViewSelector';
import CreateAppointmentButton from './CreateAppointmentButton';

type CalendarViewType = 'day' | 'week' | 'month' | 'list';

interface CalendarHeaderProps {
  currentDate: Date;
  viewType: CalendarViewType;
  onViewTypeChange: (viewType: CalendarViewType) => void;
  onNavigateDate: (direction: 'prev' | 'next') => void;
  onTodayClick: () => void;
  onCreateAppointment: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  viewType,
  onViewTypeChange,
  onNavigateDate,
  onTodayClick,
  onCreateAppointment
}) => {
  return (
    <CardHeader className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Calendar className="h-6 w-6" />
          </div>
          <span className="text-xl font-semibold">Calendar</span>
        </CardTitle>
        <div className="flex items-center space-x-4">
          <CalendarViewSelector 
            viewType={viewType} 
            onViewTypeChange={onViewTypeChange} 
          />
          <CreateAppointmentButton onClick={onCreateAppointment} />
        </div>
      </div>
      <CalendarNavigation
        currentDate={currentDate}
        viewType={viewType}
        onNavigateDate={onNavigateDate}
        onTodayClick={onTodayClick}
      />
    </CardHeader>
  );
};

export default CalendarHeader;
