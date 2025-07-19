
import React from 'react';
import { Button } from '@/components/shared/ui/button';
import { Send, X } from 'lucide-react';

interface ComposeMessageActionsProps {
  onCancel: () => void;
  isLoading: boolean;
  disabled: boolean;
}

const ComposeMessageActions: React.FC<ComposeMessageActionsProps> = ({
  onCancel,
  isLoading,
  disabled,
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
        {isLoading ? 'Sending...' : 'Send Message'}
      </Button>
    </div>
  );
};

export default ComposeMessageActions;
