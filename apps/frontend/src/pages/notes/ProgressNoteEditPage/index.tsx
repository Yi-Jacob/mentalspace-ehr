import React from 'react';
import { useParams } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { useUnifiedNote } from '../hooks/useUnifiedNote';
import { NOTE_TYPE_CONFIGS } from '../config/noteTypeConfigs';
import SectionStyleNoteEditLayout from '../components/layout/MultiSectionNoteEditLayout';

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
  } = useUnifiedNote(noteId, NOTE_TYPE_CONFIGS.progress_note);

  return (
    <SectionStyleNoteEditLayout
      title="Progress Note"
      description="Complete progress note for client"
      icon={FileText}
      sections={NOTE_TYPE_CONFIGS.progress_note.sections}
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

export default ProgressNoteForm;
