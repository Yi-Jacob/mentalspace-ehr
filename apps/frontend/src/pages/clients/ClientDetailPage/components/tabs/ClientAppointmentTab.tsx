import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, MapPin, FileText, Video, Phone, Plus } from 'lucide-react';
import { Badge } from '@/components/basic/badge';
import { Button } from '@/components/basic/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { useToast } from '@/hooks/use-toast';
import { schedulingService, Appointment } from '@/services/schedulingService';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import CreateAppointmentModal from '@/pages/scheduling/components/CreateAppointmentModal';

interface ClientAppointmentTabProps {
  clientId: string;
  clientName?: string;
}

const ClientAppointmentTab: React.FC<ClientAppointmentTabProps> = ({ clientId, clientName }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchClientAppointments();
  }, [clientId]);

  const fetchClientAppointments = async () => {
    try {
      setLoading(true);
      const data = await schedulingService.getClientAppointments(clientId);
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching client appointments:', error);
      toast({
        title: "Error",
        description: "Failed to load client appointments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAppointmentSuccess = () => {
    // Refresh the appointments list after creating a new appointment
    fetchClientAppointments();
  };

  const handleStartTelehealth = (appointment: Appointment) => {
    if (appointment.googleMeetLink) {
      // Open the Google Meet link in a new tab
      window.open(appointment.googleMeetLink, '_blank', 'noopener,noreferrer');
      
      toast({
        title: "Telehealth Session Started",
        description: `Opening telehealth session for ${appointment.title || appointment.appointmentType} with ${clientName}`,
      });
    } else {
      toast({
        title: "Error",
        description: "No Google Meet link available for this appointment",
        variant: "destructive",
      });
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'checked_in':
        return 'bg-purple-100 text-purple-800';
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

  const getAppointmentTypeIcon = (appointmentType: string, isTelehealth: boolean) => {
    if (isTelehealth) {
      return <Video className="h-4 w-4 text-blue-600" />;
    }
    
    switch (appointmentType.toLowerCase()) {
      case 'consultation':
      case 'therapy':
        return <User className="h-4 w-4 text-green-600" />;
      case 'follow_up':
        return <Calendar className="h-4 w-4 text-purple-600" />;
      case 'assessment':
        return <FileText className="h-4 w-4 text-orange-600" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading appointments..." />;
  }

  if (appointments.length === 0) {
    return (
      <EmptyState 
        title="No appointments found"
        description="This client doesn't have any upcoming appointments."
        icon={Calendar}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-sm">
            {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
          </Badge>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            size="sm"
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4" />
            <span>New Appointment</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {appointments.map((appointment) => {
          const { date, time } = formatDateTime(appointment.startTime);
          const duration = `${appointment.duration} min`;
          
          return (
            <Card key={appointment.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {getAppointmentTypeIcon(appointment.appointmentType, appointment.isTelehealth)}
                    <div>
                      <CardTitle className="text-base font-medium">
                        {appointment.title || appointment.appointmentType}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        {appointment.description || 'No description provided'}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{date}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{time}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500">{duration}</span>
                    </div>
                    {appointment.location && (
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{appointment.location}</span>
                        {appointment.roomNumber && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500">Room {appointment.roomNumber}</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {appointment.cptCode && (
                      <div className="flex items-center space-x-2 text-sm">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">CPT:</span>
                        <span className="text-gray-600">{appointment.cptCode}</span>
                      </div>
                    )}
                    {appointment.isTelehealth && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm">
                          <Video className="h-4 w-4 text-blue-500" />
                          <span className="text-blue-600 font-medium">Telehealth</span>
                        </div>
                        {appointment.googleMeetLink && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            onClick={() => handleStartTelehealth(appointment)}
                          >
                            <Video className="h-4 w-4 mr-1" />
                            Start Telehealth
                          </Button>
                        )}
                      </div>
                    )}
                    {appointment.note && (
                      <div className="flex items-center space-x-2 text-sm">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">
                          Note: {appointment.note.title}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create Appointment Modal */}
      <CreateAppointmentModal
        open={isCreateModalOpen}
        onOpenChange={(open) => {
          setIsCreateModalOpen(open);
          if (!open) {
            // Refresh appointments when modal closes (in case appointment was created)
            fetchClientAppointments();
          }
        }}
        preselectedClientId={clientId}
        preselectedClientName={clientName}
      />
    </div>
  );
};

export default ClientAppointmentTab;
