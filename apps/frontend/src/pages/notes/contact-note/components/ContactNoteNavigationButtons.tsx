
import React from 'react';
import { Button } from '@/components/basic/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ContactNoteNavigationButtonsProps {
  onSaveDraft: () => void;
  isLoading: boolean;
}

const ContactNoteNavigationButtons: React.FC<ContactNoteNavigationButtonsProps> = ({
  onSaveDraft,
  isLoading,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between mt-8 pt-6 border-t">
      <div className="flex space-x-2">
        <Button
          variant="outline"
          onClick={() => navigate('/notes')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Notes
        </Button>
      </div>
      
      <div className="flex space-x-2">
        <Button
          variant="outline"
          onClick={onSaveDraft}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Draft'}
        </Button>
      </div>
    </div>
  );
};

export default ContactNoteNavigationButtons;
