
import { useState } from 'react';
import { addDays, addWeeks, addMonths, subWeeks, subMonths } from 'date-fns';

type CalendarViewType = 'day' | 'week' | 'month';

export const useCalendarNavigation = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<CalendarViewType>('week');

  const navigateDate = (direction: 'prev' | 'next') => {
    switch (viewType) {
      case 'day':
        setCurrentDate(prev => addDays(prev, direction === 'next' ? 1 : -1));
        break;
      case 'week':
        setCurrentDate(prev => direction === 'next' ? addWeeks(prev, 1) : subWeeks(prev, 1));
        break;
      case 'month':
        setCurrentDate(prev => direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1));
        break;
    }
  };

  return {
    currentDate,
    setCurrentDate,
    viewType,
    setViewType,
    navigateDate
  };
};
