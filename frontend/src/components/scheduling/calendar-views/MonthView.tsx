
import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';

interface Appointment {
  id: string;
  title: string;
  client_id: string;
  provider_id: string;
  appointment_type: string;
  start_time: string;
  end_time: string;
  status: string;
  location?: string;
  room_number?: string;
  clients?: {
    first_name: string;
    last_name: string;
  };
  users?: {
    first_name: string;
    last_name: string;
  };
}

interface MonthViewProps {
  currentDate: Date;
  appointments: Appointment[];
}

const MonthView: React.FC<MonthViewProps> = ({ currentDate, appointments }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  return (
    <div className="grid grid-cols-7 gap-1">
      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
        <div key={day} className="font-medium text-center py-2 text-sm">
          {day}
        </div>
      ))}
      {calendarDays.map(day => {
        const dayAppointments = appointments?.filter(apt => 
          isSameDay(new Date(apt.start_time), day)
        ) || [];
        const isCurrentMonth = day.getMonth() === currentDate.getMonth();

        return (
          <div 
            key={day.toISOString()} 
            className={`border border-gray-200 min-h-[100px] p-1 ${
              !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
            }`}
          >
            <div className="text-sm font-medium mb-1">
              {format(day, 'd')}
            </div>
            <div className="space-y-1">
              {dayAppointments.slice(0, 3).map(appointment => (
                <div 
                  key={appointment.id}
                  className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded truncate"
                >
                  {format(new Date(appointment.start_time), 'HH:mm')} {appointment.title || 'Appointment'}
                </div>
              ))}
              {dayAppointments.length > 3 && (
                <div className="text-xs text-gray-500">
                  +{dayAppointments.length - 3} more
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MonthView;
