
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import ClientInfoDisplay from '@/pages/documentation/components/shared/ClientInfoDisplay';
import ConsultationNoteHeader from './components/ConsultationNoteHeader';
import ConsultationInfoSection from './components/ConsultationInfoSection';
import ParticipantsSection from './components/ParticipantsSection';
import ClinicalDiscussionSection from './components/ClinicalDiscussionSection';
import RecommendationsSection from './components/RecommendationsSection';
import ActionItemsSection from './components/ActionItemsSection';
import ComplianceSection from './components/ComplianceSection';
import FinalizationSection from './components/FinalizationSection';
import NavigationButtons from '../progress-note/components/NavigationButtons';
import { useConsultationNoteData } from './hooks/useConsultationNoteData';
import { useConsultationNoteForm } from './hooks/useConsultationNoteForm';
import { useConsultationNoteSave } from './hooks/useConsultationNoteSave';

const ConsultationNoteForm = () => {
  const { noteId } = useParams();
  
  const { data: noteData } = useConsultationNoteData(noteId);
  const { formData, updateFormData, validateForm } = useConsultationNoteForm(noteData);
  const { isLoading, handleSave } = useConsultationNoteSave(noteId);

  const clientName = noteData?.clients 
    ? `${noteData.clients.first_name} ${noteData.clients.last_name}`
    : 'Unknown Client';

  const canFinalize = validateForm() && !!formData.signature;

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <ConsultationNoteHeader
          clientName={clientName}
          onSaveDraft={handleSaveDraft}
          onFinalize={handleFinalize}
          isLoading={isLoading}
          canFinalize={canFinalize}
        />

        <ClientInfoDisplay clientData={noteData?.clients} />

        <Card>
          <CardContent className="p-6 space-y-8">
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

            <NavigationButtons
              currentSection={0}
              totalSections={1}
              onPrevious={() => {}}
              onNext={() => {}}
              onSaveDraft={handleSaveDraft}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConsultationNoteForm;
