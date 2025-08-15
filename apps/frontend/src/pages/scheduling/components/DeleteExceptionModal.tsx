import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/basic/dialog';
import { Button } from '@/components/basic/button';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { ScheduleException } from '@/services/schedulingService';
import { format } from 'date-fns';

interface DeleteExceptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exception: ScheduleException | null;
  onConfirmDelete: () => void;
  isDeleting: boolean;
}

const DeleteExceptionModal: React.FC<DeleteExceptionModalProps> = ({
  open,
  onOpenChange,
  exception,
  onConfirmDelete,
  isDeleting,
}) => {
  if (!exception) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <span>Delete Schedule Exception</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Are you sure you want to delete this exception?
            </h3>
            <p className="text-sm text-gray-600">
              This action cannot be undone. The schedule exception will be permanently removed.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Date:</span>
                <span className="text-gray-900">
                  {format(new Date(exception.exceptionDate), 'MMM d, yyyy')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Type:</span>
                <span className="text-gray-900">
                  {exception.isUnavailable ? 'Unavailable' : 'Modified Hours'}
                </span>
              </div>
              {exception.reason && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Reason:</span>
                  <span className="text-gray-900">{exception.reason}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isDeleting}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={onConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? 'Deleting...' : 'Delete Exception'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteExceptionModal;
