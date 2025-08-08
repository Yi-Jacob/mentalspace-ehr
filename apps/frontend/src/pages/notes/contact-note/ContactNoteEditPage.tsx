
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/basic/card';
import ClientInfoDisplay from '@/pages/notes/components/shared/ClientInfoDisplay';
import ContactNoteHeader from './components/ContactNoteHeader';
import ContactNoteNavigationButtons from './components/ContactNoteNavigationButtons';
import ContactInfoSection from './components/ContactInfoSection';
import ContactSummarySection from './components/ContactSummarySection';
import RiskAssessmentSection from './components/RiskAssessmentSection';
import ClinicalObservationsSection from './components/ClinicalObservationsSection';
import FollowUpSection from './components/FollowUpSection';
import FinalizationSection from './components/FinalizationSection';
import { useContactNoteData } from './hooks/useContactNoteData';
import { useContactNoteForm } from './hooks/useContactNoteForm';
import { useContactNoteSave } from './hooks/useContactNoteSave';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import { Phone } from 'lucide-react';

const ContactNoteForm = () => {
  const { noteId } = useParams();
  
  const { data: noteData } = useContactNoteData(noteId);
  const { formData, updateFormData, validateForm } = useContactNoteForm(noteData);
  const { isLoading, handleSave } = useContactNoteSave(noteId);

  const clientName = noteData?.client 
    ? `${noteData.client.firstName} ${noteData.client.lastName}`
    : 'Unknown Client';

  const canFinalize = validateForm() && !!formData.signature;

  const handleSaveDraft = () => handleSave(formData, true, validateForm);
  const handleFinalize = () => handleSave(formData, false, validateForm);

  return (
    <PageLayout variant="gradient">
      <PageHeader
        icon={Phone}
        title="Contact Note"
        description={`Client: ${clientName}`}
        action={
          <div className="flex space-x-2">
            <ContactNoteHeader
              clientName={clientName}
              onSaveDraft={handleSaveDraft}
              onFinalize={handleFinalize}
              isLoading={isLoading}
              canFinalize={canFinalize}
            />
          </div>
        }
      />

      <ClientInfoDisplay clientData={noteData?.client} />

      <Card>
        <CardContent className="p-6 space-y-8">
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

          <ContactNoteNavigationButtons
            onSaveDraft={handleSaveDraft}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default ContactNoteForm;
