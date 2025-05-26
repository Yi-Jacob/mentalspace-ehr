
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Phone } from 'lucide-react';

interface ContactNoteHeaderProps {
  clientName: string;
  onSaveDraft: () => void;
  onFinalize: () => void;
  isLoading: boolean;
  canFinalize: boolean;
}

const ContactNoteHeader: React.FC<ContactNoteHeaderProps> = ({
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
            className="bg-teal-600 hover:bg-teal-700"
          >
            {isLoading ? 'Finalizing...' : 'Finalize & Sign Note'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Phone className="h-5 w-5 text-teal-600" />
            <span>Contact Note</span>
          </CardTitle>
          <p className="text-gray-600">Client: {clientName}</p>
        </CardHeader>
      </Card>
    </>
  );
};

export default ContactNoteHeader;
