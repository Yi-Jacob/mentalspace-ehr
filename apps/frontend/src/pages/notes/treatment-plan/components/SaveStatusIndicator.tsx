
import React from 'react';
import { Badge } from '@/components/basic/badge';
import { Save, Clock, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SaveStatusIndicatorProps {
  lastSaved?: Date;
  isLoading: boolean;
  hasUnsavedChanges: boolean;
}

const SaveStatusIndicator: React.FC<SaveStatusIndicatorProps> = ({
  lastSaved,
  isLoading,
  hasUnsavedChanges,
}) => {
  if (isLoading) {
    return (
      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
        <Save className="w-3 h-3 mr-1 animate-spin" />
        Saving...
      </Badge>
    );
  }

  if (hasUnsavedChanges) {
    return (
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
        <Clock className="w-3 h-3 mr-1" />
        Unsaved changes
      </Badge>
    );
  }

  if (lastSaved) {
    return (
      <Badge variant="secondary" className="bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        Saved {formatDistanceToNow(lastSaved, { addSuffix: true })}
      </Badge>
    );
  }

  return null;
};

export default SaveStatusIndicator;
