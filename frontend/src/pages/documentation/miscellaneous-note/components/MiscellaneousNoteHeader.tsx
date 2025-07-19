
import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stethoscope, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => navigate('/documentation')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Documentation</span>
        </Button>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={onSaveDraft}
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Stethoscope className="h-5 w-5 text-gray-600" />
            <span>Miscellaneous Note</span>
          </CardTitle>
          <p className="text-gray-600">Client: {clientName}</p>
        </CardHeader>
      </Card>
    </>
  );
};

export default MiscellaneousNoteHeader;
