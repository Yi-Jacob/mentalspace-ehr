
import React from 'react';
import { useParams } from 'react-router-dom';
import TreatmentPlanNavigationHeader from './components/TreatmentPlanNavigationHeader';
import TreatmentPlanLayout from './components/TreatmentPlanLayout';
import CurrentSectionCard from './components/CurrentSectionCard';
import { TreatmentPlanLoadingState, TreatmentPlanNotFoundState } from './components/TreatmentPlanStates';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useTreatmentPlanForm } from './hooks/useTreatmentPlanForm';
import { SECTIONS } from './constants/sections';

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
        <TreatmentPlanNavigationHeader
          clientName={clientName}
          progress={progress}
          currentSection={currentSection}
          totalSections={SECTIONS.length}
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
            clientData={note.clients}
            onSave={handleSave}
            isLoading={saveNoteMutation.isPending}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSaveDraft={handleSaveDraft}
          />
        </TreatmentPlanLayout>
      </div>
    </ErrorBoundary>
  );
};

export default TreatmentPlanForm;
