
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { IntakeFormData } from '@/types/noteType';
import { SECTIONS } from './constants/sections';
import { useNoteData } from './hooks/useNoteData';
import { useSaveNote } from './hooks/useSaveNote';
import SectionStyleNoteEditLayout from '../components/layout/MultiSectionNoteEditLayout';

const IntakeAssessmentForm = () => {
  const { noteId } = useParams();
  
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

  return (
    <SectionStyleNoteEditLayout
      title="Intake Assessment"
      description="Complete intake assessment for client"
      icon={UserPlus}
      sections={SECTIONS}
      currentSection={currentSection}
      formData={formData}
      updateFormData={updateFormData}
      note={note}
      isLoading={isLoading}
      saveNoteMutation={saveNoteMutation}
      onSave={handleSave}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onSectionClick={handleSectionClick}
      onSaveDraft={handleSaveDraft}
    />
  );
};

export default IntakeAssessmentForm;
