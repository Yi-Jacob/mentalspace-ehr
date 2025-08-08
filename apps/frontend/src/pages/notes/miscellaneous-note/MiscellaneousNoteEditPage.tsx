
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/basic/card';
import ClientInfoDisplay from '@/pages/notes/components/shared/ClientInfoDisplay';
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
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import { FileText } from 'lucide-react';

const MiscellaneousNoteForm = () => {
  const { noteId } = useParams();
  
  const { data: noteData } = useMiscellaneousNoteData(noteId);
  const { formData, updateFormData, validateForm } = useMiscellaneousNoteForm(noteData);
  const { isLoading, handleSave } = useMiscellaneousNoteSave(noteId);

  const clientName = noteData?.client 
    ? `${noteData.client.firstName} ${noteData.client.lastName}`
    : 'Unknown Client';

  const canFinalize = validateForm() && !!formData.signature;

  const handleSaveDraft = () => handleSave(formData, true, validateForm);
  const handleFinalize = () => handleSave(formData, false, validateForm);

  return (
    <PageLayout variant="gradient">
      <PageHeader
        icon={FileText}
        title="Miscellaneous Note"
        description={`Client: ${clientName}`}
        action={
          <div className="flex space-x-2">
            <MiscellaneousNoteHeader
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
    </PageLayout>
  );
};

export default MiscellaneousNoteForm;
