import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './dialog';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  icon?: React.ReactNode;
  loading?: boolean;
}

/**
 * A reusable confirmation modal component for confirming destructive or important actions.
 * 
 * @example
 * ```tsx
 * const [confirmationModal, setConfirmationModal] = useState({
 *   isOpen: false,
 *   title: '',
 *   description: '',
 *   onConfirm: () => {},
 * });
 * 
 * const handleDelete = () => {
 *   setConfirmationModal({
 *     isOpen: true,
 *     title: 'Delete Item',
 *     description: 'Are you sure you want to delete this item? This action cannot be undone.',
 *     onConfirm: () => {
 *       // Perform delete action
 *       deleteItem();
 *     },
 *     variant: 'destructive'
 *   });
 * };
 * 
 * return (
 *   <>
 *     <Button onClick={handleDelete}>Delete</Button>
 *     <ConfirmationModal
 *       isOpen={confirmationModal.isOpen}
 *       onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
 *       onConfirm={confirmationModal.onConfirm}
 *       title={confirmationModal.title}
 *       description={confirmationModal.description}
 *       variant={confirmationModal.variant}
 *     />
 *   </>
 * );
 * ```
 */
export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  icon,
  loading = false
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const defaultIcon = variant === 'destructive' ? <AlertTriangle className="h-6 w-6 text-red-600" /> : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            {icon || defaultIcon}
            <DialogTitle className="text-lg font-semibold">
              {title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-600 mt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex space-x-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Processing...' : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal; 