
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import ClientInfoDisplay from '@/components/documentation/shared/ClientInfoDisplay';
import MiscellaneousNoteHeader from './components/MiscellaneousNoteHeader';
import MiscellaneousNoteNavigationButtons from './components/MiscellaneousNoteNavigationButtons';
import BasicInfoSection from './components/BasicInfoSection';
import ContentSection from './components/ContentSection';
import RelatedPersonsSection from './components/RelatedPersonsSection';
import LegalComplianceSection from './components/LegalComplianceSection';
import OutcomesSection from './components/OutcomesSection';
import FinalizationSection from './components/FinalizationSection';
import { useMiscellaneousNoteData } from './hooks/useMiscellaneousNoteData';
import { useMiscellaneousNoteForm } from './hooks/useMiscellaneousNoteForm';
import { useMiscellaneousNoteSave } from './hooks/useMiscellaneousNoteSave';

const MiscellaneousNoteForm = () => {
  const { noteId } = useParams();
  
  const { data: noteData } = useMiscellaneousNoteData(noteId);
  const { formData, updateFormData, validateForm } = useMiscellaneousNoteForm(noteData);
  const { isLoading, handleSave } = useMiscellaneousNoteSave(noteId);

  const clientName = noteData?.clients 
    ? `${noteData.clients.first_name} ${noteData.clients.last_name}`
    : 'Unknown Client';

  const canFinalize = validateForm() && !!formData.signature;

  const handleSaveDraft = () => handleSave(formData, true, validateForm);
  const handleFinalize = () => handleSave(formData, false, validateForm);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <MiscellaneousNoteHeader
          clientName={clientName}
          onSaveDraft={handleSaveDraft}
          onFinalize={handleFinalize}
          isLoading={isLoading}
          canFinalize={canFinalize}
        />

        <ClientInfoDisplay clientData={noteData?.clients} />

        <Card>
          <CardContent className="p-6 space-y-8">
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

            <MiscellaneousNoteNavigationButtons
              onSaveDraft={handleSaveDraft}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MiscellaneousNoteForm;
