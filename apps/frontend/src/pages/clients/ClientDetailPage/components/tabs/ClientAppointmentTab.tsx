import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Clock, User, MapPin, FileText, Video, Phone, Plus, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/basic/badge';
import { Button } from '@/components/basic/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { useToast } from '@/hooks/use-toast';
import { schedulingService } from '@/services/schedulingService';
import { Appointment } from '@/types/scheduleType';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import CreateAppointmentModal from '@/pages/scheduling/components/CreateAppointmentModal';
import AppointmentDetailModal from '@/pages/scheduling/components/AppointmentDetailModal';

interface ClientAppointmentTabProps {
  clientId: string;
  clientName?: string;
}

const ClientAppointmentTab: React.FC<ClientAppointmentTabProps> = ({ clientId, clientName }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
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

  // Separate appointments into upcoming and past
  const { upcomingAppointments, pastAppointments } = useMemo(() => {
    const now = new Date();
    const upcoming: Appointment[] = [];
    const past: Appointment[] = [];

    appointments.forEach(appointment => {
      const appointmentDate = new Date(appointment.startTime);
      if (appointmentDate >= now) {
        upcoming.push(appointment);
      } else {
        past.push(appointment);
      }
    });

    // Sort upcoming by date (earliest first)
    upcoming.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    
    // Sort past by date (most recent first)
    past.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    return {
      upcomingAppointments: upcoming,
      pastAppointments: past
    };
  }, [appointments]);

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

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailModalOpen(true);
  };

  const handleAttendMeeting = (meetLink: string) => {
    window.open(meetLink, '_blank', 'noopener,noreferrer');
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

  // Helper function to determine if session was held
  const hasSessionBeenHeld = (appointment: Appointment) => {
    // Check if appointment has a note (indicates session was held)
    return appointment.note !== null && appointment.note !== undefined;
  };

  // Helper function to get session status
  const getSessionStatus = (appointment: Appointment) => {
    const now = new Date();
    const appointmentDate = new Date(appointment.startTime);
    
    if (appointmentDate > now) {
      return 'upcoming';
    } else if (hasSessionBeenHeld(appointment)) {
      return 'completed';
    } else {
      return 'missed';
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading appointments..." />;
  }

  if (appointments.length === 0) {
    return (
      <EmptyState 
        title="No appointments found"
        description="This client doesn't have any appointments."
        icon={Calendar}
      />
    );
  }

  const renderAppointmentCard = (appointment: Appointment) => {
    const { date, time } = formatDateTime(appointment.startTime);
    const duration = `${appointment.duration} min`;
    const sessionStatus = getSessionStatus(appointment);
    
    return (
      <Card 
        key={appointment.id} 
        className="hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => handleAppointmentClick(appointment)}
      >
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
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(appointment.status)}>
                {appointment.status.replace('_', ' ')}
              </Badge>
              {/* Session status indicator */}
              {sessionStatus === 'completed' && (
                <div className="flex items-center space-x-1 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-xs font-medium">Session Held</span>
                </div>
              )}
              {sessionStatus === 'missed' && (
                <div className="flex items-center space-x-1 text-red-600">
                  <XCircle className="h-4 w-4" />
                  <span className="text-xs font-medium">No Session</span>
                </div>
              )}
            </div>
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
                  {appointment.googleMeetLink && sessionStatus === 'upcoming' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        handleStartTelehealth(appointment);
                      }}
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
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Client Appointments</h3>
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

      {/* Upcoming Appointments */}
      {upcomingAppointments.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <h4 className="text-md font-medium text-blue-600">Upcoming Appointments</h4>
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600">
              {upcomingAppointments.length}
            </Badge>
          </div>
          <div className="grid gap-4">
            {upcomingAppointments.map(renderAppointmentCard)}
          </div>
        </div>
      )}

      {/* Past Appointments */}
      {pastAppointments.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <h4 className="text-md font-medium text-gray-600">Past Appointments</h4>
            <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600">
              {pastAppointments.length}
            </Badge>
          </div>
          <div className="grid gap-4">
            {pastAppointments.map(renderAppointmentCard)}
          </div>
        </div>
      )}

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

      {/* Appointment Detail Modal */}
      <AppointmentDetailModal
        open={isDetailModalOpen}
        onOpenChange={(open) => {
          setIsDetailModalOpen(open);
          if (!open) {
            setSelectedAppointment(null);
            // Refresh appointments when modal closes (in case appointment was updated)
            fetchClientAppointments();
          }
        }}
        appointment={selectedAppointment}
        onAttendMeeting={handleAttendMeeting}
      />
    </div>
  );
};

export default ClientAppointmentTab;
