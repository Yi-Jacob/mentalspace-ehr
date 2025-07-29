
import React from 'react';
import { Alert, AlertDescription } from '@/components/basic/alert';
import { AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

interface ConflictAndErrorAlertsProps {
  generalError?: string;
  hasConflicts?: boolean;
  conflictData?: {
    conflicts: Array<{
      message: string;
      start_time: string;
      end_time: string;
    }>;
  };
  isCheckingConflicts: boolean;
  clientId: string;
}

const ConflictAndErrorAlerts: React.FC<ConflictAndErrorAlertsProps> = ({
  generalError,
  hasConflicts,
  conflictData,
  isCheckingConflicts,
  clientId
}) => {
  return (
    <>
      {/* General Error Alert */}
      {generalError && (
        <Alert className="border-red-200 bg-gradient-to-r from-red-50 to-pink-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {generalError}
          </AlertDescription>
        </Alert>
      )}

      {/* Conflict Warning */}
      {hasConflicts && (
        <Alert className="border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Scheduling Conflict Detected:</strong>
            <ul className="mt-2 space-y-1">
              {conflictData?.conflicts.map((conflict, index) => (
                <li key={index} className="text-sm">
                  • {conflict.message} ({format(new Date(conflict.start_time), 'HH:mm')} - {format(new Date(conflict.end_time), 'HH:mm')})
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Loading State for Conflict Check */}
      {isCheckingConflicts && clientId && (
        <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
            <span className="text-blue-800 text-sm">Checking for scheduling conflicts...</span>
          </div>
        </Alert>
      )}
    </>
  );
};

export default ConflictAndErrorAlerts;
