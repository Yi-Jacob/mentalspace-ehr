
import React from 'react';
import SectionProgressIndicator from './SectionProgressIndicator';
import SectionNavigation from './SectionNavigation';
import SaveStatusIndicator from './SaveStatusIndicator';
import { SECTIONS } from '../constants/sections';
import { TreatmentPlanFormData } from '../types/TreatmentPlanFormData';

interface TreatmentPlanLayoutProps {
  children: React.ReactNode;
  formData: TreatmentPlanFormData;
  currentSection: number;
  sectionProgress: Array<{
    id: string;
    title: string;
    isComplete: boolean;
    hasRequiredFields: boolean;
    requiredFieldsComplete: boolean;
  }>;
  lastSaved?: Date;
  isLoading: boolean;
  hasUnsavedChanges: boolean;
  onSectionClick: (index: number) => void;
}

const TreatmentPlanLayout: React.FC<TreatmentPlanLayoutProps> = ({
  children,
  formData,
  currentSection,
  sectionProgress,
  lastSaved,
  isLoading,
  hasUnsavedChanges,
  onSectionClick,
}) => {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <SaveStatusIndicator
          lastSaved={lastSaved}
          isLoading={isLoading}
          hasUnsavedChanges={hasUnsavedChanges}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <SectionProgressIndicator
            sections={sectionProgress}
            currentSection={currentSection}
          />
          
          <SectionNavigation
            sections={SECTIONS}
            currentSection={currentSection}
            onSectionClick={onSectionClick}
          />
        </div>

        <div className="lg:col-span-3">
          {children}
        </div>
      </div>
    </div>
  );
};

export default TreatmentPlanLayout;
