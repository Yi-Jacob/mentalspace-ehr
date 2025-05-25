import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import ClientOverviewSection from './sections/ClientOverviewSection';
import PresentingProblemSection from './sections/PresentingProblemSection';
import TreatmentHistorySection from './sections/TreatmentHistorySection';
import MedicalHistorySection from './sections/MedicalHistorySection';
import SubstanceUseSection from './sections/SubstanceUseSection';
import RiskAssessmentSection from './sections/RiskAssessmentSection';
import PsychosocialSection from './sections/PsychosocialSection';
import DiagnosisSection from './sections/DiagnosisSection';
import FinalizeSection from './sections/FinalizeSection';

const SECTIONS = [
  { id: 'overview', title: 'Client Overview', component: ClientOverviewSection },
  { id: 'presenting', title: 'Presenting Problem', component: PresentingProblemSection },
  { id: 'treatment', title: 'Treatment History', component: TreatmentHistorySection },
  { id: 'medical', title: 'Medical & Psychiatric History', component: MedicalHistorySection },
  { id: 'substance', title: 'Substance Use', component: SubstanceUseSection },
  { id: 'risk', title: 'Risk Assessment', component: RiskAssessmentSection },
  { id: 'psychosocial', title: 'Psychosocial Information', component: PsychosocialSection },
  { id: 'diagnosis', title: 'Diagnosis', component: DiagnosisSection },
  { id: 'finalize', title: 'Finalize Intake', component: FinalizeSection },
];

export interface IntakeFormData {
  // Client Overview
  clientId: string;
  intakeDate: string;
  
  // Presenting Problem
  primaryProblem: string;
  additionalConcerns: string[];
  symptomOnset: string;
  symptomSeverity: string;
  detailedDescription: string;
  impactOnFunctioning: string;
  
  // Treatment History
  hasPriorTreatment: boolean;
  treatmentTypes: string[];
  treatmentDetails: string;
  treatmentEffectiveness: string;
  
  // Medical History
  medicalConditions: string;
  currentMedications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    prescriber: string;
  }>;
  medicationAllergies: string;
  familyPsychiatricHistory: string;
  
  // Substance Use
  substanceUseHistory: Record<string, {
    current: boolean;
    past: boolean;
    frequency?: string;
    amount?: string;
    notes?: string;
  }>;
  noSubstanceUse: boolean;
  
  // Risk Assessment
  riskFactors: string[];
  noAcuteRisk: boolean;
  riskDetails: string;
  safetyPlan: string;
  
  // Psychosocial
  relationshipStatus: string;
  occupation: string;
  livingSituation: string;
  socialSupport: string;
  currentStressors: string;
  strengthsCoping: string;
  
  // Diagnosis
  primaryDiagnosis: string;
  secondaryDiagnoses: string[];
  
  // Finalization
  isFinalized: boolean;
  signature: string;
  signedBy: string;
  signedAt: string;
}

const IntakeAssessmentForm = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
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

  // Load existing note data - Modified to handle notes without clients
  const { data: note, isLoading } = useQuery({
    queryKey: ['clinical-note', noteId],
    queryFn: async () => {
      if (!noteId) return null;
      
      console.log('Fetching note with ID:', noteId);
      
      // First fetch the note without joining clients
      const { data: noteData, error: noteError } = await supabase
        .from('clinical_notes')
        .select('*')
        .eq('id', noteId)
        .single();
      
      if (noteError) {
        console.error('Error fetching note:', noteError);
        throw noteError;
      }
      
      console.log('Note data:', noteData);
      
      // If note has a client_id, fetch the client data separately
      if (noteData.client_id) {
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('id, first_name, last_name, date_of_birth')
          .eq('id', noteData.client_id)
          .single();
        
        if (clientError) {
          console.error('Error fetching client:', clientError);
          // Don't throw error for client fetch failure, just proceed without client data
        }
        
        return {
          ...noteData,
          clients: clientData
        };
      }
      
      // Return note without client data if no client is linked
      return {
        ...noteData,
        clients: null
      };
    },
    enabled: !!noteId,
  });

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

  // Updated save mutation with proper finalization handling
  const saveNoteMutation = useMutation({
    mutationFn: async ({ data, isDraft }: { data: Partial<IntakeFormData>; isDraft: boolean }) => {
      if (!noteId) throw new Error('No note ID');
      
      const finalData = { ...formData, ...data };
      const status = isDraft ? 'draft' : finalData.isFinalized ? 'signed' : 'pending_signature';
      
      console.log('Saving note with status:', status, 'isDraft:', isDraft, 'data:', finalData);
      
      const { error } = await supabase
        .from('clinical_notes')
        .update({
          content: finalData,
          status: status,
          updated_at: new Date().toISOString(),
          ...(finalData.isFinalized && {
            signed_by: user?.id,
            signed_at: new Date().toISOString(),
          }),
        })
        .eq('id', noteId);
      
      if (error) throw error;
      return { isDraft, isFinalized: finalData.isFinalized };
    },
    onSuccess: ({ isDraft, isFinalized }) => {
      queryClient.invalidateQueries({ queryKey: ['clinical-note', noteId] });
      
      if (isDraft) {
        toast({
          title: 'Draft Saved',
          description: 'Your intake assessment has been saved as a draft. A confirmation email will be sent.',
        });
      } else if (isFinalized) {
        toast({
          title: 'Assessment Completed',
          description: 'Your intake assessment has been finalized and signed. A confirmation email will be sent.',
        });
      }
      
      // Redirect to documentation page
      setTimeout(() => {
        navigate('/documentation');
      }, 2000);
    },
    onError: (error) => {
      console.error('Error saving note:', error);
      toast({
        title: 'Error saving assessment',
        description: 'There was an error saving the intake assessment. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (noteId && !note?.status?.includes('signed')) {
        saveNoteMutation.mutate(formData);
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Intake Assessment</CardTitle>
                <p className="text-gray-600 mt-1">
                  {note.clients ? (
                    `Client: ${note.clients.first_name} ${note.clients.last_name}`
                  ) : (
                    'No client assigned - Please select a client in the overview section'
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Progress</p>
                <div className="w-32">
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">
                    {currentSection + 1} of {SECTIONS.length}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Sections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {SECTIONS.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionClick(index)}
                  className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                    index === currentSection
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : index < currentSection
                      ? 'bg-green-50 text-green-700 hover:bg-green-100'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      index === currentSection
                        ? 'bg-blue-600 text-white'
                        : index < currentSection
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1}
                    </span>
                    <span>{section.title}</span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Main Content */}
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
                  onSave={currentSection === SECTIONS.length - 1 ? handleSave : undefined}
                  isLoading={saveNoteMutation.isPending}
                />
                
                {/* Navigation - only show for sections other than Finalize */}
                {currentSection < SECTIONS.length - 1 && (
                  <div className="flex justify-between mt-8 pt-6 border-t">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentSection === 0}
                    >
                      Previous
                    </Button>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => saveNoteMutation.mutate({ data: formData, isDraft: true })}
                        disabled={saveNoteMutation.isPending}
                      >
                        {saveNoteMutation.isPending ? 'Saving...' : 'Save Draft'}
                      </Button>
                      
                      <Button onClick={handleNext}>
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntakeAssessmentForm;
