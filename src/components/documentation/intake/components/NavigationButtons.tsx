
import React from 'react';
import { Button } from '@/components/ui/button';

interface NavigationButtonsProps {
  currentSection: number;
  totalSections: number;
  onPrevious: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
  isLoading: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentSection,
  totalSections,
  onPrevious,
  onNext,
  onSaveDraft,
  isLoading,
}) => {
  if (currentSection >= totalSections - 1) {
    return null; // Don't show navigation for the finalize section
  }

  return (
    <div className="flex justify-between mt-8 pt-6 border-t">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentSection === 0}
      >
        Previous
      </Button>
      
      <div className="flex space-x-2">
        <Button
          variant="outline"
          onClick={onSaveDraft}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Draft'}
        </Button>
        
        <Button onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default NavigationButtons;
