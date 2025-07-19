
import React from 'react';
import { Card, CardContent } from '@/components/shared/ui/card';
import { Button } from '@/components/shared/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ActionRequiredCardProps {
  draftNotes: number;
  overdueNotes: number;
  onCreateReminder: () => void;
}

const ActionRequiredCard: React.FC<ActionRequiredCardProps> = ({
  draftNotes,
  overdueNotes,
  onCreateReminder,
}) => {
  if (draftNotes === 0 && overdueNotes === 0) return null;

  return (
    <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-amber-100 rounded-full">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900 mb-2">Action Required</h3>
            <ul className="space-y-1 text-sm text-amber-800">
              {draftNotes > 0 && (
                <li>• {draftNotes} unsigned note{draftNotes > 1 ? 's' : ''} need{draftNotes === 1 ? 's' : ''} your attention</li>
              )}
              {overdueNotes > 0 && (
                <li>• {overdueNotes} note{overdueNotes > 1 ? 's are' : ' is'} overdue (7+ days old)</li>
              )}
            </ul>
            <div className="mt-3 flex space-x-2">
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                Review Pending Notes
              </Button>
              <Button size="sm" variant="outline" onClick={onCreateReminder}>
                Set Reminders
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionRequiredCard;
