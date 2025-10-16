
import React from 'react';
import { CardContent } from '@/components/basic/card';
import DayView from '../calendar-views/DayView';
import WeekView from '../calendar-views/WeekView';
import MonthView from '../calendar-views/MonthView';
import { Appointment } from '@/services/schedulingService';
import { CalendarViewType } from '../../types/calendar';

interface CalendarContentProps {
  viewType: CalendarViewType;
  currentDate: Date;
  appointments: Appointment[] | undefined;
  isLoading: boolean;
  onTimeSlotClick: (date: Date, hour: number) => void;
  onAttendMeeting?: (meetLink: string) => void;
  onAppointmentClick?: (appointment: Appointment) => void;
}

const CalendarContent: React.FC<CalendarContentProps> = ({
  viewType,
  currentDate,
  appointments,
  isLoading,
  onTimeSlotClick,
  onAttendMeeting,
  onAppointmentClick
}) => {
  const renderCalendarView = () => {
    if (!appointments) return null;

    switch (viewType) {
      case 'day':
        return (
          <DayView 
            currentDate={currentDate}
            appointments={appointments}
            onTimeSlotClick={onTimeSlotClick}
            onAttendMeeting={onAttendMeeting}
            onAppointmentClick={onAppointmentClick}
          />
        );
      case 'week':
        return (
          <WeekView 
            currentDate={currentDate}
            appointments={appointments}
            onTimeSlotClick={onTimeSlotClick}
            onAttendMeeting={onAttendMeeting}
            onAppointmentClick={onAppointmentClick}
          />
        );
      case 'month':
        return (
          <MonthView 
            currentDate={currentDate}
            appointments={appointments}
            onTimeSlotClick={onTimeSlotClick}
            onAttendMeeting={onAttendMeeting}
            onAppointmentClick={onAppointmentClick}
          />
        );
      default:
        return null;
    }
  };

  return (
    <CardContent className="flex-1 flex flex-col p-0">
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <div className="text-gray-600 font-medium">Loading calendar...</div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          {renderCalendarView()}
        </div>
      )}
    </CardContent>
  );
};

export default CalendarContent;
