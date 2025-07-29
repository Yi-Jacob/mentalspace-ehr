
import React from 'react';
import { Button } from '@/components/basic/button';
import { Plus, Sparkles } from 'lucide-react';

interface CreateAppointmentButtonProps {
  onClick: () => void;
}

const CreateAppointmentButton: React.FC<CreateAppointmentButtonProps> = ({ onClick }) => {
  return (
    <Button 
      onClick={onClick}
      className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 
        hover:from-emerald-600 hover:via-green-600 hover:to-teal-700 text-white border-0 
        shadow-xl hover:shadow-2xl shadow-emerald-200/50 hover:shadow-emerald-300/60
        transform hover:scale-105 transition-all duration-300 rounded-xl px-6 py-3
        font-semibold text-sm group"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-green-400/20 to-teal-400/20 
        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Sparkle effect */}
      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
        <Sparkles className="h-3 w-3 text-emerald-200 animate-pulse" />
      </div>
      
      {/* Content */}
      <div className="relative flex items-center space-x-2">
        <div className="p-1 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors duration-300">
          <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
        </div>
        <span className="group-hover:tracking-wide transition-all duration-300">
          New Appointment
        </span>
      </div>
      
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
        -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
    </Button>
  );
};

export default CreateAppointmentButton;
