import React, { useState } from 'react';
import { Key, AlertCircle, Copy, Check } from 'lucide-react';
import { Button } from './basic/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './basic/dialog';
import { useToast } from '@/hooks/use-toast';

interface PasswordDisplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffName: string;
  generatedPassword: string;
}

/**
 * A modal component to display a generated password for staff members.
 * Uses the Dialog component and includes a copy button functionality.
 * 
 * @example
 * ```tsx
 * const [passwordModal, setPasswordModal] = useState({
 *   isOpen: false,
 *   staffName: '',
 *   generatedPassword: ''
 * });
 * 
 * <PasswordDisplayModal
 *   isOpen={passwordModal.isOpen}
 *   onClose={() => setPasswordModal(prev => ({ ...prev, isOpen: false }))}
 *   staffName={passwordModal.staffName}
 *   generatedPassword={passwordModal.generatedPassword}
 * />
 * ```
 */
export const PasswordDisplayModal: React.FC<PasswordDisplayModalProps> = ({
  isOpen,
  onClose,
  staffName,
  generatedPassword
}) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyPassword = async () => {
    try {
      await navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
      toast({
        title: 'Copied!',
        description: 'Password has been copied to clipboard',
      });
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy password to clipboard',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <Key className="h-6 w-6 text-blue-600" />
            <DialogTitle className="text-lg font-semibold">
              Password Generated
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-600 mt-2">
            A new random password has been generated for <strong>{staffName}</strong>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Important:</p>
                <p className="text-xs">⚠️ This password will be shown only once. Please copy it now.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Generated Password:
            </label>
            <div className="flex items-center space-x-2">
              <code className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white font-mono text-gray-700 break-all">
                {generatedPassword}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyPassword}
                className="flex items-center space-x-1"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-end">
          <Button
            onClick={onClose}
            variant="outline"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordDisplayModal;
