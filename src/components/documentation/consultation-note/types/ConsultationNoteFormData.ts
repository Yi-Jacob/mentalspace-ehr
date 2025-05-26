
export interface ConsultationNoteFormData {
  // Basic Information
  clientId: string;
  noteDate: string;
  consultationDate: string;
  consultationTime: string;
  
  // Consultation Details
  consultationType: 'case_review' | 'treatment_planning' | 'supervision' | 'peer_consultation' | 'multidisciplinary_team';
  consultationPurpose: string;
  consultationDuration: number; // in minutes
  
  // Participants
  participants: Array<{
    id: string;
    name: string;
    role: string;
    organization: string;
  }>;
  
  // Clinical Discussion
  presentingConcerns: string;
  backgroundInformation: string;
  currentTreatment: string;
  discussionPoints: string[];
  
  // Recommendations & Outcomes
  consultantRecommendations: string[];
  agreedUponActions: string[];
  treatmentModifications: string;
  additionalResources: string[];
  
  // Follow-up & Next Steps
  followUpRequired: boolean;
  followUpPlan: string;
  nextConsultationDate: string;
  actionItemOwners: Array<{
    action: string;
    owner: string;
    dueDate: string;
  }>;
  
  // Documentation
  confidentialityAgreement: boolean;
  consentObtained: boolean;
  signature: string;
  isFinalized: boolean;
  signedBy?: string;
  signedAt?: string;
}
