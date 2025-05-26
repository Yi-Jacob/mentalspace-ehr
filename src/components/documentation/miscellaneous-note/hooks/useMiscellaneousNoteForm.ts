
import { useState, useEffect } from 'react';
import { MiscellaneousNoteFormData } from '../types/MiscellaneousNoteFormData';

export const useMiscellaneousNoteForm = (noteData?: any) => {
  const [formData, setFormData] = useState<MiscellaneousNoteFormData>({
    clientId: '',
    noteDate: new Date().toISOString().split('T')[0],
    eventDate: new Date().toISOString().split('T')[0],
    noteCategory: 'administrative',
    noteSubtype: '',
    urgencyLevel: 'low',
    noteTitle: '',
    noteDescription: '',
    detailedNotes: '',
    relatedPersons: [],
    documentsReferenced: [],
    actionsTaken: [],
    followUpRequired: false,
    followUpDetails: '',
    mandatoryReporting: false,
    reportingDetails: '',
    legalImplications: '',
    resolution: '',
    outcomeSummary: '',
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

  const updateFormData = (updates: Partial<MiscellaneousNoteFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const validateForm = () => {
    const required = [
      'clientId', 'eventDate', 'noteCategory', 'noteTitle', 'noteDescription'
    ];
    
    return required.every(field => {
      const value = formData[field as keyof MiscellaneousNoteFormData];
      return value !== undefined && value !== '';
    });
  };

  return {
    formData,
    updateFormData,
    validateForm,
  };
};
