
import React from 'react';
import { format, isSameDay } from 'date-fns';
import { cn } from '@/utils/utils';
import CalendarAppointmentCard from '../CalendarAppointmentCard';
import { Appointment } from '@/services/schedulingService';



interface DayViewProps {
  currentDate: Date;
  appointments: Appointment[];
  onTimeSlotClick: (date: Date, hour: number) => void;
  onAttendMeeting?: (meetLink: string) => void;
  onAppointmentClick?: (appointment: Appointment) => void;
}

const DayView: React.FC<DayViewProps> = ({ currentDate, appointments, onTimeSlotClick, onAttendMeeting, onAppointmentClick }) => {
  const dayAppointments = appointments?.filter(apt => 
    isSameDay(new Date(apt.startTime), currentDate)
  ) || [];

  // Create 15-minute time slots for the day (96 slots total: 24 hours * 4)
  const timeSlots = Array.from({ length: 96 }, (_, i) => {
    const hour = Math.floor(i / 4);
    const minute = (i % 4) * 15;
    return { hour, minute, index: i };
  });

  // Helper function to get position and height for appointments
  const getAppointmentPosition = (appointment: Appointment) => {
    const startTime = new Date(appointment.startTime);
    const endTime = new Date(startTime.getTime() + appointment.duration * 60000);
    
    // Calculate position in 15-minute units
    const startQuarterHour = (startTime.getHours() * 4) + (startTime.getMinutes() / 15);
    const endQuarterHour = (endTime.getHours() * 4) + (endTime.getMinutes() / 15);
    
    const topPosition = (startQuarterHour / 96) * 100; // Percentage from top
    const height = ((endQuarterHour - startQuarterHour) / 96) * 100; // Height percentage
    
    return {
      top: `${topPosition}%`,
      height: `${Math.max(height, 2)}%`, // Minimum 2% height for visibility
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

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-[80px_1fr] gap-0 relative">
          {/* Time column */}
          <div className="relative">
            {/* Show one row per hour with 6px height per 15-minute slot */}
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

          {/* Calendar grid */}
          <div className="relative">
            {/* Show hourly grid lines only (24 lines total) */}
            {Array.from({ length: 24 }, (_, hour) => (
              <div 
                key={`hour-${hour}`} 
                className="h-24 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                onClick={() => onTimeSlotClick(currentDate, hour)}
              />
            ))}

            {/* Render appointments absolutely positioned */}
            {dayAppointments.map((appointment) => {
              const position = getAppointmentPosition(appointment);
              
              return (
                <div
                  key={appointment.id}
                  className={`absolute left-0 right-0 ${position.backgroundColor} border-l-3 rounded-sm shadow-sm hover:shadow-md transition-all duration-200 z-20 ${onAppointmentClick ? 'cursor-pointer' : ''}`}
                  style={{
                    top: position.top,
                    height: position.height,
                    minHeight: '16px' // Ensure minimum clickable height
                  }}
                  onClick={onAppointmentClick ? () => onAppointmentClick(appointment) : undefined}
                >
                  <CalendarAppointmentCard 
                    appointment={appointment} 
                    onAttendMeeting={onAttendMeeting}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayView;
