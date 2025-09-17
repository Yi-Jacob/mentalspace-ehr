
import React from 'react';
import { useParams } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useUnifiedNote } from '../hooks/useUnifiedNote';
import { NOTE_TYPE_CONFIGS } from '../config/noteTypeConfigs';
import SectionStyleNoteEditLayout from '../components/layout/MultiSectionNoteEditLayout';

const IntakeAssessmentForm = () => {
  const { noteId } = useParams();
  
  const {
    formData,
    updateFormData,
    currentSection,
    note,
    isLoading,
    saveNoteMutation,
    handleSave,
    handleNext,
    handlePrevious,
    handleSectionClick,
    handleSaveDraft,
  } = useUnifiedNote(noteId, NOTE_TYPE_CONFIGS.intake);

  return (
    <SectionStyleNoteEditLayout
      title="Intake Assessment"
      description="Complete intake assessment for client"
      icon={UserPlus}
      sections={NOTE_TYPE_CONFIGS.intake.sections}
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

export default IntakeAssessmentForm;
