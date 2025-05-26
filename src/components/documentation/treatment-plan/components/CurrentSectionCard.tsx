
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SECTIONS } from '../constants/sections';
import { TreatmentPlanFormData } from '../types/TreatmentPlanFormData';
import NavigationButtons from './NavigationButtons';

interface CurrentSectionCardProps {
  currentSection: number;
  formData: TreatmentPlanFormData;
  updateFormData: (updates: Partial<TreatmentPlanFormData>) => void;
  clientData?: any;
  onSave: (isDraft: boolean) => Promise<void>;
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
  const section = SECTIONS[currentSection];
  const SectionComponent = section.component;

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
      <CardContent className="p-8">
        <div className="space-y-8">
          <div className="text-center border-b border-gray-200 pb-6">
            <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
            <p className="text-gray-600 mt-2">
              Step {currentSection + 1} of {SECTIONS.length}
            </p>
          </div>

          <SectionComponent
            formData={formData}
            updateFormData={updateFormData}
            clientData={clientData}
          />

          <NavigationButtons
            currentSection={currentSection}
            totalSections={SECTIONS.length}
            onPrevious={onPrevious}
            onNext={onNext}
            onSave={onSave}
            onSaveDraft={onSaveDraft}
            isLoading={isLoading}
            canFinalize={formData.signature && !formData.isFinalized}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentSectionCard;
