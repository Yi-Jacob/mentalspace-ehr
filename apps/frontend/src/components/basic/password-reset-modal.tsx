import React, { useState } from 'react';
import { CheckCircle, Copy, ExternalLink } from 'lucide-react';
import { Button } from './button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './dialog';
import { useToast } from '@/hooks/use-toast';

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  passwordResetUrl: string;
  staffName?: string;
}

/**
 * A modal component to display the password reset URL for newly created staff members.
 * Includes a copy button and external link functionality.
 */
export const PasswordResetModal: React.FC<PasswordResetModalProps> = ({
  isOpen,
  onClose,
  passwordResetUrl,
  staffName
}) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(passwordResetUrl);
      setCopied(true);
      toast({
        title: 'Copied!',
        description: 'Password reset URL has been copied to clipboard',
      });
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy URL to clipboard',
        variant: 'destructive',
      });
    }
  };

  const handleOpenUrl = () => {
    window.open(passwordResetUrl, '_blank');
  };

  const displayName = staffName ? ` for ${staffName}` : '';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <DialogTitle className="text-lg font-semibold">
              Staff Member Created Successfully
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-600 mt-2">
            A password reset URL has been generated{displayName}. Share this URL with the staff member so they can set their password and access their account.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Password Reset URL:
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={passwordResetUrl}
                readOnly
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white font-mono text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyUrl}
                className="flex items-center space-x-1"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
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
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <ExternalLink className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Important:</p>
                <ul className="text-xs space-y-1 list-disc list-inside">
                  <li>This URL is only valid for a limited time</li>
                  <li>Share it securely with the staff member</li>
                  <li>The staff member should use it immediately to set their password</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleOpenUrl}
            className="flex items-center space-x-2"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Open URL</span>
          </Button>
          <Button
            onClick={onClose}
            className="flex-1"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordResetModal;
