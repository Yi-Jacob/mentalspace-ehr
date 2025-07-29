
import React from 'react';
import { Button } from '@/components/basic/button';
import { Plus, Sparkles } from 'lucide-react';

interface AppointmentManagementHeaderProps {
  onCreateAppointment: () => void;
}

const AppointmentManagementHeader: React.FC<AppointmentManagementHeaderProps> = ({
  onCreateAppointment
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white shadow-lg">
          <Sparkles className="h-8 w-8" />
        </div>
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Appointment Management
          </h2>
          <p className="text-gray-600 mt-1">Manage and track all your appointments</p>
        </div>
      </div>
      <Button 
        onClick={onCreateAppointment}
        className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
      >
        <Plus className="h-4 w-4 mr-2" />
        New Appointment
      </Button>
    </div>
  );
};

export default AppointmentManagementHeader;
