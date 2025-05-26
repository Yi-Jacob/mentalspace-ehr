
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface CreateAppointmentButtonProps {
  onClick: () => void;
}

const CreateAppointmentButton: React.FC<CreateAppointmentButtonProps> = ({ onClick }) => {
  return (
    <Button 
      onClick={onClick}
      className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
    >
      <Plus className="h-4 w-4 mr-2" />
      New Appointment
    </Button>
  );
};

export default CreateAppointmentButton;
