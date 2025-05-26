
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Trash2, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { useAppointmentMutations } from './hooks/useAppointmentMutations';

interface Appointment {
  id: string;
  title?: string;
  start_time: string;
  end_time: string;
  clients?: {
    first_name: string;
    last_name: string;
  };
}

interface DeleteAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment | null;
}

const DeleteAppointmentDialog: React.FC<DeleteAppointmentDialogProps> = ({
  open,
  onOpenChange,
  appointment
}) => {
  const { deleteAppointment } = useAppointmentMutations();

  const handleDelete = async () => {
    if (!appointment) return;

    try {
      await deleteAppointment.mutateAsync(appointment.id);
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  if (!appointment) return null;

  const clientName = appointment.clients 
    ? `${appointment.clients.first_name} ${appointment.clients.last_name}`
    : 'Unknown Client';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-gradient-to-br from-white to-red-50/30 border-red-200">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center space-x-3 text-red-800">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <span>Delete Appointment</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-700 space-y-3">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="font-medium text-red-800 mb-2">
                Are you sure you want to delete this appointment?
              </p>
              <div className="space-y-1 text-sm">
                <p><strong>Client:</strong> {clientName}</p>
                <p><strong>Title:</strong> {appointment.title || 'No title'}</p>
                <p><strong>Date & Time:</strong> {format(new Date(appointment.start_time), 'MMM d, yyyy HH:mm')} - {format(new Date(appointment.end_time), 'HH:mm')}</p>
              </div>
            </div>
            <p className="text-red-700 font-medium">
              This action cannot be undone. The appointment will be permanently removed from the system.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="hover:bg-gray-50 transition-colors">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteAppointment.isPending}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {deleteAppointment.isPending ? 'Deleting...' : 'Delete Appointment'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAppointmentDialog;
