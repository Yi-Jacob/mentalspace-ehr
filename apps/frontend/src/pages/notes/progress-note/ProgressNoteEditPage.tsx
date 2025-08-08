
import React from 'react';
import { useParams } from 'react-router-dom';
import ProgressNoteNavigationHeader from './components/ProgressNoteNavigationHeader';
import ProgressNoteLayout from './components/ProgressNoteLayout';
import CurrentSectionCard from './components/CurrentSectionCard';
import { ProgressNoteLoadingState, ProgressNoteNotFoundState } from './components/ProgressNoteStates';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useProgressNoteForm } from './hooks/useProgressNoteForm';
import { SECTIONS } from './constants/sections';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import { FileText } from 'lucide-react';

const ProgressNoteForm = () => {
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
  } = useProgressNoteForm(noteId);

  const progress = ((currentSection + 1) / SECTIONS.length) * 100;
  const sectionProgress = getSectionProgress();

  if (isLoading) {
    return <ProgressNoteLoadingState />;
  }

  if (!note) {
    return <ProgressNoteNotFoundState />;
  }

  const clientName = note.client 
    ? `${note.client.firstName} ${note.client.lastName}`
    : undefined;

  return (
    <ErrorBoundary>
      <PageLayout variant="gradient">
        <PageHeader
          icon={FileText}
          title="Progress Note"
          description={`Client: ${clientName || 'Unknown Client'}`}
          action={
            <ProgressNoteNavigationHeader
              clientName={clientName}
              progress={progress}
              currentSection={currentSection}
              totalSections={SECTIONS.length}
            />
          }
        />
        
        <ProgressNoteLayout
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
        </ProgressNoteLayout>
      </PageLayout>
    </ErrorBoundary>
  );
};

export default ProgressNoteForm;
