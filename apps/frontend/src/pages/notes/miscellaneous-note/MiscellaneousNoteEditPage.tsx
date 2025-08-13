
import React from 'react';
import { useParams } from 'react-router-dom';
import BasicInfoSection from './components/BasicInfoSection';
import ContentSection from './components/ContentSection';
import RelatedPersonsSection from './components/RelatedPersonsSection';
import LegalComplianceSection from './components/LegalComplianceSection';
import OutcomesSection from './components/OutcomesSection';
import FinalizationSection from './components/FinalizationSection';
import { useMiscellaneousNoteData } from './hooks/useMiscellaneousNoteData';
import { useMiscellaneousNoteForm } from './hooks/useMiscellaneousNoteForm';
import { useMiscellaneousNoteSave } from './hooks/useMiscellaneousNoteSave';
import OneSectionNoteEditLayout from '@/pages/notes/components/layout/OneSectionNoteEditLayout';
import { FileText } from 'lucide-react';

const MiscellaneousNoteForm = () => {
  const { noteId } = useParams();
  
  const { data: noteData } = useMiscellaneousNoteData(noteId);
  const { formData, updateFormData, validateForm } = useMiscellaneousNoteForm(noteData);
  const { isLoading, handleSave } = useMiscellaneousNoteSave(noteId);

  const handleSaveDraft = () => handleSave(formData, true, validateForm);
  const handleFinalize = () => handleSave(formData, false, validateForm);

  return (
    <OneSectionNoteEditLayout
      icon={FileText}
      title="Miscellaneous Note"
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
      finalizeButtonColor="gray"
      backButtonText="Back to Documentation"
    >
      <BasicInfoSection
        formData={formData}
        updateFormData={updateFormData}
      />

      <ContentSection
        formData={formData}
        updateFormData={updateFormData}
      />

      <RelatedPersonsSection
        formData={formData}
        updateFormData={updateFormData}
      />

      <LegalComplianceSection
        formData={formData}
        updateFormData={updateFormData}
      />

      <OutcomesSection
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

export default MiscellaneousNoteForm;
