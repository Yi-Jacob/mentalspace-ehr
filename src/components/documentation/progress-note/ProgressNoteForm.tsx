
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
import ErrorBoundary from '@/components/ErrorBoundary';

const ProgressNoteForm = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  
  const [currentSection, setCurrentSection] = useState(0);
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

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (noteId && !note?.status?.includes('signed')) {
        saveNoteMutation.mutate({ data: formData, isDraft: true });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [formData, noteId, note?.status]);

  const updateFormData = (updates: Partial<ProgressNoteFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleSave = async (isDraft: boolean) => {
    console.log('handleSave called with isDraft:', isDraft, 'formData:', formData);
    await saveNoteMutation.mutateAsync({ data: formData, isDraft });
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
  };

  const CurrentSectionComponent = SECTIONS[currentSection].component;
  const progress = ((currentSection + 1) / SECTIONS.length) * 100;

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

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <ProgressNoteNavigationHeader
          clientName={clientName}
          progress={progress}
          currentSection={currentSection}
          totalSections={SECTIONS.length}
        />
        
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <SectionNavigation
              sections={SECTIONS}
              currentSection={currentSection}
              onSectionClick={handleSectionClick}
            />

            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>{SECTIONS[currentSection].title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ErrorBoundary>
                    <CurrentSectionComponent
                      formData={formData}
                      updateFormData={updateFormData}
                      clientData={note.clients}
                      {...(currentSection === SECTIONS.length - 1 && {
                        onSave: handleSave,
                        isLoading: saveNoteMutation.isPending
                      })}
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
