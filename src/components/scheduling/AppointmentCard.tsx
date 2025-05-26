
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, User, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface Appointment {
  id: string;
  title?: string;
  client_id: string;
  provider_id: string;
  appointment_type: string;
  start_time: string;
  end_time: string;
  status: string;
  location?: string;
  room_number?: string;
  client?: {
    first_name: string;
    last_name: string;
  };
  provider?: {
    first_name: string;
    last_name: string;
  };
}

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
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'checked_in':
        return 'bg-purple-100 text-purple-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no_show':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'initial_consultation':
        return 'bg-indigo-100 text-indigo-800';
      case 'follow_up':
        return 'bg-blue-100 text-blue-800';
      case 'therapy_session':
        return 'bg-green-100 text-green-800';
      case 'assessment':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const clientName = appointment.client 
    ? `${appointment.client.first_name} ${appointment.client.last_name}`
    : 'Unknown Client';

  const providerName = appointment.provider
    ? `${appointment.provider.first_name} ${appointment.provider.last_name}`
    : 'Unknown Provider';

  if (compact) {
    return (
      <div className="text-xs bg-blue-50 border border-blue-200 rounded p-1 mb-1">
        <div className="font-medium truncate">
          {format(new Date(appointment.start_time), 'HH:mm')} - {clientName}
        </div>
        <div className="text-gray-600 truncate">
          {appointment.appointment_type.replace('_', ' ')}
        </div>
      </div>
    );
  }

  if (listView) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="font-medium">
                    {appointment.title || `${appointment.appointment_type.replace('_', ' ')}`}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                    <User className="h-4 w-4" />
                    <span>{clientName}</span>
                    <span>•</span>
                    <Clock className="h-4 w-4" />
                    <span>
                      {format(new Date(appointment.start_time), 'MMM d, yyyy HH:mm')} - 
                      {format(new Date(appointment.end_time), 'HH:mm')}
                    </span>
                    {appointment.location && (
                      <>
                        <span>•</span>
                        <MapPin className="h-4 w-4" />
                        <span>{appointment.location}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(appointment.status)}>
                {appointment.status.replace('_', ' ')}
              </Badge>
              <Badge variant="outline" className={getTypeColor(appointment.appointment_type)}>
                {appointment.appointment_type.replace('_', ' ')}
              </Badge>
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow mb-2">
      <CardContent className="p-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-medium text-sm">
              {appointment.title || `${appointment.appointment_type.replace('_', ' ')}`}
            </h3>
            <div className="text-xs text-gray-600 mt-1">
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span>{clientName}</span>
              </div>
              <div className="flex items-center space-x-1 mt-1">
                <Clock className="h-3 w-3" />
                <span>
                  {format(new Date(appointment.start_time), 'HH:mm')} - 
                  {format(new Date(appointment.end_time), 'HH:mm')}
                </span>
              </div>
              {appointment.location && (
                <div className="flex items-center space-x-1 mt-1">
                  <MapPin className="h-3 w-3" />
                  <span>{appointment.location}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <Badge className={`text-xs ${getStatusColor(appointment.status)}`}>
              {appointment.status}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
