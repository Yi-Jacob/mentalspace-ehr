
import React from 'react';
import { Button } from '@/components/basic/button';
import { Calendar, Loader2, X } from 'lucide-react';

interface CreateAppointmentModalFooterProps {
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  canSubmit: boolean;
  isSubmitting: boolean;
}

const CreateAppointmentModalFooter: React.FC<CreateAppointmentModalFooterProps> = ({
  onClose,
  onSubmit,
  canSubmit,
  isSubmitting
}) => {
  return (
    <div className="flex justify-between items-center pt-6 pb-2">
      {/* Progress indicator */}
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        {isSubmitting && (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Creating appointment...</span>
          </>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="relative px-6 py-2.5 border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-800 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:opacity-50 group"
          disabled={isSubmitting}
        >
          <X className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-90" />
          Cancel
        </Button>
        
        <Button
          type="submit"
          disabled={!canSubmit}
          onClick={onSubmit}
          className="relative px-8 py-2.5 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 hover:from-emerald-600 hover:via-green-600 hover:to-teal-700 text-white border-0 shadow-xl hover:shadow-2xl shadow-emerald-200/50 hover:shadow-emerald-300/60 transform hover:scale-105 transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg group overflow-hidden"
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-green-400/20 to-teal-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          
          {/* Content */}
          <div className="relative flex items-center">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
                Create Appointment
              </>
            )}
          </div>
        </Button>
      </div>
    </div>
  );
};

export default CreateAppointmentModalFooter;
