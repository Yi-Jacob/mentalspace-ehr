
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

interface CreateAppointmentModalHeaderProps {
  onClose: () => void;
}

const CreateAppointmentModalHeader: React.FC<CreateAppointmentModalHeaderProps> = ({
  onClose
}) => {
  return (
    <DialogHeader className="pb-6">
      <div className="flex items-center justify-between">
        <DialogTitle className="flex items-center space-x-3 text-2xl font-bold">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg text-white">
            <Plus className="h-6 w-6" />
          </div>
          <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
            Create New Appointment
          </span>
        </DialogTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </DialogHeader>
  );
};

export default CreateAppointmentModalHeader;
