
export interface ContactNoteFormData {
  // Basic Information
  clientId: string;
  noteDate: string;
  contactDate: string;
  contactTime: string;
  
  // Contact Details
  contactType: 'phone' | 'email' | 'text' | 'video_call' | 'in_person' | 'collateral';
  contactInitiator: 'client' | 'provider' | 'family' | 'other_provider' | 'emergency';
  contactDuration: number; // in minutes
  
  // Purpose & Content
  contactPurpose: string[];
  contactSummary: string;
  clientMoodStatus: string;
  riskFactorsDiscussed: boolean;
  riskDetails: string;
  
  // Outcomes & Follow-up
  interventionsProvided: string[];
  resourcesProvided: string[];
  followUpRequired: boolean;
  followUpPlan: string;
  nextAppointmentScheduled: boolean;
  nextAppointmentDate: string;
  
  // Clinical Notes
  clinicalObservations: string;
  providerRecommendations: string;
  
  // Documentation
  signature: string;
  isFinalized: boolean;
  signedBy?: string;
  signedAt?: string;
  
  // Index signature for Json compatibility
  [key: string]: any;
}
