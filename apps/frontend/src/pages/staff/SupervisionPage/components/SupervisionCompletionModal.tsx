import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/basic/dialog';
import { Button } from '@/components/basic/button';
import { Label } from '@/components/basic/label';
import { Textarea } from '@/components/basic/textarea';
import { useToast } from '@/hooks/use-toast';
import { staffService } from '@/services/staffService';
import { SupervisionRelationship } from '@/types/staffType';
import { CheckCircle, AlertTriangle } from 'lucide-react';

interface SupervisionCompletionModalProps {
  supervision: SupervisionRelationship | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SupervisionCompletionModal: React.FC<SupervisionCompletionModalProps> = ({
  supervision,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { toast } = useToast();
  const [terminationNotes, setTerminationNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    if (!supervision) return;

    if (!terminationNotes.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide termination notes',
        variant: 'destructive'
      });
      return;
    }

    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
      await staffService.updateSupervisionRelationship(supervision.id, {
        status: 'completed',
        endDate: today,
        terminationNotes: terminationNotes.trim()
      });

      toast({
        title: 'Success',
        description: 'Supervision relationship completed successfully',
      });

      setTerminationNotes('');
      onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to complete supervision relationship',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTerminationNotes('');
    onClose();
  };

  if (!supervision) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
            <DialogTitle className="text-lg font-semibold">
              Complete Supervision
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Supervisor:</strong> {supervision.supervisor?.firstName} {supervision.supervisor?.lastName}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Supervisee:</strong> {supervision.supervisee?.firstName} {supervision.supervisee?.lastName}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="terminationNotes">
              Termination Notes <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="terminationNotes"
              placeholder="Please provide notes about why this supervision relationship is being completed..."
              value={terminationNotes}
              onChange={(e) => setTerminationNotes(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              This information will be recorded for compliance and audit purposes. The end date will be automatically set to today.
            </p>
          </div>
        </div>
        
        <DialogFooter className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleComplete}
            disabled={loading || !terminationNotes.trim()}
            className="flex-1"
          >
            {loading ? (
              'Completing...'
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Supervision
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 