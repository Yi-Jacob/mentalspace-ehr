
import React from 'react';
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

interface ListViewProps {
  appointments: Appointment[];
}

const ListView: React.FC<ListViewProps> = ({ appointments }) => {
  const sortedAppointments = appointments?.sort((a, b) => 
    new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  ) || [];

  return (
    <div className="space-y-2">
      {sortedAppointments.map(appointment => (
        <AppointmentCard key={appointment.id} appointment={appointment} listView />
      ))}
    </div>
  );
};

export default ListView;
