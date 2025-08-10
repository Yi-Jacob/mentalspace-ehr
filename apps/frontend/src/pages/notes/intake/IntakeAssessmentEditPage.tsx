
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/basic/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { IntakeFormData } from './types/IntakeFormData';
import { SECTIONS } from './constants/sections';
import { useNoteData } from './hooks/useNoteData';
import { useSaveNote } from './hooks/useSaveNote';
import SectionNavigation from './components/SectionNavigation';
import NavigationButtons from './components/NavigationButtons';
import ErrorBoundary from '@/components/ErrorBoundary';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { ArrowLeft, UserPlus, Save, FileText } from 'lucide-react';

const IntakeAssessmentForm = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<IntakeFormData>({
    clientId: '',
    intakeDate: new Date().toISOString().split('T')[0],
    primaryPhone: '',
    primaryEmail: '',
    primaryInsurance: '',
    cptCode: '90791',
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
        clientId: note.clientId || '',
        ...savedData,
      }));
    }
  }, [note]);

  // Auto-save every 30 seconds
  // useEffect(() => {
    // const interval = setInterval(() => {
    //   if (noteId && !note?.status?.includes('signed')) {
    //     saveNoteMutation.mutate({ data: formData, isDraft: true });
    //   }
    // }, 30000);

  //   return () => clearInterval(interval);
  // }, [formData, noteId, note?.status]);

  const updateFormData = useCallback((updates: Partial<IntakeFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

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

  if (isLoading) {
    return (
      <PageLayout>
        <LoadingSpinner message="Loading intake assessment..." />
      </PageLayout>
    );
  }

  if (!note) {
    return (
      <PageLayout>
        <EmptyState
          title="Note not found"
          description="The intake assessment you're looking for doesn't exist or has been removed."
          actionLabel="Back to Notes"
          onAction={() => navigate('/notes')}
          icon={FileText}
        />
      </PageLayout>
    );
  }

  const clientName = note.client 
    ? `${note.client.firstName} ${note.client.lastName}`
    : undefined;

  return (
    <ErrorBoundary>
      <PageLayout variant="gradient">
        <PageHeader
          icon={UserPlus}
          title="Intake Assessment"
          description={`Client: ${clientName || 'Unknown Client'}`}
          action={
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/notes')}
                className="flex items-center space-x-2 hover:bg-gray-50 transition-colors border-gray-300 hover:border-gray-400"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Notes</span>
              </Button>
              
              <Button
                onClick={handleSaveDraft}
                disabled={saveNoteMutation.isPending}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Save className="h-4 w-4 mr-2" />
                {saveNoteMutation.isPending ? 'Saving...' : 'Save Draft'}
              </Button>
            </div>
          }
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          <SectionNavigation
            sections={SECTIONS}
            currentSection={currentSection}
            onSectionClick={handleSectionClick}
          />

          <div className="lg:col-span-3">
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                <CardTitle className="text-xl font-semibold text-gray-800">
                  {SECTIONS[currentSection].title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ErrorBoundary>
                  <CurrentSectionComponent
                    formData={formData}
                    updateFormData={updateFormData}
                    clientData={note.client}
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
      </PageLayout>
    </ErrorBoundary>
  );
};

export default IntakeAssessmentForm;
