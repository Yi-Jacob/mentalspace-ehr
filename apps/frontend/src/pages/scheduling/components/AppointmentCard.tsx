
import React from 'react';
import { Card, CardContent } from '@/components/basic/card';
import { Badge } from '@/components/basic/badge';
import { Button } from '@/components/basic/button';
import { Clock, MapPin, User, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Appointment } from '@/services/schedulingService';



interface AppointmentCardProps {
  appointment: Appointment;
  compact?: boolean;
  listView?: boolean;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ 
  appointment, 
  compact = false, 
  listView = false 
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'initial_consultation':
        return 'bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 border-indigo-300';
      case 'follow_up':
        return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300';
      case 'therapy_session':
        return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300';
      case 'assessment':
        return 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300';
    }
  };

  const clientName = appointment.clients 
    ? `${appointment.clients.firstName} ${appointment.clients.lastName}`
    : 'Unknown Client';

  const providerName = appointment.users
    ? `${appointment.users.firstName} ${appointment.users.lastName}`
    : 'Unknown Provider';

  if (compact) {
    return (
      <div className="text-xs bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-2 mb-1 hover:shadow-md transition-all duration-200 hover:scale-102 transform">
        <div className="font-semibold truncate text-blue-900">
          {format(new Date(appointment.startTime), 'HH:mm')} - {clientName}
        </div>
        <div className="text-blue-700 truncate">
          {appointment.appointmentType.replace('_', ' ')}
        </div>
      </div>
    );
  }

  if (listView) {
    return (
      <Card className="hover:shadow-xl transition-all duration-300 hover:scale-102 transform border-0 bg-gradient-to-r from-white to-blue-50/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {appointment.title || `${appointment.appointmentType.replace('_', ' ')}`}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4 text-blue-500" />
                      <span>{clientName}</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-green-500" />
                      <span>
                        {format(new Date(appointment.startTime), 'MMM d, yyyy HH:mm')} - 
                        {format(new Date(appointment.endTime), 'HH:mm')}
                      </span>
                    </div>
                    {appointment.location && (
                      <>
                        <span className="text-gray-400">•</span>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4 text-purple-500" />
                          <span>{appointment.location}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className={`${getStatusColor(appointment.status)} border font-medium`}>
                {appointment.status.replace('_', ' ')}
              </Badge>
              <Badge variant="outline" className={`${getTypeColor(appointment.appointmentType)} border font-medium`}>
                {appointment.appointmentType.replace('_', ' ')}
              </Badge>
              <Button variant="ghost" size="sm" className="hover:bg-blue-50 transition-colors">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-102 transform mb-2 border-0 bg-gradient-to-r from-white to-blue-50/30">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-sm text-gray-800">
              {appointment.title || `${appointment.appointmentType.replace('_', ' ')}`}
            </h3>
            <div className="text-xs text-gray-600 mt-2 space-y-1">
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3 text-blue-500" />
                <span>{clientName}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3 text-green-500" />
                <span>
                  {format(new Date(appointment.startTime), 'HH:mm')} - 
                  {format(new Date(appointment.endTime), 'HH:mm')}
                </span>
              </div>
              {appointment.location && (
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3 text-purple-500" />
                  <span>{appointment.location}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <Badge className={`text-xs ${getStatusColor(appointment.status)} border`}>
              {appointment.status}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
