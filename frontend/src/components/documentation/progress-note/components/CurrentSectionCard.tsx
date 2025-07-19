
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/card';
import NavigationButtons from './NavigationButtons';
import ErrorBoundary from '@/components/ErrorBoundary';
import { SECTIONS } from '../constants/sections';
import { ProgressNoteFormData } from '../types/ProgressNoteFormData';

interface CurrentSectionCardProps {
  currentSection: number;
  formData: ProgressNoteFormData;
  updateFormData: (updates: Partial<ProgressNoteFormData>) => void;
  clientData?: any;
  onSave?: (isDraft: boolean) => Promise<void>;
  isLoading: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
}

const CurrentSectionCard: React.FC<CurrentSectionCardProps> = ({
  currentSection,
  formData,
  updateFormData,
  clientData,
  onSave,
  isLoading,
  onPrevious,
  onNext,
  onSaveDraft,
}) => {
  const CurrentSectionComponent = SECTIONS[currentSection].component;

  // Determine which props to pass based on the section
  const getSectionProps = () => {
    const baseProps = {
      formData,
      updateFormData,
    };

    // Add clientData only for sections that need it
    if (SECTIONS[currentSection].id === 'client-overview') {
      return {
        ...baseProps,
        clientData,
      };
    }

    // Add save props only for the finalize section
    if (currentSection === SECTIONS.length - 1) {
      return {
        ...baseProps,
        clientData,
        onSave,
        isLoading,
      };
    }

    return baseProps;
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
        <CardTitle className="flex items-center space-x-2">
          <span className="bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
            {currentSection + 1}
          </span>
          <span>{SECTIONS[currentSection].title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <ErrorBoundary>
          <CurrentSectionComponent
            {...getSectionProps()}
          />
        </ErrorBoundary>
        
        <NavigationButtons
          currentSection={currentSection}
          totalSections={SECTIONS.length}
          onPrevious={onPrevious}
          onNext={onNext}
          onSaveDraft={onSaveDraft}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};

export default CurrentSectionCard;
