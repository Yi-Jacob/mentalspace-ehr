import { BaseFormData } from '../hooks/useUnifiedNote';
import { SECTIONS as PROGRESS_SECTIONS } from '../ProgressNoteEditPage/constants/sections';
import { SECTIONS as TREATMENT_SECTIONS } from '../TreatmentPlanEditPage/constants/sections';
import { SECTIONS as INTAKE_SECTIONS } from '../IntakeAssessmentNoteEditPage/constants/sections';

// Progress Note Configuration
export const PROGRESS_NOTE_CONFIG = {
  type: 'progress_note',
  title: 'Progress Note',
  sections: PROGRESS_SECTIONS,
  initialFormData: {
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
  } as BaseFormData,
  sectionProgressRules: (formData: any, sectionId: string) => {
    switch (sectionId) {
      case 'client-overview':
        return {
          isComplete: !!(formData.sessionDate && formData.startTime && formData.endTime && formData.serviceCode),
          hasRequiredFields: true,
          requiredFieldsComplete: !!(formData.sessionDate && formData.startTime && formData.endTime && formData.serviceCode)
        };
      case 'diagnosis':
        return {
          isComplete: !!(formData.primaryDiagnosis),
          hasRequiredFields: true,
          requiredFieldsComplete: !!(formData.primaryDiagnosis)
        };
      case 'mental-status':
        return {
          isComplete: !!(formData.mood && formData.affect),
          hasRequiredFields: true,
          requiredFieldsComplete: !!(formData.mood && formData.affect)
        };
      case 'risk-assessment':
        return {
          isComplete: formData.noRiskPresent || (formData.riskAreas && formData.riskAreas.length > 0),
          hasRequiredFields: true,
          requiredFieldsComplete: formData.noRiskPresent || (formData.riskAreas && formData.riskAreas.length > 0)
        };
      case 'medications':
        return {
          isComplete: !!(formData.medicationsContent),
          hasRequiredFields: false,
          requiredFieldsComplete: true
        };
      case 'content':
        return {
          isComplete: !!(formData.symptomDescription && formData.objectiveContent),
          hasRequiredFields: true,
          requiredFieldsComplete: !!(formData.symptomDescription && formData.objectiveContent)
        };
      case 'interventions':
        return {
          isComplete: !!(formData.selectedInterventions && formData.selectedInterventions.length > 0),
          hasRequiredFields: true,
          requiredFieldsComplete: !!(formData.selectedInterventions && formData.selectedInterventions.length > 0)
        };
      case 'treatment-progress':
        return {
          isComplete: !!(formData.objectives && formData.objectives.length > 0),
          hasRequiredFields: false,
          requiredFieldsComplete: true
        };
      case 'planning':
        return {
          isComplete: !!(formData.planContent && formData.recommendation),
          hasRequiredFields: true,
          requiredFieldsComplete: !!(formData.planContent && formData.recommendation)
        };
      case 'finalize':
        return {
          isComplete: formData.isFinalized,
          hasRequiredFields: true,
          requiredFieldsComplete: !!(formData.signature)
        };
      default:
        return {
          isComplete: false,
          hasRequiredFields: false,
          requiredFieldsComplete: true
        };
    }
  }
};

// Treatment Plan Configuration
export const TREATMENT_PLAN_CONFIG = {
  type: 'treatment_plan',
  title: 'Treatment Plan',
  sections: TREATMENT_SECTIONS,
  initialFormData: {
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
  } as BaseFormData,
  sectionProgressRules: (formData: any, sectionId: string) => {
    switch (sectionId) {
      case 'client-overview':
        return {
          isComplete: !!(formData.clientId),
          hasRequiredFields: true,
          requiredFieldsComplete: !!(formData.clientId)
        };
      case 'diagnosis':
        return {
          isComplete: !!(formData.primaryDiagnosis),
          hasRequiredFields: true,
          requiredFieldsComplete: !!(formData.primaryDiagnosis)
        };
      case 'presenting-problem':
        return {
          isComplete: !!(formData.presentingProblem),
          hasRequiredFields: true,
          requiredFieldsComplete: !!(formData.presentingProblem)
        };
      case 'treatment-goals':
        return {
          isComplete: formData.treatmentGoals && formData.treatmentGoals.length > 0,
          hasRequiredFields: true,
          requiredFieldsComplete: formData.treatmentGoals && formData.treatmentGoals.length > 0
        };
      case 'discharge-planning':
        return {
          isComplete: !!(formData.dischargeCriteria),
          hasRequiredFields: true,
          requiredFieldsComplete: !!(formData.dischargeCriteria)
        };
      case 'additional-info':
        return {
          isComplete: !!(formData.additionalInformation),
          hasRequiredFields: false,
          requiredFieldsComplete: true
        };
      case 'frequency':
        return {
          isComplete: !!(formData.prescribedFrequency && formData.medicalNecessityDeclaration),
          hasRequiredFields: true,
          requiredFieldsComplete: !!(formData.prescribedFrequency && formData.medicalNecessityDeclaration)
        };
      case 'finalize':
        return {
          isComplete: formData.isFinalized,
          hasRequiredFields: true,
          requiredFieldsComplete: !!(formData.signature)
        };
      default:
        return {
          isComplete: false,
          hasRequiredFields: false,
          requiredFieldsComplete: true
        };
    }
  }
};

// Intake Assessment Configuration
export const INTAKE_ASSESSMENT_CONFIG = {
  type: 'intake',
  title: 'Intake Assessment',
  sections: INTAKE_SECTIONS,
  initialFormData: {
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
    signature: '',
    signedBy: '',
    signedAt: '',
  } as BaseFormData,
  validationRules: (formData: any) => {
    const required = [
      'clientId', 'intakeDate', 'primaryProblem', 'primaryDiagnosis'
    ];
    
    return required.every(field => {
      const value = formData[field];
      return value !== undefined && value !== '';
    });
  }
};

// Contact Note Configuration
export const CONTACT_NOTE_CONFIG = {
  type: 'contact_note',
  title: 'Contact Note',
  sections: [
    { id: 'overview', title: 'Contact Overview' },
    { id: 'details', title: 'Contact Details' },
    { id: 'follow-up', title: 'Follow-up' },
    { id: 'finalize', title: 'Finalize' }
  ],
  initialFormData: {
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
  } as BaseFormData,
  validationRules: (formData: any) => {
    const required = [
      'clientId', 'contactDate', 'contactType', 'contactInitiator', 
      'contactDuration', 'contactSummary'
    ];
    
    return required.every(field => {
      const value = formData[field];
      return value !== undefined && value !== '' && value !== 0;
    });
  }
};

// Consultation Note Configuration
export const CONSULTATION_NOTE_CONFIG = {
  type: 'consultation_note',
  title: 'Consultation Note',
  sections: [
    { id: 'overview', title: 'Consultation Overview' },
    { id: 'discussion', title: 'Discussion Points' },
    { id: 'recommendations', title: 'Recommendations' },
    { id: 'finalize', title: 'Finalize' }
  ],
  initialFormData: {
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
  } as BaseFormData,
  validationRules: (formData: any) => {
    const required = [
      'clientId', 'consultationDate', 'consultationType', 'consultationPurpose',
      'consultationDuration', 'presentingConcerns'
    ];
    
    return required.every(field => {
      const value = formData[field];
      return value !== undefined && value !== '' && value !== 0;
    }) && formData.confidentialityAgreement && formData.consentObtained;
  }
};

// Miscellaneous Note Configuration
export const MISCELLANEOUS_NOTE_CONFIG = {
  type: 'miscellaneous_note',
  title: 'Miscellaneous Note',
  sections: [
    { id: 'overview', title: 'Note Overview' },
    { id: 'details', title: 'Note Details' },
    { id: 'actions', title: 'Actions & Follow-up' },
    { id: 'finalize', title: 'Finalize' }
  ],
  initialFormData: {
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
  } as BaseFormData,
  validationRules: (formData: any) => {
    const required = [
      'clientId', 'eventDate', 'noteCategory', 'noteTitle', 'noteDescription'
    ];
    
    return required.every(field => {
      const value = formData[field];
      return value !== undefined && value !== '';
    });
  }
};

// Cancellation Note Configuration
export const CANCELLATION_NOTE_CONFIG = {
  type: 'cancellation_note',
  title: 'Cancellation Note',
  sections: [
    { id: 'overview', title: 'Cancellation Overview' },
    { id: 'details', title: 'Cancellation Details' },
    { id: 'billing', title: 'Billing Information' },
    { id: 'finalize', title: 'Finalize' }
  ],
  initialFormData: {
    clientId: '',
    noteDate: new Date().toISOString().split('T')[0],
    appointmentDate: new Date().toISOString().split('T')[0],
    appointmentTime: '',
    cancellationDate: new Date().toISOString().split('T')[0],
    cancellationTime: '',
    cancellationInitiator: 'client',
    notificationMethod: 'phone',
    cancellationReason: '',
    rescheduled: false,
    newAppointmentDate: '',
    newAppointmentTime: '',
    billingStatus: 'not_billed',
    billingNotes: '',
    signature: '',
    isFinalized: false,
  } as BaseFormData,
  validationRules: (formData: any) => {
    const required = [
      'clientId', 'appointmentDate', 'cancellationDate', 'cancellationInitiator',
      'notificationMethod', 'cancellationReason'
    ];
    
    return required.every(field => {
      const value = formData[field];
      return value !== undefined && value !== '';
    });
  }
};

// Export all configurations
export const NOTE_TYPE_CONFIGS = {
  progress_note: PROGRESS_NOTE_CONFIG,
  treatment_plan: TREATMENT_PLAN_CONFIG,
  intake: INTAKE_ASSESSMENT_CONFIG,
  contact_note: CONTACT_NOTE_CONFIG,
  consultation_note: CONSULTATION_NOTE_CONFIG,
  miscellaneous_note: MISCELLANEOUS_NOTE_CONFIG,
  cancellation_note: CANCELLATION_NOTE_CONFIG,
};
