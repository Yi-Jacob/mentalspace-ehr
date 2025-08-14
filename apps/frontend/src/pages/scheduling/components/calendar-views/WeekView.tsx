
import React from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { cn } from '@/utils/utils';
import AppointmentCard from '../AppointmentCard';
import { Appointment } from '@/services/schedulingService';

interface WeekViewProps {
  currentDate: Date;
  appointments: Appointment[];
  onTimeSlotClick: (date: Date, hour: number) => void;
}

const WeekView: React.FC<WeekViewProps> = ({ currentDate, appointments, onTimeSlotClick }) => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: endOfWeek(currentDate, { weekStartsOn: 1 })
  });

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-white to-blue-50/30">
      {/* Week header */}
      <div className="grid grid-cols-[80px_repeat(7,1fr)] gap-0 border-b border-gray-200 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg">
        <div className="p-4"></div>
        {weekDays.map(day => (
          <div key={day.toISOString()} className="p-4 text-center border-r border-white/20 last:border-r-0">
            <div className="text-sm font-medium opacity-90">
              {format(day, 'EEE')}
            </div>
            <div className={cn(
              "text-xl font-bold mt-2",
              isSameDay(day, new Date()) 
                ? "bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto backdrop-blur-sm border border-white/30" 
                : ""
            )}>
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-[80px_repeat(7,1fr)] gap-0">
          {hours.map((hour) => (
            <React.Fragment key={hour}>
              {/* Time label */}
              <div className="text-sm font-medium text-gray-600 p-3 border-r border-gray-200 text-right bg-gradient-to-r from-gray-50 to-blue-50/50 sticky left-0 z-10">
                <div className="bg-white px-2 py-1 rounded-md shadow-sm border text-xs">
                  {format(new Date().setHours(hour, 0, 0, 0), 'h a')}
                </div>
              </div>
              {/* Day columns */}
              {weekDays.map(day => {
                const dayAppointments = appointments?.filter(apt => 
                  isSameDay(new Date(apt.startTime), day) && 
                  new Date(apt.startTime).getHours() === hour
                ) || [];

                return (
                  <div 
                    key={`${day.toISOString()}-${hour}`}
                    className="min-h-[80px] border-b border-r border-gray-100 p-1 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 cursor-pointer relative last:border-r-0 transition-all duration-200 group"
                    onClick={() => onTimeSlotClick(day, hour)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-purple-400/0 group-hover:from-blue-400/10 group-hover:to-purple-400/10 transition-all duration-300 pointer-events-none"></div>
                    {dayAppointments.map(appointment => (
                      <AppointmentCard 
                        key={appointment.id} 
                        appointment={appointment} 
                        compact 
                      />
                    ))}
                    {dayAppointments.length === 0 && (
                      <div className="h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="text-xs text-gray-400 font-medium bg-white/60 px-2 py-1 rounded-full backdrop-blur-sm">
                          +
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeekView;
