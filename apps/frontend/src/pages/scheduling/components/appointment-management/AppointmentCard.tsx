
import React from 'react';
import { Badge } from '@/components/basic/badge';
import { Button } from '@/components/basic/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/basic/dropdown-menu';
import { Calendar, Clock, User, MapPin, Edit, Eye, Trash2, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import { AppointmentType } from '@/types/enums/scheduleEnum';
import { AppointmentTypeValue } from '@/types/scheduleType';

interface AppointmentCardProps {
  appointment: {
    id: string;
    client_id: string;
    appointment_type: AppointmentTypeValue;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    status: string;
    location?: string;
    room_number?: string;
    notes?: string;
    users?: any[];
  };
  onEdit: (appointment: any) => void;
  onDelete: (appointment: any) => void;
  onStatusChange: (appointmentId: string, newStatus: string) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300';
      case 'confirmed':
        return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300';
      case 'checked_in':
        return 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300';
      case 'in_progress':
        return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300';
      case 'completed':
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300';
      case 'cancelled':
        return 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300';
      case 'no_show':
        return 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300';
    }
  };

  const clientName = appointment.clients 
    ? `${appointment.clients.first_name} ${appointment.clients.last_name}`
    : 'Unknown Client';

  return (
    <div className="border-0 rounded-xl p-6 bg-gradient-to-r from-white to-blue-50/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-102 transform backdrop-blur-sm group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <h3 className="font-semibold text-lg text-gray-800">
              {appointment.title || `${appointment.appointment_type.replace('_', ' ')}`}
            </h3>
            <Badge className={`${getStatusColor(appointment.status)} border font-medium px-3 py-1`}>
              {appointment.status.replace('_', ' ')}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-blue-500" />
              <span className="font-medium">{clientName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-green-500" />
              <span>{format(new Date(appointment.start_time), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-purple-500" />
              <span>
                {format(new Date(appointment.start_time), 'HH:mm')} - 
                {format(new Date(appointment.end_time), 'HH:mm')}
              </span>
            </div>
            {appointment.location && (
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-pink-500" />
                <span>{appointment.location}</span>
              </div>
            )}
          </div>
          {appointment.notes && (
            <p className="text-sm text-gray-600 mt-3 p-3 bg-blue-50/50 rounded-lg italic border-l-4 border-blue-300">
              {appointment.notes}
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-blue-50"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white border-0 shadow-xl">
              <DropdownMenuItem 
                onClick={() => onEdit(appointment)}
                className="hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Appointment
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onStatusChange(appointment.id, 'confirmed')}
                disabled={appointment.status === 'confirmed'}
                className="hover:bg-green-50 transition-colors cursor-pointer"
              >
                <Eye className="h-4 w-4 mr-2" />
                Mark as Confirmed
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onStatusChange(appointment.id, 'completed')}
                disabled={appointment.status === 'completed'}
                className="hover:bg-purple-50 transition-colors cursor-pointer"
              >
                <Eye className="h-4 w-4 mr-2" />
                Mark as Completed
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(appointment)}
                className="hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Appointment
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
