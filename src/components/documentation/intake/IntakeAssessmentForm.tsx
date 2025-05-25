import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IntakeFormData } from './types/IntakeFormData';
import { SECTIONS } from './constants/sections';
import { useNoteData } from './hooks/useNoteData';
import { useSaveNote } from './hooks/useSaveNote';
import IntakeNavigationHeader from './components/IntakeNavigationHeader';
import SectionNavigation from './components/SectionNavigation';
import NavigationButtons from './components/NavigationButtons';

const IntakeAssessmentForm = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<IntakeFormData>({
    clientId: '',
    intakeDate: new Date().toISOString().split('T')[0],
    primaryProblem: '',
    additionalConcerns: [],
    symptomOnset: '',
    symptomSeverity: '',
    detailedDescription: '',
    impactOnFunctioning: '',
    hasPriorTreatment: false,
    treatmentTypes: [],
    treatmentDetails: '',
    treatmentEffectiveness: '',
    medicalConditions: '',
    currentMedications: [],
    medicationAllergies: '',
    familyPsychiatricHistory: '',
    substanceUseHistory: {},
    noSubstanceUse: false,
    riskFactors: [],
    noAcuteRisk: false,
    riskDetails: '',
    safetyPlan: '',
    relationshipStatus: '',
    occupation: '',
    livingSituation: '',
    socialSupport: '',
    currentStressors: '',
    strengthsCoping: '',
    primaryDiagnosis: '',
    secondaryDiagnoses: [],
    isFinalized: false,
    signature: '',
    signedBy: '',
    signedAt: '',
  });

  const { data: note, isLoading } = useNoteData(noteId);
  const saveNoteMutation = useSaveNote(noteId, formData);

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

  const updateFormData = (updates: Partial<IntakeFormData>) => {
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
    <div className="min-h-screen bg-gray-50">
      <IntakeNavigationHeader
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
                <CurrentSectionComponent
                  formData={formData}
                  updateFormData={updateFormData}
                  clientData={note.clients}
                  {...(currentSection === SECTIONS.length - 1 && {
                    onSave: handleSave,
                    isLoading: saveNoteMutation.isPending
                  })}
                />
                
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
  );
};

export default IntakeAssessmentForm;
