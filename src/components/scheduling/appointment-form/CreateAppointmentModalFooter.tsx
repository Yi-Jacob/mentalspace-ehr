
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

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
    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
      <Button
        type="button"
        variant="outline"
        onClick={onClose}
        className="hover:bg-gray-50 transition-colors"
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={!canSubmit}
        onClick={onSubmit}
        className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        <Calendar className="h-4 w-4 mr-2" />
        {isSubmitting ? 'Creating...' : 'Create Appointment'}
      </Button>
    </div>
  );
};

export default CreateAppointmentModalFooter;
