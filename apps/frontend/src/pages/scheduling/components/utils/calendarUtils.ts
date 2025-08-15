
import { format, startOfWeek, endOfWeek } from 'date-fns';

type CalendarViewType = 'day' | 'week' | 'month';

export const getCalendarTitle = (currentDate: Date, viewType: CalendarViewType): string => {
  switch (viewType) {
    case 'day':
      return format(currentDate, 'EEEE, MMMM d, yyyy');
    case 'week':
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
      return `Week of ${format(weekStart, 'MMMM d, yyyy')}`;
    case 'month':
      return format(currentDate, 'MMMM yyyy');
    default:
      return 'Appointments';
  }
};
