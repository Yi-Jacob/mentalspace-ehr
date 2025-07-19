
import React from 'react';
import { Button } from '@/components/shared/ui/button';

interface ActionButtonsProps {
  onCancel: () => void;
  onSave: () => void;
  isSaving: boolean;
  hasConflicts: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onCancel,
  onSave,
  isSaving,
  hasConflicts
}) => {
  return (
    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
      <Button
        variant="outline"
        onClick={onCancel}
        className="hover:bg-gray-50 transition-colors"
      >
        Cancel
      </Button>
      <Button
        onClick={onSave}
        disabled={isSaving || hasConflicts}
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );
};

export default ActionButtons;
