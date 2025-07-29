
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/basic/dialog';
import { Button } from '@/components/basic/button';
import { Plus, X, Sparkles } from 'lucide-react';

interface CreateAppointmentModalHeaderProps {
  onClose: () => void;
}

const CreateAppointmentModalHeader: React.FC<CreateAppointmentModalHeaderProps> = ({
  onClose
}) => {
  return (
    <DialogHeader className="relative p-8 pb-6 border-b border-gray-200/50">
      {/* Decorative elements */}
      <div className="absolute top-4 right-20 opacity-20">
        <Sparkles className="h-6 w-6 text-emerald-500 animate-pulse" />
      </div>
      <div className="absolute top-8 right-32 opacity-15">
        <Sparkles className="h-4 w-4 text-blue-500 animate-pulse delay-1000" />
      </div>
      
      <div className="flex items-center justify-between">
        <DialogTitle className="flex items-center space-x-4 text-3xl font-bold">
          {/* Modern icon container */}
          <div className="relative">
            <div className="p-3 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 rounded-2xl shadow-lg shadow-emerald-200/50 transform rotate-3 group-hover:rotate-6 transition-transform duration-300">
              <Plus className="h-7 w-7 text-white" />
            </div>
            {/* Floating accent */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-bounce" />
          </div>
          
          {/* Modern typography */}
          <div className="flex flex-col">
            <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 bg-clip-text text-transparent leading-tight">
              Create New Appointment
            </span>
            <span className="text-sm font-normal text-gray-500 mt-1">
              Schedule a new session with your client
            </span>
          </div>
        </DialogTitle>
        
        {/* Modern close button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="relative h-10 w-10 rounded-xl bg-gray-100/60 hover:bg-red-100/80 text-gray-500 hover:text-red-600 border-0 transition-all duration-300 transform hover:scale-105 group"
          aria-label="Close modal"
        >
          <X className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Button>
      </div>
    </DialogHeader>
  );
};

export default CreateAppointmentModalHeader;
