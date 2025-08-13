
import { useState, useEffect } from 'react';
import { TreatmentPlanFormData } from '@/types/noteType';
import { SECTIONS } from '../TreatmentPlanEditPage/constants/sections';
import { useNoteData } from './useIntakeAssessmentNoteData';
import { useSaveTreatmentPlan } from './useTreatmentPlanSave';

export const useTreatmentPlanForm = (noteId?: string) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | undefined>();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [formData, setFormData] = useState<TreatmentPlanFormData>({
    clientId: '',
    primaryDiagnosis: '',
    secondaryDiagnoses: [],
    presentingProblem: '',
    functionalImpairments: [],
    strengths: [],
    treatmentGoals: [],
    dischargeCriteria: '',
    estimatedDuration: '',
    aftercareRecommendations: '',
    additionalInformation: '',
    medicalConsiderations: '',
    psychosocialFactors: '',
    culturalConsiderations: '',
    sessionFrequency: '',
    sessionDuration: '',
    modality: '',
    prescribedFrequency: '',
    medicalNecessityDeclaration: false,
    isFinalized: false,
    signature: '',
    signedBy: '',
    signedAt: '',
  });

  const { data: note, isLoading } = useNoteData(noteId);
  const saveNoteMutation = useSaveTreatmentPlan(noteId, formData);

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

  // Auto-save functionality
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

  const updateFormData = (updates: Partial<TreatmentPlanFormData>) => {
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
          isComplete = !!(formData.clientId);
          requiredFieldsComplete = isComplete;
          break;
        case 'diagnosis':
          isComplete = !!(formData.primaryDiagnosis);
          requiredFieldsComplete = isComplete;
          break;
        case 'presenting-problem':
          isComplete = !!(formData.presentingProblem);
          requiredFieldsComplete = isComplete;
          break;
        case 'treatment-goals':
          isComplete = formData.treatmentGoals && formData.treatmentGoals.length > 0;
          requiredFieldsComplete = isComplete;
          break;
        case 'discharge-planning':
          isComplete = !!(formData.dischargeCriteria);
          requiredFieldsComplete = isComplete;
          break;
        case 'additional-info':
          isComplete = !!(formData.additionalInformation);
          hasRequiredFields = false;
          break;
        case 'frequency':
          isComplete = !!(formData.prescribedFrequency && formData.medicalNecessityDeclaration);
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

  return {
    formData,
    updateFormData,
    currentSection,
    setCurrentSection,
    lastSaved,
    hasUnsavedChanges,
    note,
    isLoading,
    saveNoteMutation,
    getSectionProgress,
    handleSave,
    handleNext,
    handlePrevious,
    handleSectionClick,
    handleSaveDraft,
  };
};
