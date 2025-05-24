
export interface ClinicalNote {
  id: string;
  client_id: string;
  provider_id: string;
  note_type: 'intake' | 'progress_note' | 'treatment_plan' | 'cancellation_note' | 'contact_note' | 'consultation_note' | 'miscellaneous_note';
  title: string;
  content: Record<string, any>;
  status: 'draft' | 'signed' | 'submitted_for_review' | 'approved' | 'rejected' | 'locked';
  signed_at?: string;
  signed_by?: string;
  approved_at?: string;
  approved_by?: string;
  co_signed_at?: string;
  co_signed_by?: string;
  locked_at?: string;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface IntakeAssessment {
  // Client Overview
  client_id: string;
  intake_date: string;
  
  // Presenting Problem
  primary_presenting_problem: string;
  additional_concerns: string[];
  symptom_onset: string;
  symptom_severity: string;
  detailed_description: string;
  impact_on_functioning: string;
  
  // Treatment History
  has_prior_treatment: boolean;
  treatment_history?: TreatmentHistoryEntry[];
  
  // Medical & Psychiatric History
  medical_conditions: string;
  current_medications: Medication[];
  medication_allergies: string;
  family_psychiatric_history: string;
  
  // Substance Use
  substance_use_history: SubstanceUseEntry[];
  no_substance_use: boolean;
  
  // Risk Assessment
  risk_factors: string[];
  no_acute_risks: boolean;
  risk_details: string;
  safety_plan: string;
  
  // Psychosocial Information
  relationship_status: string;
  occupation: string;
  living_situation: string;
  social_support: string;
  current_stressors: string;
  strengths_coping: string;
  
  // Diagnosis
  diagnoses: DiagnosisEntry[];
  
  // Signature
  is_finalized: boolean;
  signature_timestamp?: string;
}

export interface TreatmentHistoryEntry {
  id?: string;
  treatment_type: string;
  provider_name: string;
  start_date?: string;
  end_date?: string;
  effectiveness_rating?: number;
  notes?: string;
}

export interface Medication {
  id?: string;
  name: string;
  dosage?: string;
  frequency?: string;
  prescribing_doctor?: string;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
}

export interface SubstanceUseEntry {
  id?: string;
  substance_type: string;
  frequency?: string;
  amount?: string;
  start_date?: string;
  end_date?: string;
  is_current: boolean;
  notes?: string;
}

export interface DiagnosisEntry {
  id?: string;
  code: string;
  description: string;
  type: 'primary' | 'secondary';
}

export interface ProgressNote {
  format: 'SOAP' | 'DAP';
  session_date: string;
  session_duration: number;
  
  // SOAP Format
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  
  // DAP Format
  data?: string;
  dap_assessment?: string;
  dap_plan?: string;
  
  // Common fields
  goals_addressed: string[];
  interventions_used: string[];
  client_response: string;
  homework_assigned?: string;
  next_session_plan?: string;
  billing_code?: string;
}

export interface TreatmentPlan {
  goals: TreatmentGoal[];
  review_date: string;
  client_involvement: string;
  signature_required: boolean;
  client_signature?: string;
  provider_signature?: string;
}

export interface TreatmentGoal {
  id?: string;
  goal_text: string;
  objectives: GoalObjective[];
  target_date?: string;
  priority: number;
  is_achieved: boolean;
  achieved_date?: string;
}

export interface GoalObjective {
  id?: string;
  objective_text: string;
  is_completed: boolean;
  completed_date?: string;
}

export interface CancellationNote {
  cancellation_date: string;
  cancellation_reason: string;
  contact_attempts: ContactAttempt[];
  rescheduled: boolean;
  reschedule_date?: string;
  billing_implications: string;
  pattern_noted: boolean;
  policy_reminder_sent: boolean;
}

export interface ContactAttempt {
  attempt_date: string;
  method: 'phone' | 'email' | 'text';
  outcome: string;
}

export interface ContactNote {
  contact_date: string;
  contact_method: 'phone' | 'email' | 'in_person' | 'text';
  contact_purpose: string;
  duration_minutes?: number;
  summary: string;
  outcome: string;
  follow_up_needed: boolean;
  follow_up_actions?: string;
  billable: boolean;
}

export interface ConsultationNote {
  consultation_date: string;
  consultation_type: string;
  participants: string[];
  purpose: string;
  discussion_summary: string;
  recommendations: string[];
  follow_up_actions: string[];
  billing_code?: string;
}

export interface MiscellaneousNote {
  category: string;
  content: string;
  attachments?: string[];
  shared_with?: string[];
  tags?: string[];
}
