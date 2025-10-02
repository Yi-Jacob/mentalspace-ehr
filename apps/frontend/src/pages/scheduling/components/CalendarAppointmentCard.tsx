import React from 'react';
import { Clock, MapPin, Video } from 'lucide-react';
import { format } from 'date-fns';
import { Appointment } from '@/services/schedulingService';

interface CalendarAppointmentCardProps {
  appointment: Appointment;
  onAttendMeeting?: (meetLink: string) => void;
}

const CalendarAppointmentCard: React.FC<CalendarAppointmentCardProps> = ({ 
  appointment, 
  onAttendMeeting
}) => {
  const clientName = appointment.clients 
    ? `${appointment.clients.firstName} ${appointment.clients.lastName}`
    : 'Unknown Client';

  const startTime = new Date(appointment.startTime);
  const endTime = new Date(startTime.getTime() + appointment.duration * 60000);

  return (
    <div className="w-full h-full p-1 hover:opacity-90 transition-opacity duration-200">
      <div className="flex h-full overflow-hidden">
        {/* Horizontal layout for cards with enough width */}
        <div className="flex-1 flex flex-row items-center gap-2 min-w-0">
          {/* Time */}
          <div className="text-xs font-medium text-gray-700 flex-shrink-0">
            {format(startTime, 'HH:mm')}-{format(endTime, 'HH:mm')}
          </div>
          
          {/* Title */}
          <div className="text-xs font-medium text-gray-900 truncate">
            {appointment.title || `${appointment.appointmentType.replace('_', ' ')}`}
          </div>
          
          {/* Client name */}
          <div className="text-xs text-gray-600 truncate">
            {clientName}
          </div>
          
          {/* Location (if space allows) */}
          {appointment.location && (
            <div className="text-xs text-gray-500 truncate flex-shrink-0">
              <MapPin className="h-3 w-3 inline mr-1" />
              {appointment.location}
            </div>
          )}
          
          {/* Join button */}
          {appointment.isTelehealth && appointment.googleMeetLink && onAttendMeeting && (
            <button
              className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1 flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                onAttendMeeting(appointment.googleMeetLink);
              }}
            >
              <Video className="w-3 h-3" />
              <span className="hidden md:inline">Join</span>
            </button>
          )}
        </div>
        
        {/* Vertical layout for very narrow cards (fallback) */}
        <div className="hidden flex-col items-center justify-center gap-1">
          <div className="text-xs font-medium text-gray-700">
            {format(startTime, 'HH:mm')}
          </div>
          <div className="text-xs text-gray-900 truncate">
            {appointment.title || appointment.appointmentType.replace('_', ' ')}
          </div>
          {appointment.isTelehealth && appointment.googleMeetLink && onAttendMeeting && (
            <button
              className="bg-green-500 hover:bg-green-600 text-white text-xs px-1 py-0.5 rounded"
              onClick={(e) => {
                e.stopPropagation();
                onAttendMeeting(appointment.googleMeetLink);
              }}
            >
              <Video className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarAppointmentCard;
