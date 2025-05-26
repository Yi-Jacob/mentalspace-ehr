
import { useState, useEffect } from 'react';
import { ProgressNoteFormData } from '../types/ProgressNoteFormData';
import { SECTIONS } from '../constants/sections';
import { useNoteData } from '../../intake/hooks/useNoteData';
import { useSaveProgressNote } from './useSaveProgressNote';

export const useProgressNoteForm = (noteId?: string) => {
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
