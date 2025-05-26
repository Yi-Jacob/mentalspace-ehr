
import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stethoscope } from 'lucide-react';

interface MiscellaneousNoteHeaderProps {
  clientName: string;
  onSaveDraft: () => void;
  onFinalize: () => void;
  isLoading: boolean;
  canFinalize: boolean;
}

const MiscellaneousNoteHeader: React.FC<MiscellaneousNoteHeaderProps> = ({
  clientName,
  onSaveDraft,
  onFinalize,
  isLoading,
  canFinalize,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Stethoscope className="h-5 w-5 text-gray-600" />
              <span>Miscellaneous Note</span>
            </CardTitle>
            <p className="text-gray-600">Client: {clientName}</p>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={onSaveDraft}
              variant="outline"
              disabled={isLoading}
            >
              Save as Draft
            </Button>
            <Button
              onClick={onFinalize}
              disabled={!canFinalize || isLoading}
              className="bg-gray-600 hover:bg-gray-700"
            >
              {isLoading ? 'Finalizing...' : 'Finalize & Sign Note'}
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default MiscellaneousNoteHeader;
