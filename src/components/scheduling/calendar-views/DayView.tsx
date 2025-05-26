
import React from 'react';
import { format, isSameDay } from 'date-fns';
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
    <div className="flex flex-col h-full">
      {/* Header with day and date */}
      <div className="bg-blue-50 p-4 border-b">
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-900">
            {format(currentDate, 'EEEE')}
          </div>
          <div className="text-2xl font-bold text-blue-800">
            {format(currentDate, 'd')}
          </div>
        </div>
      </div>

      {/* Time slots */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-[60px_1fr] gap-0">
          {hours.map((hour) => (
            <React.Fragment key={hour}>
              {/* Time label */}
              <div className="text-xs text-gray-500 p-2 border-r border-gray-200 text-right">
                {format(new Date().setHours(hour, 0, 0, 0), 'h a')}
              </div>
              {/* Time slot */}
              <div 
                className="min-h-[60px] border-b border-gray-100 p-1 hover:bg-blue-50 cursor-pointer relative"
                onClick={() => onTimeSlotClick(currentDate, hour)}
              >
                {dayAppointments
                  .filter(apt => new Date(apt.start_time).getHours() === hour)
                  .map(appointment => (
                    <AppointmentCard key={appointment.id} appointment={appointment} />
                  ))}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DayView;
