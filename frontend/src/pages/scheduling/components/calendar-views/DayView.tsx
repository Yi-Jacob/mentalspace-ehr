
import React from 'react';
import { format, isSameDay } from 'date-fns';
import { cn } from '@/utils/utils';
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

interface DayViewProps {
  currentDate: Date;
  appointments: Appointment[];
  onTimeSlotClick: (date: Date, hour: number) => void;
}

const DayView: React.FC<DayViewProps> = ({ currentDate, appointments, onTimeSlotClick }) => {
  const dayAppointments = appointments?.filter(apt => 
    isSameDay(new Date(apt.start_time), currentDate)
  ) || [];

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-white to-blue-50/30">
      {/* Header with day and date */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 border-b shadow-lg">
        <div className="text-center text-white">
          <div className="text-lg font-medium opacity-90">
            {format(currentDate, 'EEEE')}
          </div>
          <div className="text-3xl font-bold mt-1">
            {format(currentDate, 'd')}
          </div>
          <div className="text-sm opacity-75 mt-1">
            {format(currentDate, 'MMMM yyyy')}
          </div>
        </div>
      </div>

      {/* Time slots */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-[80px_1fr] gap-0">
          {hours.map((hour) => (
            <React.Fragment key={hour}>
              {/* Time label */}
              <div className="text-sm font-medium text-gray-600 p-4 border-r border-gray-200 text-right bg-gradient-to-r from-gray-50 to-blue-50/50 sticky left-0 z-10">
                <div className="bg-white px-2 py-1 rounded-md shadow-sm border">
                  {format(new Date().setHours(hour, 0, 0, 0), 'h a')}
                </div>
              </div>
              {/* Time slot */}
              <div 
                className="min-h-[80px] border-b border-gray-100 p-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer relative transition-all duration-200 group"
                onClick={() => onTimeSlotClick(currentDate, hour)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 to-purple-400/0 group-hover:from-blue-400/10 group-hover:to-purple-400/10 transition-all duration-300 pointer-events-none"></div>
                {dayAppointments
                  .filter(apt => new Date(apt.start_time).getHours() === hour)
                  .map(appointment => (
                    <AppointmentCard key={appointment.id} appointment={appointment} />
                  ))}
                {dayAppointments.filter(apt => new Date(apt.start_time).getHours() === hour).length === 0 && (
                  <div className="h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="text-xs text-gray-400 font-medium bg-white/60 px-3 py-1 rounded-full backdrop-blur-sm">
                      Click to add appointment
                    </div>
                  </div>
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DayView;
