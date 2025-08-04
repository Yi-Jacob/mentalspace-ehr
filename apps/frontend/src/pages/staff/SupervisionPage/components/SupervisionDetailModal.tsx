import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/basic/dialog';
import { Button } from '@/components/basic/button';
import { Badge } from '@/components/basic/badge';
import { SupervisionRelationship, SupervisionStatus } from '@/types/staffType';

interface SupervisionDetailModalProps {
  supervision: SupervisionRelationship | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const SupervisionDetailModal: React.FC<SupervisionDetailModalProps> = ({
  supervision,
  isOpen,
  onClose,
  onUpdate
}) => {

  const getStatusBadgeVariant = (status: SupervisionStatus) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'completed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getFullName = (user: any) => {
    return `${user.firstName} ${user.lastName}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!supervision) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Supervision Relationship Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Status Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Status</h3>
            <Badge variant={getStatusBadgeVariant(supervision.status)}>
              {supervision.status}
            </Badge>
          </div>

          {/* Participants Section */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Supervisor</h3>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">{getFullName(supervision.supervisor)}</p>
                <p className="text-sm text-gray-600">{supervision.supervisor?.email}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Supervisee</h3>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">{getFullName(supervision.supervisee)}</p>
                <p className="text-sm text-gray-600">{supervision.supervisee?.email}</p>
              </div>
            </div>
          </div>

          {/* Dates Section */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Start Date</h3>
              <p>{formatDate(supervision.startDate)}</p>
            </div>
            {supervision.endDate && (
              <div>
                <h3 className="text-lg font-semibold mb-2">End Date</h3>
                <p>{formatDate(supervision.endDate)}</p>
              </div>
            )}
          </div>

          {/* Notes Section */}
          {supervision.notes && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Notes</h3>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="whitespace-pre-wrap">{supervision.notes}</p>
              </div>
            </div>
          )}

          {/* Termination Notes Section */}
          {supervision.terminationNotes && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Termination Notes</h3>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="whitespace-pre-wrap">{supervision.terminationNotes}</p>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="text-sm text-gray-500 space-y-1">
            <p>Created: {formatDate(supervision.createdAt)}</p>
            <p>Last Updated: {formatDate(supervision.updatedAt)}</p>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 