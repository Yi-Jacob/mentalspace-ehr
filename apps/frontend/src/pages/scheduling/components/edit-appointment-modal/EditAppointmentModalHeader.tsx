
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/basic/dialog';

const EditAppointmentModalHeader: React.FC = () => {
  return (
    <DialogHeader className="pb-6">
      <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Edit Appointment
      </DialogTitle>
    </DialogHeader>
  );
};

export default EditAppointmentModalHeader;
