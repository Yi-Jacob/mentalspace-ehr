
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

interface ConflictData {
  hasConflicts: boolean;
  conflicts: Array<{
    message: string;
    start_time: string;
    end_time: string;
  }>;
}

interface ConflictWarningProps {
  conflictData?: ConflictData;
}

const ConflictWarning: React.FC<ConflictWarningProps> = ({ conflictData }) => {
  if (!conflictData?.hasConflicts) {
    return null;
  }

  return (
    <Alert className="border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-orange-800">
        <strong>Scheduling Conflict Detected:</strong>
        <ul className="mt-2 space-y-1">
          {conflictData.conflicts.map((conflict, index) => (
            <li key={index} className="text-sm">
              • {conflict.message} ({format(new Date(conflict.start_time), 'HH:mm')} - {format(new Date(conflict.end_time), 'HH:mm')})
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
};

export default ConflictWarning;
