
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import AppointmentCard from './AppointmentCard';

interface AppointmentsListProps {
  appointments: any[] | undefined;
  isLoading: boolean;
  onEditAppointment: (appointment: any) => void;
  onDeleteAppointment: (appointment: any) => void;
  onStatusChange: (appointmentId: string, newStatus: string) => void;
}

const AppointmentsList: React.FC<AppointmentsListProps> = ({
  appointments,
  isLoading,
  onEditAppointment,
  onDeleteAppointment,
  onStatusChange
}) => {
  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center space-x-2 text-xl">
          <Calendar className="h-5 w-5" />
          <span>Appointments</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              <div className="text-gray-600 font-medium">Loading appointments...</div>
            </div>
          </div>
        ) : appointments?.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold mb-2">No appointments found</h3>
            <p className="text-sm">No appointments match your current criteria.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments?.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onEdit={onEditAppointment}
                onDelete={onDeleteAppointment}
                onStatusChange={onStatusChange}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentsList;
