import React from 'react';
import { useParams } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { useProgressNoteForm } from './hooks/useProgressNoteForm';
import { SECTIONS } from './constants/sections';
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
  } = useProgressNoteForm(noteId);

  return (
    <SectionStyleNoteEditLayout
      title="Progress Note"
      description="Complete progress note for client"
      icon={FileText}
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

export default ProgressNoteForm;
