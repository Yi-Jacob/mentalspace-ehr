import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import ErrorBoundary from '@/components/ErrorBoundary';

interface Section {
  id: string;
  title: string;
  component: React.ComponentType<any>;
}

interface CurrentSectionCardProps<T = any> {
  sections: Section[];
  currentSection: number;
  formData: T;
  updateFormData: (updates: Partial<T>) => void;
  clientData?: any;
  onSave?: (isDraft: boolean) => Promise<void>;
  isLoading: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
}

const CurrentSectionCard = <T extends Record<string, any>>({
  sections,
  currentSection,
  formData,
  updateFormData,
  clientData,
  onSave,
  isLoading,
  onPrevious,
  onNext,
  onSaveDraft,
}: CurrentSectionCardProps<T>) => {
  const CurrentSectionComponent = sections[currentSection].component;

  // Determine which props to pass based on the section
  const getSectionProps = () => {
    const baseProps = {
      formData,
      updateFormData,
    };

    // Add clientData for all sections (they might need it)
    const propsWithClient = {
      ...baseProps,
      clientData,
    };

    // Add save props only for the finalize section
    if (currentSection === sections.length - 1) {
      return {
        ...propsWithClient,
        onSave,
        isLoading,
      };
    }

    return propsWithClient;
  };

  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
        <CardTitle className="text-xl font-semibold text-gray-800">
          {sections[currentSection].title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <ErrorBoundary>
          <CurrentSectionComponent
            {...getSectionProps()}
          />
        </ErrorBoundary>
      </CardContent>
    </Card>
  );
};

export default CurrentSectionCard;
