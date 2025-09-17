export interface ClientInfo {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  email?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  genderIdentity?: string;
}

export interface ProviderInfo {
  id: string;
  firstName: string;
  lastName: string;
}

export interface Note {
  id: string;
  title: string;
  content: Record<string, any>;
  clientId: string;
  providerId: string;
  noteType: NoteType;
  status: NoteStatus;
  signedAt?: string;
  signedBy?: string;
  approvedAt?: string;
  approvedBy?: string;
  coSignedAt?: string;
  coSignedBy?: string;
  lockedAt?: string;
  lockedBy?: string;
  unlockedAt?: string;
  unlockedBy?: string;
  version?: number;
  createdAt: string;
  updatedAt: string;
  client?: ClientInfo;
  provider?: ProviderInfo;
}

export type NoteType = 
  | 'intake'
  | 'progress_note'
  | 'treatment_plan'
  | 'contact_note'
  | 'consultation_note'
  | 'cancellation_note'
  | 'miscellaneous_note';

export type NoteStatus = 
  | 'draft'
  | 'pending_co_sign'
  | 'accepted'
  | 'locked';

export interface CreateNoteRequest {
  title: string;
  content: Record<string, any>;
  clientId: string;
  noteType: NoteType;
  status?: NoteStatus;
}

export interface UpdateNoteRequest {
  title?: string;
  content?: Record<string, any>;
  status?: NoteStatus;
}

export interface QueryNotesParams {
  page?: number;
  limit?: number;
  clientId?: string;
  noteType?: string;
  status?: string;
}

export interface NotesResponse {
  notes: Note[];
  total: number;
}

// ============================================================================
// INTAKE ASSESSMENT TYPES
// ============================================================================

export interface IntakeFormData {
  clientId: string;
  intakeDate: string;
  primaryPhone: string; // Now stores the clientPhoneNumber.id
  primaryEmail: string;
  primaryInsurance: string; // Now stores the clientInsurance.id
  cptCode: string;
  primaryProblem: string;
  additionalConcerns: string[];
  symptomOnset: string;
  symptomSeverity: string;
  detailedDescription: string;
  impactOnFunctioning: string;
  hasPriorTreatment: boolean;
  treatmentTypes: string[];
  treatmentDetails: string;
  treatmentEffectiveness: string;
  medicalConditions: string;
  currentMedications: string[];
  medicationAllergies: string;
  familyPsychiatricHistory: string;
  substanceUseHistory: Record<string, any>;
  noSubstanceUse: boolean;
  riskFactors: string[];
  noAcuteRisk: boolean;
  riskDetails: string;
  safetyPlan: string;
  relationshipStatus: string;
  occupation: string;
  livingSituation: string;
  socialSupport: string;
  currentStressors: string;
  strengthsCoping: string;
  primaryDiagnosis: string;
  secondaryDiagnoses: string[];
  signature: string;
  signedBy: string;
  signedAt: string;
}

// ============================================================================
// TREATMENT PLAN TYPES
// ============================================================================

export interface TreatmentPlanFormData {
  clientId: string;
  
  // Client Overview fields (matching intake form)
  treatmentPlanDate?: string;
  primaryPhone?: string;
  primaryEmail?: string;
  primaryInsurance?: string;
  cptCode?: string;
  
  // Diagnosis
  primaryDiagnosis: string;
  secondaryDiagnoses: string[];
  
  // Presenting Problem
  presentingProblem: string;
  functionalImpairments: string[];
  strengths: string[];
  
  // Treatment Goals
  treatmentGoals: Array<{
    id: string;
    goalText: string;
    objectives: Array<{
      id: string;
      text: string;
      objectiveText: string;
      targetDate: string;
      estimatedCompletion: string;
      completionDate: string;
      method: string;
      frequency: string;
      strategies: string[];
    }>;
    targetDate: string;
    priority: 'High' | 'Medium' | 'Low';
  }>;
  
  // Discharge Planning
  dischargeCriteria: string;
  estimatedDuration: string;
  aftercareRecommendations: string;
  
  // Additional Information
  additionalInformation: string;
  medicalConsiderations: string;
  psychosocialFactors: string;
  culturalConsiderations: string;
  
  // Frequency
  sessionFrequency: string;
  sessionDuration: string;
  modality: string;
  prescribedFrequency: string;
  medicalNecessityDeclaration: boolean;
  
  // Finalization
  isFinalized: boolean;
  signature: string;
  signedBy: string;
  signedAt: string;
}

// ============================================================================
// PROGRESS NOTE TYPES
// ============================================================================

export interface ProgressNoteFormData {
  clientId: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  serviceCode: string;
  location: string;
  participants: string;
  
  // Diagnosis Section
  primaryDiagnosis: string;
  secondaryDiagnoses: string[];
  
  // Current Mental Status
  orientation: string;
  generalAppearance: string;
  dress: string;
  motorActivity: string;
  interviewBehavior: string;
  speech: string;
  mood: string;
  affect: string;
  insight: string;
  judgmentImpulseControl: string;
  memory: string;
  attentionConcentration: string;
  thoughtProcess: string;
  thoughtContent: string;
  perception: string;
  functionalStatus: string;
  
  // Risk Assessment
  riskAreas: Array<{
    areaOfRisk: string;
    levelOfRisk: 'Low' | 'Medium' | 'High' | 'Imminent';
    intentToAct: 'Yes' | 'No' | 'Not Applicable';
    planToAct: 'Yes' | 'No' | 'Not Applicable';
    meansToAct: 'Yes' | 'No' | 'Not Applicable';
    riskFactors: string;
    protectiveFactors: string;
    additionalDetails: string;
  }>;
  noRiskPresent: boolean;
  
  // Medications
  medicationsContent: string;
  
  // Content Sections
  symptomDescription: string;
  objectiveContent: string;
  
  // Interventions Used
  selectedInterventions: string[];
  otherInterventions: string;
  
  // Treatment Plan Progress
  objectives: Array<{
    objectiveText: string;
    progress: string;
  }>;
  
  // Planning
  planContent: string;
  recommendation: 'Continue current therapeutic focus' | 'Change treatment goals or objectives' | 'Terminate treatment';
  prescribedFrequency: string;
  
  // Finalization
  isFinalized: boolean;
  signature: string;
  signedBy: string;
  signedAt: string;
}

// ============================================================================
// CONTACT NOTE TYPES
// ============================================================================

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

// ============================================================================
// CONSULTATION NOTE TYPES
// ============================================================================

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
  
  // Index signature for Json compatibility
  [key: string]: any;
}

// ============================================================================
// CANCELLATION NOTE TYPES
// ============================================================================

export interface CancellationNoteFormData {
  // Basic Information
  clientId: string;
  noteDate: string;
  sessionDate: string;
  sessionTime: string;
  
  // Cancellation Details
  cancellationReason: string;
  cancellationInitiator: 'client' | 'provider' | 'emergency' | 'system';
  notificationMethod: 'phone' | 'email' | 'text' | 'in_person' | 'no_show';
  advanceNoticeHours: number;
  
  // Billing & Policy
  billingStatus: 'billed' | 'not_billed' | 'partial_charge' | 'pending_review';
  chargeAmount: number;
  policyViolation: boolean;
  policyDetails: string;
  
  // Rescheduling
  willReschedule: boolean;
  rescheduleDate: string;
  rescheduleTime: string;
  rescheduleNotes: string;
  
  // Follow-up Actions
  followUpRequired: boolean;
  followUpActions: string[];
  providerNotes: string;
  
  // Documentation
  signature: string;
  isFinalized: boolean;
  signedBy?: string;
  signedAt?: string;
}

// ============================================================================
// MISCELLANEOUS NOTE TYPES
// ============================================================================

export interface MiscellaneousNoteFormData {
  // Basic Information
  clientId: string;
  noteDate: string;
  eventDate: string;
  
  // Note Classification
  noteCategory: 'administrative' | 'legal' | 'insurance' | 'coordination_of_care' | 'incident_report' | 'other';
  noteSubtype: string;
  urgencyLevel: 'low' | 'medium' | 'high' | 'urgent';
  
  // Content
  noteTitle: string;
  noteDescription: string;
  detailedNotes: string;
  
  // Related Information
  relatedPersons: Array<{
    name: string;
    relationship: string;
    role: string;
  }>;
  
  // Documentation & Attachments
  documentsReferenced: string[];
  actionsTaken: string[];
  followUpRequired: boolean;
  followUpDetails: string;
  
  // Legal & Compliance
  mandatoryReporting: boolean;
  reportingDetails: string;
  legalImplications: string;
  
  // Outcomes
  resolution: string;
  outcomeSummary: string;
  
  // Documentation
  signature: string;
  isFinalized: boolean;
  signedBy?: string;
  signedAt?: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface FilterOptions {
  status?: string;
  noteType?: string;
  clientId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface DiagnosisOption {
  code: string;
  description: string;
}

export type SortOrder = 'asc' | 'desc';

export type SortField = 'title' | 'status' | 'noteType' | 'createdAt' | 'updatedAt' | 'clientName';

// ============================================================================
// UNION TYPE FOR ALL FORM DATA
// ============================================================================

export type NoteFormData = 
  | IntakeFormData
  | TreatmentPlanFormData
  | ProgressNoteFormData
  | ContactNoteFormData
  | ConsultationNoteFormData
  | CancellationNoteFormData
  | MiscellaneousNoteFormData;

// ============================================================================
// COMMON INTERFACES
// ============================================================================

export interface BaseNoteFormData {
  clientId: string;
  isFinalized: boolean;
  signature: string;
  signedBy?: string;
  signedAt?: string;
}

export interface RiskAssessment {
  areaOfRisk: string;
  levelOfRisk: 'Low' | 'Medium' | 'High' | 'Imminent';
  intentToAct: 'Yes' | 'No' | 'Not Applicable';
  planToAct: 'Yes' | 'No' | 'Not Applicable';
  meansToAct: 'Yes' | 'No' | 'Not Applicable';
  riskFactors: string;
  protectiveFactors: string;
  additionalDetails: string;
}

export interface TreatmentGoal {
  id: string;
  goalText: string;
  objectives: Array<{
    id: string;
    text: string;
    objectiveText: string;
    targetDate: string;
    estimatedCompletion: string;
    completionDate: string;
    method: string;
    frequency: string;
    strategies: string[];
  }>;
  targetDate: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface Participant {
  id: string;
  name: string;
  role: string;
  organization: string;
}

export interface ActionItem {
  action: string;
  owner: string;
  dueDate: string;
}

export interface RelatedPerson {
  name: string;
  relationship: string;
  role: string;
} 