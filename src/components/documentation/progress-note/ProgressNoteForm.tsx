import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressNoteFormData } from './types/ProgressNoteFormData';
import { SECTIONS } from './constants/sections';
import { useNoteData } from '../intake/hooks/useNoteData';
import { useSaveProgressNote } from './hooks/useSaveProgressNote';
import ProgressNoteNavigationHeader from './components/ProgressNoteNavigationHeader';
import SectionNavigation from './components/SectionNavigation';
import NavigationButtons from './components/NavigationButtons';
import SectionProgressIndicator from './components/SectionProgressIndicator';
import SaveStatusIndicator from './components/SaveStatusIndicator';
import ClinicalAlerts from './components/ClinicalAlerts';
import ErrorBoundary from '@/components/ErrorBoundary';

const ProgressNoteForm = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  
  const [currentSection, setCurrentSection] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | undefined>();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [formData, setFormData] = useState<ProgressNoteFormData>({
    clientId: '',
    sessionDate: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    duration: 0,
    serviceCode: '90834',
    location: 'office',
    participants: 'client-only',
    primaryDiagnosis: '',
    secondaryDiagnoses: [],
    orientation: '',
    generalAppearance: '',
    dress: '',
    motorActivity: '',
    interviewBehavior: '',
    speech: '',
    mood: '',
    affect: '',
    insight: '',
    judgmentImpulseControl: '',
    memory: '',
    attentionConcentration: '',
    thoughtProcess: '',
    thoughtContent: '',
    perception: '',
    functionalStatus: '',
    riskAreas: [],
    noRiskPresent: false,
    medicationsContent: '',
    symptomDescription: '',
    objectiveContent: '',
    selectedInterventions: [],
    otherInterventions: '',
    objectives: [],
    planContent: '',
    recommendation: 'Continue current therapeutic focus',
    prescribedFrequency: '',
    isFinalized: false,
    signature: '',
    signedBy: '',
    signedAt: '',
  });

  const { data: note, isLoading } = useNoteData(noteId);
  const saveNoteMutation = useSaveProgressNote(noteId, formData);

  // Load form data from note content
  useEffect(() => {
    if (note?.content && typeof note.content === 'object') {
      const savedData = note.content as any;
      setFormData(prev => ({
        ...prev,
        clientId: note.client_id || '',
        ...savedData,
      }));
    }
  }, [note]);

  // Enhanced auto-save with status tracking
  useEffect(() => {
    const interval = setInterval(() => {
      if (noteId && !note?.status?.includes('signed') && hasUnsavedChanges) {
        saveNoteMutation.mutate({ data: formData, isDraft: true });
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [formData, noteId, note?.status, hasUnsavedChanges]);

  const updateFormData = (updates: Partial<ProgressNoteFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  };

  // Section completion logic
  const getSectionProgress = () => {
    return SECTIONS.map((section, index) => {
      let isComplete = false;
      let hasRequiredFields = true;
      let requiredFieldsComplete = true;

      switch (section.id) {
        case 'client-overview':
          isComplete = !!(formData.sessionDate && formData.startTime && formData.endTime && formData.serviceCode);
          requiredFieldsComplete = isComplete;
          break;
        case 'diagnosis':
          isComplete = !!(formData.primaryDiagnosis);
          requiredFieldsComplete = isComplete;
          break;
        case 'mental-status':
          isComplete = !!(formData.mood && formData.affect);
          requiredFieldsComplete = isComplete;
          break;
        case 'risk-assessment':
          isComplete = formData.noRiskPresent || (formData.riskAreas && formData.riskAreas.length > 0);
          requiredFieldsComplete = isComplete;
          break;
        case 'medications':
          isComplete = !!(formData.medicationsContent);
          hasRequiredFields = false;
          break;
        case 'content':
          isComplete = !!(formData.symptomDescription && formData.objectiveContent);
          requiredFieldsComplete = isComplete;
          break;
        case 'interventions':
          isComplete = !!(formData.selectedInterventions && formData.selectedInterventions.length > 0);
          requiredFieldsComplete = isComplete;
          break;
        case 'treatment-progress':
          isComplete = !!(formData.objectives && formData.objectives.length > 0);
          hasRequiredFields = false;
          break;
        case 'planning':
          isComplete = !!(formData.planContent && formData.recommendation);
          requiredFieldsComplete = isComplete;
          break;
        case 'finalize':
          isComplete = formData.isFinalized;
          requiredFieldsComplete = !!(formData.signature);
          break;
        default:
          hasRequiredFields = false;
      }

      return {
        id: section.id,
        title: section.title,
        isComplete,
        hasRequiredFields,
        requiredFieldsComplete
      };
    });
  };

  const handleSave = async (isDraft: boolean) => {
    console.log('handleSave called with isDraft:', isDraft, 'formData:', formData);
    await saveNoteMutation.mutateAsync({ data: formData, isDraft });
    setLastSaved(new Date());
    setHasUnsavedChanges(false);
  };

  const handleNext = () => {
    if (currentSection < SECTIONS.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSectionClick = (index: number) => {
    setCurrentSection(index);
  };

  const handleSaveDraft = () => {
    saveNoteMutation.mutate({ data: formData, isDraft: true });
    setLastSaved(new Date());
    setHasUnsavedChanges(false);
  };

  const CurrentSectionComponent = SECTIONS[currentSection].component;
  const progress = ((currentSection + 1) / SECTIONS.length) * 100;
  const sectionProgress = getSectionProgress();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Note not found</p>
        <Button onClick={() => navigate('/documentation')} className="mt-4">
          Back to Documentation
        </Button>
      </div>
    );
  }

  const clientName = note.clients 
    ? `${note.clients.first_name} ${note.clients.last_name}`
    : undefined;

  // Determine which props to pass based on the section
  const getSectionProps = () => {
    const baseProps = {
      formData,
      updateFormData,
    };

    // Add clientData only for sections that need it
    if (SECTIONS[currentSection].id === 'client-overview') {
      return {
        ...baseProps,
        clientData: note.clients,
      };
    }

    // Add save props only for the finalize section
    if (currentSection === SECTIONS.length - 1) {
      return {
        ...baseProps,
        clientData: note.clients,
        onSave: handleSave,
        isLoading: saveNoteMutation.isPending,
      };
    }

    return baseProps;
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <ProgressNoteNavigationHeader
          clientName={clientName}
          progress={progress}
          currentSection={currentSection}
          totalSections={SECTIONS.length}
        />
        
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Save Status and Clinical Alerts */}
          <div className="flex justify-between items-center">
            <SaveStatusIndicator
              lastSaved={lastSaved}
              isLoading={saveNoteMutation.isPending}
              hasUnsavedChanges={hasUnsavedChanges}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <SectionProgressIndicator
                sections={sectionProgress}
                currentSection={currentSection}
              />
              
              <SectionNavigation
                sections={SECTIONS}
                currentSection={currentSection}
                onSectionClick={handleSectionClick}
              />
            </div>

            <div className="lg:col-span-3 space-y-6">
              <ClinicalAlerts formData={formData} />
              
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                  <CardTitle className="flex items-center space-x-2">
                    <span className="bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {currentSection + 1}
                    </span>
                    <span>{SECTIONS[currentSection].title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ErrorBoundary>
                    <CurrentSectionComponent
                      {...getSectionProps()}
                    />
                  </ErrorBoundary>
                  
                  <NavigationButtons
                    currentSection={currentSection}
                    totalSections={SECTIONS.length}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                    onSaveDraft={handleSaveDraft}
                    isLoading={saveNoteMutation.isPending}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ProgressNoteForm;
