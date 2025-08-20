
import React from 'react';
import { Button } from '@/components/basic/button';
import { Send, X } from 'lucide-react';

interface ComposeMessageActionsProps {
  onCancel: () => void;
  isLoading: boolean;
  disabled: boolean;
  submitText?: string;
}

const ComposeMessageActions: React.FC<ComposeMessageActionsProps> = ({
  onCancel,
  isLoading,
  disabled,
  submitText = 'Send Message',
}) => {
  return (
    <div className="flex justify-end space-x-3 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
      >
        <X className="h-4 w-4 mr-2" />
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={disabled}
        className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
      >
        <Send className="h-4 w-4 mr-2" />
        {isLoading ? 'Processing...' : submitText}
      </Button>
    </div>
  );
};

export default ComposeMessageActions;
