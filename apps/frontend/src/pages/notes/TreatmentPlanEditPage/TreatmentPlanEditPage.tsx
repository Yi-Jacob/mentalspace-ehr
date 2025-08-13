
import React from 'react';
import { useParams } from 'react-router-dom';
import { Target } from 'lucide-react';
import { useTreatmentPlanForm } from '../hooks/useTreatmentPlanForm';
import { SECTIONS } from './constants/sections';
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
  } = useTreatmentPlanForm(noteId);

  return (
    <SectionStyleNoteEditLayout
      title="Treatment Plan"
      description="Complete treatment plan for client"
      icon={Target}
      sections={SECTIONS}
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
