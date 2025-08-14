
import React from 'react';
import AppointmentCard from '../AppointmentCard';
import { Appointment } from '@/services/schedulingService';

interface ListViewProps {
  appointments: Appointment[];
}

const ListView: React.FC<ListViewProps> = ({ appointments }) => {
  const sortedAppointments = appointments?.sort((a, b) => 
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
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
