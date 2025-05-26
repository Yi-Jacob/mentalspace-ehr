
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import ClientInfoDisplay from '@/components/documentation/shared/ClientInfoDisplay';
import ContactNoteHeader from './components/ContactNoteHeader';
import ContactInfoSection from './components/ContactInfoSection';
import ContactSummarySection from './components/ContactSummarySection';
import RiskAssessmentSection from './components/RiskAssessmentSection';
import ClinicalObservationsSection from './components/ClinicalObservationsSection';
import FollowUpSection from './components/FollowUpSection';
import FinalizationSection from './components/FinalizationSection';
import { useContactNoteData } from './hooks/useContactNoteData';
import { useContactNoteForm } from './hooks/useContactNoteForm';
import { useContactNoteSave } from './hooks/useContactNoteSave';

const ContactNoteForm = () => {
  const { noteId } = useParams();
  
  const { data: noteData } = useContactNoteData(noteId);
  const { formData, updateFormData, validateForm } = useContactNoteForm(noteData);
  const { isLoading, handleSave } = useContactNoteSave(noteId);

  const clientName = noteData?.clients 
    ? `${noteData.clients.first_name} ${noteData.clients.last_name}`
    : 'Unknown Client';

  const canFinalize = validateForm() && formData.signature;

  const handleSaveDraft = () => handleSave(formData, true, validateForm);
  const handleFinalize = () => handleSave(formData, false, validateForm);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <ContactNoteHeader
          clientName={clientName}
          onSaveDraft={handleSaveDraft}
          onFinalize={handleFinalize}
          isLoading={isLoading}
          canFinalize={canFinalize}
        />

        <ClientInfoDisplay clientData={noteData?.clients} />

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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactNoteForm;
