
import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { Appointment } from '@/services/schedulingService';

interface MonthViewProps {
  currentDate: Date;
  appointments: Appointment[];
  onTimeSlotClick: (date: Date, hour: number) => void;
  onAttendMeeting?: (meetLink: string) => void;
  onAppointmentClick?: (appointment: Appointment) => void;
}

const MonthView: React.FC<MonthViewProps> = ({ currentDate, appointments, onTimeSlotClick, onAttendMeeting, onAppointmentClick }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Week header */}
      <div className="grid grid-cols-7 border-b border-gray-200 bg-white">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="font-medium text-center py-3 text-sm text-gray-700 bg-gray-50 border-r border-gray-200 last:border-r-0">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 flex-1">
        {calendarDays.map(day => {
          const dayAppointments = appointments?.filter(apt =>
            isSameDay(new Date(apt.startTime), day)
          ) || [];
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={day.toISOString()}
              className={`border-r border-b border-gray-200 min-h-[120px] p-1 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'
                } ${isToday ? 'bg-blue-50' : ''}`}
              onClick={() => onTimeSlotClick(day, 9)} // Default to 9 AM when clicking on a day
            >
              <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600 font-bold' : 'text-gray-700'
                }`}>
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {dayAppointments.slice(0, 3).map(appointment => (
                  <div
                    key={appointment.id}
                    className={`text-xs px-1 py-0.5 rounded truncate transition-colors ${onAppointmentClick ? 'cursor-pointer' : ''} ${
                      appointment.isTelehealth && appointment.googleMeetLink
                        ? 'bg-green-100 text-green-800 hover:bg-green-200 border-l-2 border-green-500'
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-l-2 border-blue-500'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onAppointmentClick) {
                        onAppointmentClick(appointment);
                    } else if (appointment.isTelehealth && appointment.googleMeetLink && onAttendMeeting) {
                        onAttendMeeting(appointment.googleMeetLink);
                      }
                    }}
                  >
                    <div className="text-xs font-medium">
                      {format(new Date(appointment.startTime), 'HH:mm')} 
                      {appointment.clients ? ` ${appointment.clients.firstName}` : 'Client'}
                    </div>
                  </div>
                ))}
                {dayAppointments.length > 3 && (
                  <div className="text-xs text-gray-500 bg-gray-100 px-1 py-0.5 rounded">
                    +{dayAppointments.length - 3} more
                  </div>
                )}
                {dayAppointments.length === 0 && (
                  <div className="h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                    <div className="text-xs text-gray-400 font-medium bg-white px-2 py-1 rounded-full border">
                      +
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;
