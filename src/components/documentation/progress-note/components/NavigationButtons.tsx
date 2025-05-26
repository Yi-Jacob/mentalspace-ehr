
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavigationButtonsProps {
  currentSection: number;
  totalSections: number;
  onPrevious: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
  isLoading?: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentSection,
  totalSections,
  onPrevious,
  onNext,
  onSaveDraft,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const isFirstSection = currentSection === 0;
  const isLastSection = currentSection === totalSections - 1;

  return (
    <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-6">
      <div className="flex space-x-2">
        <Button
          variant="outline"
          onClick={() => navigate('/documentation')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Documentation
        </Button>
        
        {!isFirstSection && (
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={isLoading}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
        )}
      </div>

      <div className="flex space-x-2">
        <Button
          variant="outline"
          onClick={onSaveDraft}
          disabled={isLoading}
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Draft'}
        </Button>

        {!isLastSection && (
          <Button
            onClick={onNext}
            disabled={isLoading}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default NavigationButtons;
