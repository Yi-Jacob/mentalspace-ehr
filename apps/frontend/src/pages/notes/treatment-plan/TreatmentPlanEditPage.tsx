
import React from 'react';
import { useParams } from 'react-router-dom';
import TreatmentPlanNavigationHeader from './components/TreatmentPlanNavigationHeader';
import TreatmentPlanLayout from './components/TreatmentPlanLayout';
import CurrentSectionCard from './components/CurrentSectionCard';
import { TreatmentPlanLoadingState, TreatmentPlanNotFoundState } from './components/TreatmentPlanStates';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useTreatmentPlanForm } from './hooks/useTreatmentPlanForm';
import { SECTIONS } from './constants/sections';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import { Target } from 'lucide-react';

const TreatmentPlanForm = () => {
  const { noteId } = useParams();
  
  const {
    formData,
    updateFormData,
    currentSection,
    lastSaved,
    hasUnsavedChanges,
    note,
    isLoading,
    saveNoteMutation,
    getSectionProgress,
    handleSave,
    handleNext,
    handlePrevious,
    handleSectionClick,
    handleSaveDraft,
  } = useTreatmentPlanForm(noteId);

  const progress = ((currentSection + 1) / SECTIONS.length) * 100;
  const sectionProgress = getSectionProgress();

  if (isLoading) {
    return <TreatmentPlanLoadingState />;
  }

  if (!note) {
    return <TreatmentPlanNotFoundState />;
  }

  const clientName = note.client 
    ? `${note.client.firstName} ${note.client.lastName}`
    : undefined;

  return (
    <ErrorBoundary>
      <PageLayout variant="gradient">
        <PageHeader
          icon={Target}
          title="Treatment Plan"
          description={`Client: ${clientName || 'Unknown Client'}`}
          action={
            <TreatmentPlanNavigationHeader
              clientName={clientName}
              progress={progress}
              currentSection={currentSection}
              totalSections={SECTIONS.length}
            />
          }
        />
        
        <TreatmentPlanLayout
          formData={formData}
          currentSection={currentSection}
          sectionProgress={sectionProgress}
          lastSaved={lastSaved}
          isLoading={saveNoteMutation.isPending}
          hasUnsavedChanges={hasUnsavedChanges}
          onSectionClick={handleSectionClick}
        >
          <CurrentSectionCard
            currentSection={currentSection}
            formData={formData}
            updateFormData={updateFormData}
            clientData={note.client}
            onSave={handleSave}
            isLoading={saveNoteMutation.isPending}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSaveDraft={handleSaveDraft}
          />
        </TreatmentPlanLayout>
      </PageLayout>
    </ErrorBoundary>
  );
};

export default TreatmentPlanForm;
