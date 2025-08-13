
import React from 'react';
import { useParams } from 'react-router-dom';
import ContactInfoSection from './components/ContactInfoSection';
import ContactSummarySection from './components/ContactSummarySection';
import RiskAssessmentSection from './components/RiskAssessmentSection';
import ClinicalObservationsSection from './components/ClinicalObservationsSection';
import FollowUpSection from './components/FollowUpSection';
import FinalizationSection from './components/FinalizationSection';
import { useContactNoteData } from './hooks/useContactNoteData';
import { useContactNoteForm } from './hooks/useContactNoteForm';
import { useContactNoteSave } from './hooks/useContactNoteSave';
import OneSectionNoteEditLayout from '@/pages/notes/components/layout/OneSectionNoteEditLayout';
import { Phone } from 'lucide-react';

const ContactNoteForm = () => {
  const { noteId } = useParams();
  
  const { data: noteData } = useContactNoteData(noteId);
  const { formData, updateFormData, validateForm } = useContactNoteForm(noteData);
  const { isLoading, handleSave } = useContactNoteSave(noteId);

  const handleSaveDraft = () => handleSave(formData, true, validateForm);
  const handleFinalize = () => handleSave(formData, false, validateForm);

  return (
    <OneSectionNoteEditLayout
      icon={Phone}
      title="Contact Note"
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
      finalizeButtonColor="teal"
    >
      <ContactInfoSection 
        formData={formData} 
        updateFormData={updateFormData} 
      />
      
      <ContactSummarySection 
        formData={formData} 
        updateFormData={updateFormData} 
      />

      <RiskAssessmentSection 
        formData={formData} 
        updateFormData={updateFormData} 
      />

      <ClinicalObservationsSection 
        formData={formData} 
        updateFormData={updateFormData} 
      />

      <FollowUpSection 
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

export default ContactNoteForm;
