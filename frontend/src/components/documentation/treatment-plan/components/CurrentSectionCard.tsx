
import React from 'react';
import { Card, CardContent } from '@/components/shared/ui/card';
import { SECTIONS } from '../constants/sections';
import { TreatmentPlanFormData } from '../types/TreatmentPlanFormData';
import NavigationButtons from './NavigationButtons';

// Import all section components
import ClientOverviewSection from '../sections/ClientOverviewSection';
import DiagnosisSection from '../sections/DiagnosisSection';
import PresentingProblemSection from '../sections/PresentingProblemSection';
import TreatmentGoalsSection from '../sections/TreatmentGoalsSection';
import DischargePlanningSection from '../sections/DischargePlanningSection';
import AdditionalInfoSection from '../sections/AdditionalInfoSection';
import FrequencySection from '../sections/FrequencySection';
import FinalizeSection from '../sections/FinalizeSection';

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
  
  // Check if all required sections are complete for finalization
  const canFinalize = () => {
    return !!(
      formData.clientId &&
      formData.treatmentPlanDate &&
      formData.primaryDiagnosis &&
      formData.presentingProblem &&
      formData.treatmentGoals?.length > 0 &&
      formData.dischargeCriteria &&
      formData.prescribedFrequency &&
      formData.medicalNecessityDeclaration
    );
  };

  const renderSectionContent = () => {
    switch (section.id) {
      case 'client-overview':
        return (
          <ClientOverviewSection
            formData={formData}
            updateFormData={updateFormData}
            clientData={clientData}
          />
        );
      case 'diagnosis':
        return (
          <DiagnosisSection
            formData={formData}
            updateFormData={updateFormData}
            clientData={clientData}
          />
        );
      case 'presenting-problem':
        return (
          <PresentingProblemSection
            formData={formData}
            updateFormData={updateFormData}
            clientData={clientData}
          />
        );
      case 'treatment-goals':
        return (
          <TreatmentGoalsSection
            formData={formData}
            updateFormData={updateFormData}
            clientData={clientData}
          />
        );
      case 'discharge-planning':
        return (
          <DischargePlanningSection
            formData={formData}
            updateFormData={updateFormData}
            clientData={clientData}
          />
        );
      case 'additional-info':
        return (
          <AdditionalInfoSection
            formData={formData}
            updateFormData={updateFormData}
            clientData={clientData}
          />
        );
      case 'frequency':
        return (
          <FrequencySection
            formData={formData}
            updateFormData={updateFormData}
            clientData={clientData}
          />
        );
      case 'finalize':
        return (
          <FinalizeSection
            formData={formData}
            updateFormData={updateFormData}
            onSave={onSave}
            isLoading={isLoading}
            clientData={clientData}
          />
        );
      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        {renderSectionContent()}
        
        <NavigationButtons
          currentSection={currentSection}
          totalSections={SECTIONS.length}
          onPrevious={onPrevious}
          onNext={onNext}
          onSave={onSave}
          onSaveDraft={onSaveDraft}
          isLoading={isLoading}
          canFinalize={canFinalize()}
        />
      </CardContent>
    </Card>
  );
};

export default CurrentSectionCard;
