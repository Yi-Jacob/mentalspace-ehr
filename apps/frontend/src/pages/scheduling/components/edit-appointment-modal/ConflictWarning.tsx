
import React from 'react';
import { Alert, AlertDescription } from '@/components/basic/alert';
import { AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

interface ConflictData {
  hasConflicts: boolean;
  conflicts: Array<{
    id: string;
    title?: string;
    startTime?: string;
    duration?: number;
    clients?: {
      firstName: string;
      lastName: string;
    };
    // Fallback fields for backward compatibility
    start_time?: string;
    end_time?: string;
    first_name?: string;
    last_name?: string;
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
          {conflictData.conflicts.map((conflict, index) => {
            const startTime = conflict.startTime || conflict.start_time;
            const duration = conflict.duration;
            const clientName = conflict.clients 
              ? `${conflict.clients.firstName} ${conflict.clients.lastName}`
              : conflict.first_name && conflict.last_name
              ? `${conflict.first_name} ${conflict.last_name}`
              : 'Unknown Client';
            
            let timeDisplay = 'N/A';
            if (startTime) {
              try {
                const startDate = new Date(startTime);
                if (duration) {
                  const endDate = new Date(startDate.getTime() + duration * 60000);
                  timeDisplay = `${format(startDate, 'HH:mm')} - ${format(endDate, 'HH:mm')}`;
                } else {
                  timeDisplay = format(startDate, 'HH:mm');
                }
              } catch (error) {
                timeDisplay = 'Invalid time';
              }
            }
            
            return (
              <li key={index} className="text-sm">
                • {conflict.title || 'Appointment'} with {clientName} ({timeDisplay})
              </li>
            );
          })}
        </ul>
      </AlertDescription>
    </Alert>
  );
};

export default ConflictWarning;
