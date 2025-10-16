import React, { useState, useEffect } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { cn } from '@/utils/utils';
import { Appointment } from '@/types/scheduleType';

interface WeekViewProps {
  currentDate: Date;
  appointments: Appointment[];
  onTimeSlotClick: (date: Date, hour: number) => void;
  onAttendMeeting?: (meetLink: string) => void;
  onAppointmentClick?: (appointment: Appointment) => void;
}

const WeekView: React.FC<WeekViewProps> = ({ currentDate, appointments, onTimeSlotClick, onAttendMeeting, onAppointmentClick }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: endOfWeek(currentDate, { weekStartsOn: 1 })
  });

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Helper function to get appointment position and size
  const getAppointmentPosition = (appointment: Appointment) => {
    const startTime = new Date(appointment.startTime);
    const endTime = new Date(startTime.getTime() + appointment.duration * 60000);

    // Calculate position within the day in 15-minute units
    const startQuarterHour = (startTime.getHours() * 4) + (startTime.getMinutes() / 15);
    const endQuarterHour = (endTime.getHours() * 4) + (endTime.getMinutes() / 15);

    // Each hour block is 96px, each quarter hour is 24px
    const topPosition = startQuarterHour * 24; // pixels from top of day
    const height = (endQuarterHour - startQuarterHour) * 24; // height in pixels

    return {
      top: `${topPosition}px`,
      height: `${Math.max(height, 16)}px`, // Minimum 16px height
      backgroundColor: getAppointmentColor(appointment.appointmentType)
    };
  };

  // Helper function to get appointment color based on type
  const getAppointmentColor = (appointmentType: string) => {
    switch (appointmentType.toLowerCase()) {
      case 'intake_session':
        return 'bg-indigo-100 border-indigo-400';
      case 'follow_up':
        return 'bg-yellow-100 border-yellow-400';
      case 'therapy_session':
        return 'bg-green-100 border-green-400';
      case 'assessment':
        return 'bg-purple-100 border-purple-400';
      default:
        return 'bg-blue-100 border-blue-400';
    }
  };

  // Helper function to get current time line position for a specific day
  const getCurrentTimeLinePosition = (day: Date) => {
    if (!isSameDay(currentTime, day)) {
      return null; // Don't show line if not current day
    }

    const currentQuarterHour = (currentTime.getHours() * 4) + (currentTime.getMinutes() / 15);
    const topPosition = currentQuarterHour * 24; // pixels from top of day
    
    return {
      top: `${topPosition}px`,
      time: format(currentTime, 'HH:mm')
    };
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Week header - minimized and clean */}
      <div className="grid grid-cols-[80px_repeat(7,1fr)] gap-0 border-b border-gray-200 bg-white">
        <div className="p-2"></div>
        {weekDays.map(day => (
          <div key={day.toISOString()} className="p-2 text-center border-r border-gray-200 last:border-r-0">
            <div className="text-sm font-medium text-gray-600">
              {format(day, 'EEE')}
            </div>
            <div className={cn(
              "text-lg font-semibold mt-1",
              isSameDay(day, new Date())
                ? "bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                : "text-gray-900"
            )}>
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-[80px_repeat(7,1fr)] gap-0 relative">
          {/* Time column */}
          <div className="relative">
            {Array.from({ length: 24 }, (_, hour) => (
              <div key={`time-${hour}`} className="h-24 relative bg-gray-50 border-r border-gray-200 sticky left-0 z-10">
                <div className="flex items-center justify-center h-full pr-3">
                  <div className="text-sm font-medium text-gray-600">
                    {format(new Date().setHours(hour, 0, 0, 0), 'h a')}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map(day => {
            const dayAppointments = appointments?.filter(apt =>
              isSameDay(new Date(apt.startTime), day)
            ) || [];
            const currentTimeLine = getCurrentTimeLinePosition(day);

            return (
              <div key={day.toISOString()} className="relative">
                {/* Hourly grid lines */}
                {Array.from({ length: 24 }, (_, hour) => (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    className="h-24 border-b border-r border-gray-100 hover:bg-gray-50 cursor-pointer relative last:border-r-0 transition-colors duration-200"
                    onClick={() => onTimeSlotClick(day, hour)}
                  />
                ))}

                {/* Current time line */}
                {currentTimeLine && (
                  <div
                    className="absolute left-0 right-0 z-30 pointer-events-none"
                    style={{ top: currentTimeLine.top }}
                  >
                    <div className="flex items-center h-0.5 bg-red-500 shadow-sm">
                      <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-r-md shadow-md font-medium">
                        {currentTimeLine.time}
                      </div>
                    </div>
                  </div>
                )}

                {/* Appointments positioned absolutely */}
                {dayAppointments.map(appointment => {
                  const position = getAppointmentPosition(appointment);

                  return (
                    <div
                      key={appointment.id}
                      className={`absolute left-0 right-0 ${position.backgroundColor} border-l-4 rounded-sm hover:shadow-md transition-all duration-200 z-20 ${onAppointmentClick ? 'cursor-pointer' : ''}`}
                      style={{
                        top: position.top,
                        height: position.height,
                        minHeight: '16px'
                      }}
                      onClick={onAppointmentClick ? (e) => {
                        e.stopPropagation();
                        onAppointmentClick(appointment);
                      } : undefined}
                    >
                      <div className="flex flex-col items-center justify-center h-full p-1 text-center overflow-hidden">
                        <div className="text-xs font-medium text-gray-900 truncate w-full">
                          {format(new Date(appointment.startTime), 'HH:mm')}
                        </div>
                        <div className="text-xs font-semibold text-gray-900 truncate w-full">
                          {appointment.clients
                            ? `${appointment.clients.firstName} ${appointment.clients.lastName}`
                            : 'Unknown Client'}
                        </div>
                        <div className="text-xs text-gray-600 truncate w-full">
                          {appointment.appointmentType.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeekView;