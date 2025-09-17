
import React from 'react';
import { useParams } from 'react-router-dom';
import { Target } from 'lucide-react';
import { useUnifiedNote } from '../hooks/useUnifiedNote';
import { NOTE_TYPE_CONFIGS } from '../config/noteTypeConfigs';
import SectionStyleNoteEditLayout from '../components/layout/MultiSectionNoteEditLayout';

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
  } = useUnifiedNote(noteId, NOTE_TYPE_CONFIGS.treatment_plan);

  return (
    <SectionStyleNoteEditLayout
      title="Treatment Plan"
      description="Complete treatment plan for client"
      icon={Target}
      sections={NOTE_TYPE_CONFIGS.treatment_plan.sections}
      currentSection={currentSection}
      formData={formData}
      updateFormData={updateFormData}
      note={note}
      isLoading={isLoading}
      saveNoteMutation={saveNoteMutation}
      onSave={handleSave}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onSectionClick={handleSectionClick}
      onSaveDraft={handleSaveDraft}
    />
  );
};

export default TreatmentPlanForm;
