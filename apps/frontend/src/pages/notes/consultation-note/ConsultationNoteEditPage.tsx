
import React from 'react';
import { useParams } from 'react-router-dom';
import ConsultationInfoSection from './components/ConsultationInfoSection';
import ParticipantsSection from './components/ParticipantsSection';
import ClinicalDiscussionSection from './components/ClinicalDiscussionSection';
import RecommendationsSection from './components/RecommendationsSection';
import ActionItemsSection from './components/ActionItemsSection';
import ComplianceSection from './components/ComplianceSection';
import FinalizationSection from './components/FinalizationSection';
import { useConsultationNoteData } from './hooks/useConsultationNoteData';
import { useConsultationNoteForm } from './hooks/useConsultationNoteForm';
import { useConsultationNoteSave } from './hooks/useConsultationNoteSave';
import OneSectionNoteEditLayout from '@/pages/notes/components/layout/OneSectionNoteEditLayout';
import { Users } from 'lucide-react';

const ConsultationNoteForm = () => {
  const { noteId } = useParams();
  
  const { data: noteData } = useConsultationNoteData(noteId);
  const { formData, updateFormData, validateForm } = useConsultationNoteForm(noteData);
  const { isLoading, handleSave } = useConsultationNoteSave(noteId);

  const handleSaveDraft = () => handleSave(formData, true, validateForm);
  const handleFinalize = () => handleSave(formData, false, validateForm);

  const addParticipant = () => {
    const newParticipant = {
      id: Date.now().toString(),
      name: '',
      role: '',
      organization: ''
    };
    updateFormData({
      participants: [...formData.participants, newParticipant]
    });
  };

  const updateParticipant = (id: string, field: string, value: string) => {
    const updatedParticipants = formData.participants.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    );
    updateFormData({ participants: updatedParticipants });
  };

  const removeParticipant = (id: string) => {
    updateFormData({
      participants: formData.participants.filter(p => p.id !== id)
    });
  };

  const addActionItem = () => {
    const newAction = {
      action: '',
      owner: '',
      dueDate: ''
    };
    updateFormData({
      actionItemOwners: [...formData.actionItemOwners, newAction]
    });
  };

  const updateActionItem = (index: number, field: string, value: string) => {
    const updatedActions = formData.actionItemOwners.map((action, i) =>
      i === index ? { ...action, [field]: value } : action
    );
    updateFormData({ actionItemOwners: updatedActions });
  };

  const removeActionItem = (index: number) => {
    updateFormData({
      actionItemOwners: formData.actionItemOwners.filter((_, i) => i !== index)
    });
  };

  return (
    <OneSectionNoteEditLayout
      icon={Users}
      title="Consultation Note"
      clientData={noteData?.client}
      onSaveDraft={handleSaveDraft}
      onFinalize={handleFinalize}
      validateForm={validateForm}
      isLoading={isLoading}
      isFinalized={formData.isFinalized}
      signature={formData.signature}
      onSignatureChange={(signature) => updateFormData({ signature })}
      signedBy={formData.signedBy}
      signedAt={formData.signedAt}
      showFinalizationSection={false}
      showBottomActionButtons={false}
      finalizeButtonColor="indigo"
    >
      <ConsultationInfoSection 
        formData={formData} 
        updateFormData={updateFormData} 
      />

      <ParticipantsSection
        participants={formData.participants}
        onAddParticipant={addParticipant}
        onUpdateParticipant={updateParticipant}
        onRemoveParticipant={removeParticipant}
      />

      <ClinicalDiscussionSection
        formData={formData}
        updateFormData={updateFormData}
      />

      <RecommendationsSection
        formData={formData}
        updateFormData={updateFormData}
      />

      <ActionItemsSection
        actionItems={formData.actionItemOwners}
        onAddActionItem={addActionItem}
        onUpdateActionItem={updateActionItem}
        onRemoveActionItem={removeActionItem}
      />

      <ComplianceSection
        formData={formData}
        updateFormData={updateFormData}
      />

      <FinalizationSection
        formData={formData}
        updateFormData={updateFormData}
      />
    </OneSectionNoteEditLayout>
  );
};

export default ConsultationNoteForm;
