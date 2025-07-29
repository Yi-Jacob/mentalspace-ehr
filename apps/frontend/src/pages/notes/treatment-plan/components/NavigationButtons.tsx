
import React from 'react';
import { Button } from '@/components/basic/button';
import { ChevronLeft, ChevronRight, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavigationButtonsProps {
  currentSection: number;
  totalSections: number;
  onPrevious: () => void;
  onNext: () => void;
  onSave: (isDraft: boolean) => Promise<void>;
  onSaveDraft: () => void;
  isLoading: boolean;
  canFinalize: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentSection,
  totalSections,
  onPrevious,
  onNext,
  onSave,
  onSaveDraft,
  isLoading,
  canFinalize,
}) => {
  const navigate = useNavigate();
  const isLastSection = currentSection === totalSections - 1;

  return (
    <div className="flex justify-between items-center pt-6 border-t border-gray-200">
      <div className="flex space-x-2">
        <Button
          variant="outline"
          onClick={() => navigate('/notes')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Notes
        </Button>
        
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentSection === 0 || isLoading}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <Button
          variant="outline"
          onClick={onSaveDraft}
          disabled={isLoading}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Draft
        </Button>
      </div>

      <div className="flex space-x-2">
        {isLastSection && canFinalize && (
          <Button
            onClick={() => onSave(false)}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            Sign Treatment Plan
          </Button>
        )}
        
        {!isLastSection && (
          <Button
            onClick={onNext}
            disabled={isLoading}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default NavigationButtons;
