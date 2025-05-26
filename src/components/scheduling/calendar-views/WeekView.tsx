
import React from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import AppointmentCard from '../AppointmentCard';

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
    <div className="flex flex-col h-full">
      {/* Week header */}
      <div className="grid grid-cols-[60px_repeat(7,1fr)] gap-0 border-b border-gray-200 bg-blue-50">
        <div className="p-2"></div>
        {weekDays.map(day => (
          <div key={day.toISOString()} className="p-3 text-center border-r border-gray-200 last:border-r-0">
            <div className="text-sm font-medium text-blue-900">
              {format(day, 'EEE')}
            </div>
            <div className={cn(
              "text-lg font-bold mt-1",
              isSameDay(day, new Date()) ? "bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto" : "text-blue-800"
            )}>
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-[60px_repeat(7,1fr)] gap-0">
          {hours.map((hour) => (
            <React.Fragment key={hour}>
              {/* Time label */}
              <div className="text-xs text-gray-500 p-2 border-r border-gray-200 text-right sticky left-0 bg-white z-10">
                {format(new Date().setHours(hour, 0, 0, 0), 'h a')}
              </div>
              {/* Day columns */}
              {weekDays.map(day => {
                const dayAppointments = appointments?.filter(apt => 
                  isSameDay(new Date(apt.start_time), day) && 
                  new Date(apt.start_time).getHours() === hour
                ) || [];

                return (
                  <div 
                    key={`${day.toISOString()}-${hour}`}
                    className="min-h-[60px] border-b border-r border-gray-100 p-1 hover:bg-blue-50 cursor-pointer relative last:border-r-0"
                    onClick={() => onTimeSlotClick(day, hour)}
                  >
                    {dayAppointments.map(appointment => (
                      <AppointmentCard 
                        key={appointment.id} 
                        appointment={appointment} 
                        compact 
                      />
                    ))}
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
