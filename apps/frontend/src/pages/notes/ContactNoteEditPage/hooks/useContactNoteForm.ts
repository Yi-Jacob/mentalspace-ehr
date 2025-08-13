
import { useState, useEffect } from 'react';
import { ContactNoteFormData } from '@/types/noteType';

export const useContactNoteForm = (noteData?: any) => {
  const [formData, setFormData] = useState<ContactNoteFormData>({
    clientId: '',
    noteDate: new Date().toISOString().split('T')[0],
    contactDate: new Date().toISOString().split('T')[0],
    contactTime: '',
    contactType: 'phone',
    contactInitiator: 'client',
    contactDuration: 0,
    contactPurpose: [],
    contactSummary: '',
    clientMoodStatus: '',
    riskFactorsDiscussed: false,
    riskDetails: '',
    interventionsProvided: [],
    resourcesProvided: [],
    followUpRequired: false,
    followUpPlan: '',
    nextAppointmentScheduled: false,
    nextAppointmentDate: '',
    clinicalObservations: '',
    providerRecommendations: '',
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

  const updateFormData = (updates: Partial<ContactNoteFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const validateForm = () => {
    const required = [
      'clientId', 'contactDate', 'contactType', 'contactInitiator', 
      'contactDuration', 'contactSummary'
    ];
    
    return required.every(field => {
      const value = formData[field as keyof ContactNoteFormData];
      return value !== undefined && value !== '' && value !== 0;
    });
  };

  return {
    formData,
    updateFormData,
    validateForm,
  };
};
