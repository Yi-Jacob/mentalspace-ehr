
import { useState, useEffect } from 'react';
import { ConsultationNoteFormData } from '@/types/noteType';

export const useConsultationNoteForm = (noteData?: any) => {
  const [formData, setFormData] = useState<ConsultationNoteFormData>({
    clientId: '',
    noteDate: new Date().toISOString().split('T')[0],
    consultationDate: new Date().toISOString().split('T')[0],
    consultationTime: '',
    consultationType: 'case_review',
    consultationPurpose: '',
    consultationDuration: 0,
    participants: [],
    presentingConcerns: '',
    backgroundInformation: '',
    currentTreatment: '',
    discussionPoints: [],
    consultantRecommendations: [],
    agreedUponActions: [],
    treatmentModifications: '',
    additionalResources: [],
    followUpRequired: false,
    followUpPlan: '',
    nextConsultationDate: '',
    actionItemOwners: [],
    confidentialityAgreement: false,
    consentObtained: false,
    signature: '',
    isFinalized: false,
  });

  useEffect(() => {
    if (noteData?.content) {
      const contentData = noteData.content as Record<string, any>;
      setFormData(prev => ({
        ...prev,
        ...contentData,
        clientId: noteData.client_id
      }));
    }
  }, [noteData]);

  const updateFormData = (updates: Partial<ConsultationNoteFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const validateForm = () => {
    const required = [
      'clientId', 'consultationDate', 'consultationType', 'consultationPurpose',
      'consultationDuration', 'presentingConcerns'
    ];
    
    return required.every(field => {
      const value = formData[field as keyof ConsultationNoteFormData];
      return value !== undefined && value !== '' && value !== 0;
    }) && formData.confidentialityAgreement && formData.consentObtained;
  };

  return {
    formData,
    updateFormData,
    validateForm,
  };
};
