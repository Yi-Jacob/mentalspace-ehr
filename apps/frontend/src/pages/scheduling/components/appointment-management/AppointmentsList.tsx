
import React from 'react';
import { Badge } from '@/components/basic/badge';
import { Table, TableColumn } from '@/components/basic/table';
import { Calendar, Clock, User, MapPin, Edit, Trash2, CheckCircle, CheckSquare, Video } from 'lucide-react';
import { format } from 'date-fns';
import { AppointmentStatus } from '@/types/enums/scheduleEnum';

interface AppointmentsListProps {
  appointments: any[] | undefined;
  isLoading: boolean;
  onEditAppointment: (appointment: any) => void;
  onDeleteAppointment: (appointment: any) => void;
  onStatusChange: (appointmentId: string, newStatus: string) => void;
  onAttendMeeting?: (meetLink: string) => void;
}

const AppointmentsList: React.FC<AppointmentsListProps> = ({
  appointments,
  isLoading,
  onEditAppointment,
  onDeleteAppointment,
  onStatusChange,
  onAttendMeeting
}) => {
  // Helper function to safely format dates
  const safeFormatDate = (dateString: string | undefined, formatString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return format(date, formatString);
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Date Error';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case AppointmentStatus.SCHEDULED:
        return 'default';
      case AppointmentStatus.CONFIRMED:
        return 'default';
      case AppointmentStatus.CHECKED_IN:
        return 'secondary';
      case AppointmentStatus.IN_PROGRESS:
        return 'secondary';
      case AppointmentStatus.COMPLETED:
        return 'secondary';
      case AppointmentStatus.CANCELLED:
        return 'destructive';
      case AppointmentStatus.NO_SHOW:
        return 'destructive';
      case AppointmentStatus.RESCHEDULED:
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const formatClientName = (appointment: any) => {
    const clientName = appointment.clients 
      ? `${appointment.clients.firstName} ${appointment.clients.lastName}`
      : appointment.first_name && appointment.last_name
      ? `${appointment.first_name} ${appointment.last_name}`
      : 'Unknown Client';
    
    return (
      <div className="flex items-center space-x-2">
        <User className="h-4 w-4 text-blue-500" />
        <span className="font-medium">{clientName}</span>
      </div>
    );
  };

  const formatAppointmentType = (appointment: any) => {
    const type = appointment.appointmentType || appointment.appointment_type || 'Unknown Type';
    return type.replace('_', ' ');
  };

  const formatDateTime = (appointment: any) => {
    const startTime = appointment.startTime || appointment.start_time;
    const duration = appointment.duration;
    
    if (!startTime) return 'N/A';
    
    const date = safeFormatDate(startTime, 'MMM d, yyyy');
    const time = safeFormatDate(startTime, 'HH:mm');
    
    let endTime = 'N/A';
    if (startTime && duration) {
      try {
        const startDate = new Date(startTime);
        const endDate = new Date(startDate.getTime() + duration * 60000);
        endTime = safeFormatDate(endDate.toISOString(), 'HH:mm');
      } catch (error) {
        endTime = 'N/A';
      }
    }
    
    return (
      <div className="space-y-1">
        <div className="flex items-center space-x-1">
          <Calendar className="h-3 w-3 text-green-500" />
          <span className="text-sm">{date}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="h-3 w-3 text-purple-500" />
          <span className="text-sm">{time} - {endTime}</span>
        </div>
      </div>
    );
  };

  const formatStatus = (appointment: any) => {
    const status = appointment.status || AppointmentStatus.SCHEDULED;
    return (
      <Badge variant={getStatusColor(status)} className="text-xs">
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const formatLocation = (appointment: any) => {
    if (!appointment.location) return 'Not specified';
    
    return (
      <div className="flex items-center space-x-1">
        <MapPin className="h-3 w-3 text-pink-500" />
        <span className="text-sm">{appointment.location}</span>
      </div>
    );
  };

  const tableColumns: TableColumn<any>[] = [
    {
      key: 'client',
      header: 'Client',
      accessor: formatClientName,
      sortable: true,
      searchable: true,
      searchValue: (appointment) => {
        const clientName = appointment.clients 
          ? `${appointment.clients.firstName} ${appointment.clients.lastName}`
          : appointment.first_name && appointment.last_name
          ? `${appointment.first_name} ${appointment.last_name}`
          : 'Unknown Client';
        return clientName;
      },
      width: '20%'
    },
    {
      key: 'type',
      header: 'Type',
      accessor: formatAppointmentType,
      sortable: true,
      searchable: true,
      width: '12%'
    },
    {
      key: 'cptCode',
      header: 'CPT Code',
      accessor: (appointment) => appointment.cptCode || 'N/A',
      sortable: true,
      searchable: true,
      width: '10%'
    },
    {
      key: 'datetime',
      header: 'Date & Time',
      accessor: formatDateTime,
      sortable: true,
      width: '18%'
    },
    {
      key: 'status',
      header: 'Status',
      accessor: formatStatus,
      sortable: true,
      width: '12%'
    },
    {
      key: 'location',
      header: 'Location',
      accessor: formatLocation,
      sortable: true,
      searchable: true,
      width: '15%'
    },
    {
      key: 'notes',
      header: 'Associated Note',
      accessor: (appointment) => {
        if (appointment.note) {
          return (
            <div className="flex items-center space-x-1">
              <span className="text-sm font-medium">{appointment.note.title}</span>
              <span className="text-xs text-gray-500">({appointment.note.noteType})</span>
            </div>
          );
        }
        return 'No note';
      },
      sortable: false,
      searchable: true,
      width: '18%'
    }
  ];

  return (
    <Table
      data={appointments || []}
      columns={tableColumns}
      pageSize={15}
      pageSizeOptions={[10, 15, 25, 50]}
      emptyMessage="No appointments found"
      loading={isLoading}
      actions={[
        // Attend Meeting button for telehealth appointments
        ...(onAttendMeeting ? [{
          label: 'Attend',
          icon: <Video className="w-3 h-3" />,
          onClick: (appointment) => {
            if (appointment.isTelehealth && appointment.googleMeetLink) {
              onAttendMeeting(appointment.googleMeetLink);
            }
          },
          variant: 'default' as const,
          disabled: (appointment) => !appointment.isTelehealth || !appointment.googleMeetLink
        }] : []),
        {
          label: 'Edit',
          icon: <Edit className="w-3 h-3" />,
          onClick: onEditAppointment,
          variant: 'ghost'
        },
        {
          label: 'Confirm',
          icon: <CheckCircle className="w-3 h-3" />,
          onClick: (appointment) => onStatusChange(appointment.id, AppointmentStatus.CONFIRMED),
          variant: 'ghost',
          disabled: (appointment) => appointment.status === AppointmentStatus.CONFIRMED
        },
        {
          label: 'Complete',
          icon: <CheckSquare className="w-3 h-3" />,
          onClick: (appointment) => onStatusChange(appointment.id, AppointmentStatus.COMPLETED),
          variant: 'ghost',
          disabled: (appointment) => appointment.status === AppointmentStatus.COMPLETED
        },
        {
          label: 'Delete',
          icon: <Trash2 className="w-3 h-3" />,
          onClick: onDeleteAppointment,
          variant: 'ghost'
        }
      ]}
    />
  );
};

export default AppointmentsList;
