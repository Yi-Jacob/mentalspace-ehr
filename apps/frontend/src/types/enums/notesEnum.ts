import { FileText, Clipboard, Calendar, Phone, Users, Stethoscope, ClipboardList } from 'lucide-react';

// ============================================================================
// NOTE TYPES CONFIGURATION
// ============================================================================

export interface NoteTypeConfig {
  type: string;
  title: string;
  description: string;
  icon: any;
  color: string;
}

export const NOTE_TYPES: NoteTypeConfig[] = [
  {
    type: 'intake',
    title: 'Intake Assessment',
    description: 'Comprehensive initial assessment for new clients',
    icon: ClipboardList,
    color: 'bg-blue-600',
  },
  {
    type: 'progress_note',
    title: 'Progress Note',
    description: 'Document therapy session progress and interventions',
    icon: FileText,
    color: 'bg-green-600',
  },
  {
    type: 'treatment_plan',
    title: 'Treatment Plan',
    description: 'Create and update comprehensive treatment plans',
    icon: Clipboard,
    color: 'bg-purple-600',
  },
  {
    type: 'cancellation_note',
    title: 'Cancellation Note',
    description: 'Document session cancellations and reasons',
    icon: Calendar,
    color: 'bg-orange-600',
  },
  {
    type: 'contact_note',
    title: 'Contact Note',
    description: 'Record brief client contacts and communications',
    icon: Phone,
    color: 'bg-teal-600',
  },
  {
    type: 'consultation_note',
    title: 'Consultation Note',
    description: 'Document consultations with other providers',
    icon: Users,
    color: 'bg-indigo-600',
  },
  {
    type: 'miscellaneous_note',
    title: 'Miscellaneous Note',
    description: 'General notes for other clinical activities',
    icon: Stethoscope,
    color: 'bg-gray-600',
  },
];

// ============================================================================
// CPT CODES
// ============================================================================

export interface CptCodeOption {
  value: string;
  label: string;
  description: string;
  category?: string;
}

// CPT codes organized by appointment type
export const CPT_CODES_BY_TYPE: Record<string, CptCodeOption[]> = {
  'therapy intake': [
    {
      value: '021701',
      label: '021701 - Private Pay - Therapy Intake',
      description: 'Private Pay - Therapy Intake',
      category: 'Therapy Intake'
    },
    {
      value: '021702',
      label: '021702 - Subscription Private Pay - Therapy Intake',
      description: 'Subscription Private Pay - Therapy Intake',
      category: 'Therapy Intake'
    },
    {
      value: '90791',
      label: '90791 - Psychiatric Diagnostic Evaluation',
      description: 'Comprehensive psychiatric evaluation without medical services',
      category: 'Therapy Intake'
    },
    {
      value: '96156',
      label: '96156 - Assessment or reassessment (60 minutes)',
      description: 'Assessment or reassessment (60 minutes)',
      category: 'Therapy Intake'
    }
  ],
  'therapy session': [
    {
      value: '90834',
      label: '90834 - Psychotherapy, 45 min',
      description: 'Individual psychotherapy, 45 minutes with patient',
      category: 'Therapy Session'
    },
    {
      value: '021703',
      label: '021703 - Private Pay - Therapy Session',
      description: 'Private Pay - Therapy Session',
      category: 'Therapy Session'
    },
    {
      value: '021704',
      label: '021704 - Subscription Private Pay - 30 Min Therapy Session',
      description: 'Subscription Private Pay - 30 Min Therapy Session',
      category: 'Therapy Session'
    },
    {
      value: '90832',
      label: '90832 - Psychotherapy, 30 minutes',
      description: 'Individual psychotherapy, 30 minutes with patient',
      category: 'Therapy Session'
    },
    {
      value: '90837',
      label: '90837 - Psychotherapy, 60 minutes',
      description: 'Individual psychotherapy, 60 minutes with patient',
      category: 'Therapy Session'
    },
    {
      value: '90839',
      label: '90839 - Psychotherapy for crisis; first 60 minutes',
      description: 'Psychotherapy for crisis; first 60 minutes',
      category: 'Therapy Session'
    },
    {
      value: '90846',
      label: '90846 - Family psychotherapy (without patient present)',
      description: 'Family psychotherapy (conjoint psychotherapy) (without patient present)',
      category: 'Therapy Session'
    },
    {
      value: '90847',
      label: '90847 - Family psychotherapy (with patient present)',
      description: 'Family psychotherapy (conjoint psychotherapy) (with patient present)',
      category: 'Therapy Session'
    },
    {
      value: '90853',
      label: '90853 - Group psychotherapy',
      description: 'Group psychotherapy (other than of a multiple-family group)',
      category: 'Therapy Session'
    },
    {
      value: '96158',
      label: '96158 - Intervention individual, 30 minutes',
      description: 'Intervention individual, 30 minutes',
      category: 'Therapy Session'
    },
    {
      value: '99404',
      label: '99404 - Transitional care management services',
      description: 'Transitional care management services',
      category: 'Therapy Session'
    },
    {
      value: 'H0004',
      label: 'H0004 - Behavioral health counseling and therapy',
      description: 'Behavioral health counseling and therapy',
      category: 'Therapy Session'
    },
    {
      value: 'H2011',
      label: 'H2011 - Crisis intervention',
      description: 'Crisis intervention',
      category: 'Therapy Session'
    },
    {
      value: 'H2014',
      label: 'H2014 - Family training',
      description: 'Family training',
      category: 'Therapy Session'
    },
    {
      value: 'H2015',
      label: 'H2015 - Comprehensive Community Support Services CSS',
      description: 'Comprehensive Community Support Services CSS',
      category: 'Therapy Session'
    }
  ],
  'consultation': [
    {
      value: '90000',
      label: '90000 - Consultation - Coaching',
      description: 'Consultation - Coaching',
      category: 'Consultation'
    },
    {
      value: '90001',
      label: '90001 - Consultation Intake - Coaching',
      description: 'Consultation Intake - Coaching',
      category: 'Consultation'
    }
  ],
  'group therapy': [
    {
      value: '90853',
      label: '90853 - Group Therapy',
      description: 'Group psychotherapy (other than of a multiple-family group)',
      category: 'Group Therapy'
    }
  ],
  'psychological evaluation': [
    {
      value: '96136',
      label: '96136 - Psychological test administration and scoring, first 30m',
      description: 'Psychological test administration and scoring, first 30 minutes',
      category: 'Psychological Evaluation'
    }
  ]
};

// CPT codes as a join of all codes from each type
export const CPT_CODES: CptCodeOption[] = Object.values(CPT_CODES_BY_TYPE).flat();

// ============================================================================
// CANCELLATION NOTE ENUMS
// ============================================================================

export interface CancellationInitiatorOption {
  value: string;
  label: string;
}

export const CANCELLATION_INITIATORS: CancellationInitiatorOption[] = [
  { value: 'client', label: 'Client' },
  { value: 'provider', label: 'Provider' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'system', label: 'System/Other' }
];

export interface NotificationMethodOption {
  value: string;
  label: string;
}

export const NOTIFICATION_METHODS: NotificationMethodOption[] = [
  { value: 'phone', label: 'Phone Call' },
  { value: 'email', label: 'Email' },
  { value: 'text', label: 'Text Message' },
  { value: 'in_person', label: 'In Person' },
  { value: 'no_show', label: 'No Show (No Notice)' }
];

export interface BillingStatusOption {
  value: string;
  label: string;
}

export const BILLING_STATUS_OPTIONS: BillingStatusOption[] = [
  { value: 'not_billed', label: 'Not Billed' },
  { value: 'billed', label: 'Full Charge Applied' },
  { value: 'partial_charge', label: 'Partial Charge Applied' },
  { value: 'pending_review', label: 'Pending Review' }
];

// ============================================================================
// CONSULTATION NOTE ENUMS
// ============================================================================

export interface ConsultationTypeOption {
  value: string;
  label: string;
}

export const CONSULTATION_TYPES: ConsultationTypeOption[] = [
  { value: 'case_review', label: 'Case Review' },
  { value: 'treatment_planning', label: 'Treatment Planning' },
  { value: 'supervision', label: 'Clinical Supervision' },
  { value: 'peer_consultation', label: 'Peer Consultation' },
  { value: 'multidisciplinary_team', label: 'Multidisciplinary Team' }
];

// ============================================================================
// CONTACT NOTE ENUMS
// ============================================================================

export interface ContactTypeOption {
  value: string;
  label: string;
}

export const CONTACT_TYPES: ContactTypeOption[] = [
  { value: 'phone', label: 'Phone Call' },
  { value: 'email', label: 'Email' },
  { value: 'text', label: 'Text Message' },
  { value: 'video_call', label: 'Video Call' },
  { value: 'in_person', label: 'In Person' },
  { value: 'collateral', label: 'Collateral Contact' }
];

export interface ContactInitiatorOption {
  value: string;
  label: string;
}

export const CONTACT_INITIATORS: ContactInitiatorOption[] = [
  { value: 'client', label: 'Client' },
  { value: 'provider', label: 'Provider' },
  { value: 'family', label: 'Family Member' },
  { value: 'other_provider', label: 'Other Provider' },
  { value: 'emergency', label: 'Emergency Contact' }
];

// ============================================================================
// MISCELLANEOUS NOTE ENUMS
// ============================================================================

export interface NoteCategoryOption {
  value: string;
  label: string;
}

export const NOTE_CATEGORIES: NoteCategoryOption[] = [
  { value: 'administrative', label: 'Administrative' },
  { value: 'legal', label: 'Legal' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'coordination_of_care', label: 'Coordination of Care' },
  { value: 'incident_report', label: 'Incident Report' },
  { value: 'other', label: 'Other' }
];

export interface UrgencyLevelOption {
  value: string;
  label: string;
}

export const URGENCY_LEVELS: UrgencyLevelOption[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' }
];

// ============================================================================
// INTAKE NOTE ENUMS
// ============================================================================

export interface PresentingProblemOption {
  value: string;
  label: string;
}

export const PRESENTING_PROBLEMS: PresentingProblemOption[] = [
  { value: 'Anxiety', label: 'Anxiety' },
  { value: 'Depression', label: 'Depression' },
  { value: 'Trauma / PTSD', label: 'Trauma / PTSD' },
  { value: 'Stress Management', label: 'Stress Management' },
  { value: 'Relationship Issues', label: 'Relationship Issues' },
  { value: 'Grief / Loss', label: 'Grief / Loss' },
  { value: 'Anger Management', label: 'Anger Management' },
  { value: 'Substance Use / Addiction', label: 'Substance Use / Addiction' },
  { value: 'Behavioral Issues', label: 'Behavioral Issues' },
  { value: 'Bipolar Symptoms', label: 'Bipolar Symptoms' },
  { value: 'Psychosis / Schizophrenia', label: 'Psychosis / Schizophrenia' },
  { value: 'Eating Disorder Concerns', label: 'Eating Disorder Concerns' },
  { value: 'Personality Disorder Concerns', label: 'Personality Disorder Concerns' },
  { value: 'Sexual / Gender Identity Concerns', label: 'Sexual / Gender Identity Concerns' },
  { value: 'Other', label: 'Other' }
];

export interface SymptomOnsetOption {
  value: string;
  label: string;
}

export const SYMPTOM_ONSET_OPTIONS: SymptomOnsetOption[] = [
  { value: 'Recent (Less than 1 month)', label: 'Recent (Less than 1 month)' },
  { value: 'Acute (1-3 months)', label: 'Acute (1-3 months)' },
  { value: 'Subacute (3-6 months)', label: 'Subacute (3-6 months)' },
  { value: 'Chronic (6+ months)', label: 'Chronic (6+ months)' },
  { value: 'Episodic (Comes and goes)', label: 'Episodic (Comes and goes)' },
  { value: 'Longstanding (Years)', label: 'Longstanding (Years)' },
  { value: 'Since childhood', label: 'Since childhood' },
  { value: 'Unknown / Not specified', label: 'Unknown / Not specified' }
];

export interface SymptomSeverityOption {
  value: string;
  label: string;
}

export const SYMPTOM_SEVERITY_OPTIONS: SymptomSeverityOption[] = [
  { value: 'Mild', label: 'Mild' },
  { value: 'Moderate', label: 'Moderate' },
  { value: 'Severe', label: 'Severe' },
  { value: 'Extreme', label: 'Extreme' },
  { value: 'Fluctuating', label: 'Fluctuating' }
];

export interface RelationshipStatusOption {
  value: string;
  label: string;
}

export const RELATIONSHIP_STATUS_OPTIONS: RelationshipStatusOption[] = [
  { value: 'Single', label: 'Single' },
  { value: 'Married', label: 'Married' },
  { value: 'Divorced', label: 'Divorced' },
  { value: 'Separated', label: 'Separated' },
  { value: 'Widowed', label: 'Widowed' },
  { value: 'In a relationship', label: 'In a relationship' },
  { value: 'Engaged', label: 'Engaged' },
  { value: 'Other', label: 'Other' }
];

export interface LivingSituationOption {
  value: string;
  label: string;
}

export const LIVING_SITUATION_OPTIONS: LivingSituationOption[] = [
  { value: 'Own home/apartment', label: 'Own home/apartment' },
  { value: 'Rental home/apartment', label: 'Rental home/apartment' },
  { value: 'Living with family', label: 'Living with family' },
  { value: 'Living with friends', label: 'Living with friends' },
  { value: 'Group home', label: 'Group home' },
  { value: 'Homeless', label: 'Homeless' },
  { value: 'Institution', label: 'Institution' },
  { value: 'Other', label: 'Other' }
];

export interface RiskLevelOption {
  value: string;
  label: string;
}

export const RISK_LEVEL_OPTIONS: RiskLevelOption[] = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
  { value: 'Imminent', label: 'Imminent' }
];

export interface IntentToActOption {
  value: string;
  label: string;
}

export const INTENT_TO_ACT_OPTIONS: IntentToActOption[] = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
  { value: 'Not Applicable', label: 'Not Applicable' }
];

export interface RiskFactorOption {
  value: string;
  label: string;
}

export const RISK_FACTORS: RiskFactorOption[] = [
  { value: 'Current Suicidal Ideation', label: 'Current Suicidal Ideation' },
  { value: 'History of Suicide Attempt(s)', label: 'History of Suicide Attempt(s)' },
  { value: 'Homicidal Ideation', label: 'Homicidal Ideation' },
  { value: 'Self-Harm Behaviors', label: 'Self-Harm Behaviors' },
  { value: 'Significant Impulsivity', label: 'Significant Impulsivity' },
  { value: 'Aggression/Violence History', label: 'Aggression/Violence History' }
];

export interface TreatmentTypeOption {
  value: string;
  label: string;
}

export const TREATMENT_TYPES: TreatmentTypeOption[] = [
  { value: 'Individual Therapy', label: 'Individual Therapy' },
  { value: 'Group Therapy', label: 'Group Therapy' },
  { value: 'Family Therapy', label: 'Family Therapy' },
  { value: 'Couples Therapy', label: 'Couples Therapy' },
  { value: 'Psychiatric Medication', label: 'Psychiatric Medication' },
  { value: 'Substance Abuse Treatment', label: 'Substance Abuse Treatment' },
  { value: 'Inpatient Hospitalization', label: 'Inpatient Hospitalization' },
  { value: 'Partial Hospitalization (PHP)', label: 'Partial Hospitalization (PHP)' },
  { value: 'Intensive Outpatient Program (IOP)', label: 'Intensive Outpatient Program (IOP)' },
  { value: 'Support Group', label: 'Support Group' },
  { value: 'Other', label: 'Other' }
];

export interface SubstanceOption {
  value: string;
  label: string;
}

export const SUBSTANCES: SubstanceOption[] = [
  { value: 'Alcohol', label: 'Alcohol' },
  { value: 'Tobacco/Nicotine', label: 'Tobacco/Nicotine' },
  { value: 'Cannabis', label: 'Cannabis' },
  { value: 'Stimulants (cocaine, methamphetamine, etc.)', label: 'Stimulants (cocaine, methamphetamine, etc.)' },
  { value: 'Opioids (heroin, prescription pain medications, etc.)', label: 'Opioids (heroin, prescription pain medications, etc.)' },
  { value: 'Sedatives/Hypnotics (benzodiazepines, sleep medications, etc.)', label: 'Sedatives/Hypnotics (benzodiazepines, sleep medications, etc.)' },
  { value: 'Other Substances', label: 'Other Substances' }
];

// ============================================================================
// TREATMENT PLAN ENUMS
// ============================================================================

export interface InterventionStrategyOption {
  value: string;
  label: string;
}

export const INTERVENTION_STRATEGIES: InterventionStrategyOption[] = [
  { value: 'Cognitive Challenging', label: 'Cognitive Challenging' },
  { value: 'Cognitive Refocusing', label: 'Cognitive Refocusing' },
  { value: 'Cognitive Reframing', label: 'Cognitive Reframing' },
  { value: 'Communication Skills', label: 'Communication Skills' },
  { value: 'Compliance Issues', label: 'Compliance Issues' },
  { value: 'DBT', label: 'DBT' },
  { value: 'Exploration of Coping Patterns', label: 'Exploration of Coping Patterns' },
  { value: 'Exploration of Emotions', label: 'Exploration of Emotions' },
  { value: 'Exploration of Relationship Patterns', label: 'Exploration of Relationship Patterns' },
  { value: 'Guided Imagery', label: 'Guided Imagery' },
  { value: 'Interactive Feedback', label: 'Interactive Feedback' },
  { value: 'Interpersonal Resolutions', label: 'Interpersonal Resolutions' },
  { value: 'Mindfulness Training', label: 'Mindfulness Training' },
  { value: 'Preventative Services', label: 'Preventative Services' },
  { value: 'Psycho-Education', label: 'Psycho-Education' },
  { value: 'Relaxation/Deep Breathing', label: 'Relaxation/Deep Breathing' },
  { value: 'Review of Treatment Plan/Progress', label: 'Review of Treatment Plan/Progress' },
  { value: 'Role-Play/Behavioral Rehearsal', label: 'Role-Play/Behavioral Rehearsal' },
  { value: 'Structured Problem Solving', label: 'Structured Problem Solving' },
  { value: 'Supportive Reflection', label: 'Supportive Reflection' },
  { value: 'Symptom Management', label: 'Symptom Management' },
  { value: 'Other', label: 'Other' }
];

export interface EstimatedCompletionOption {
  value: string;
  label: string;
}

export const ESTIMATED_COMPLETION_OPTIONS: EstimatedCompletionOption[] = [
  { value: '3 months', label: '3 months' },
  { value: '6 months', label: '6 months' },
  { value: '9 months', label: '9 months' },
  { value: '12 months', label: '12 months' }
];

export interface PriorityOption {
  value: string;
  label: string;
}

export const PRIORITY_OPTIONS: PriorityOption[] = [
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' }
];

export interface SessionFrequencyOption {
  value: string;
  label: string;
}

export const SESSION_FREQUENCY_OPTIONS: SessionFrequencyOption[] = [
  { value: 'Weekly', label: 'Weekly' },
  { value: 'Bi-weekly', label: 'Bi-weekly' },
  { value: 'Monthly', label: 'Monthly' },
  { value: 'As needed', label: 'As needed' },
  { value: 'Other', label: 'Other' }
];

export interface SessionDurationOption {
  value: string;
  label: string;
}

export const SESSION_DURATION_OPTIONS: SessionDurationOption[] = [
  { value: '30 minutes', label: '30 minutes' },
  { value: '45 minutes', label: '45 minutes' },
  { value: '60 minutes', label: '60 minutes' },
  { value: '90 minutes', label: '90 minutes' },
  { value: 'Other', label: 'Other' }
];

export interface ModalityOption {
  value: string;
  label: string;
}

export const MODALITY_OPTIONS: ModalityOption[] = [
  { value: 'Individual Therapy', label: 'Individual Therapy' },
  { value: 'Group Therapy', label: 'Group Therapy' },
  { value: 'Family Therapy', label: 'Family Therapy' },
  { value: 'Couples Therapy', label: 'Couples Therapy' },
  { value: 'Telehealth', label: 'Telehealth' },
  { value: 'Other', label: 'Other' }
];

// ============================================================================
// PROGRESS NOTE ENUMS
// ============================================================================

export interface MentalStatusOption {
  value: string;
  label: string;
}

export const ORIENTATION_OPTIONS: MentalStatusOption[] = [
  { value: 'X3: Oriented to Person, Place, and Time', label: 'X3: Oriented to Person, Place, and Time' },
  { value: 'X2: Oriented to Person, Place; Impaired to Time', label: 'X2: Oriented to Person, Place; Impaired to Time' },
  { value: 'X2: Oriented to Person, Time; Impaired to Place', label: 'X2: Oriented to Person, Time; Impaired to Place' },
  { value: 'X2: Oriented to Time, Place; Impaired to Person', label: 'X2: Oriented to Time, Place; Impaired to Person' },
  { value: 'X1: Oriented to Person; Impaired to Place, Time', label: 'X1: Oriented to Person; Impaired to Place, Time' },
  { value: 'X1: Oriented to Place; Impaired to Person, Time', label: 'X1: Oriented to Place; Impaired to Person, Time' },
  { value: 'X1: Oriented to Time; Impaired to Person, Place', label: 'X1: Oriented to Time; Impaired to Person, Place' },
  { value: 'X0: Impaired to Person, Place, and Time', label: 'X0: Impaired to Person, Place, and Time' },
  { value: 'Not Assessed', label: 'Not Assessed' }
];

export const GENERAL_APPEARANCE_OPTIONS: MentalStatusOption[] = [
  { value: 'Well-groomed', label: 'Well-groomed' },
  { value: 'Disheveled', label: 'Disheveled' },
  { value: 'Unkempt', label: 'Unkempt' },
  { value: 'Clean and neat', label: 'Clean and neat' },
  { value: 'Poor hygiene', label: 'Poor hygiene' },
  { value: 'Age-appropriate', label: 'Age-appropriate' },
  { value: 'Younger than stated age', label: 'Younger than stated age' },
  { value: 'Older than stated age', label: 'Older than stated age' },
  { value: 'Not Assessed', label: 'Not Assessed' }
];

export const DRESS_OPTIONS: MentalStatusOption[] = [
  { value: 'Appropriate', label: 'Appropriate' },
  { value: 'Disheveled', label: 'Disheveled' },
  { value: 'Emaciated', label: 'Emaciated' },
  { value: 'Obese', label: 'Obese' },
  { value: 'Poor Hygiene', label: 'Poor Hygiene' },
  { value: 'Inappropriate for weather', label: 'Inappropriate for weather' },
  { value: 'Bizarre', label: 'Bizarre' },
  { value: 'Seductive', label: 'Seductive' },
  { value: 'Not Assessed', label: 'Not Assessed' }
];

export const MOTOR_ACTIVITY_OPTIONS: MentalStatusOption[] = [
  { value: 'Unremarkable', label: 'Unremarkable' },
  { value: 'Agitation', label: 'Agitation' },
  { value: 'Retardation', label: 'Retardation' },
  { value: 'Posturing', label: 'Posturing' },
  { value: 'Repetitive actions', label: 'Repetitive actions' },
  { value: 'Tics', label: 'Tics' },
  { value: 'Tremor', label: 'Tremor' },
  { value: 'Unusual Gait', label: 'Unusual Gait' },
  { value: 'Hyperactive', label: 'Hyperactive' },
  { value: 'Hypoactive', label: 'Hypoactive' },
  { value: 'Restless', label: 'Restless' },
  { value: 'Catatonic', label: 'Catatonic' },
  { value: 'Not Assessed', label: 'Not Assessed' }
];

export const INTERVIEW_BEHAVIOR_OPTIONS: MentalStatusOption[] = [
  { value: 'Cooperative', label: 'Cooperative' },
  { value: 'Uncooperative', label: 'Uncooperative' },
  { value: 'Guarded', label: 'Guarded' },
  { value: 'Hostile', label: 'Hostile' },
  { value: 'Evasive', label: 'Evasive' },
  { value: 'Suspicious', label: 'Suspicious' },
  { value: 'Seductive', label: 'Seductive' },
  { value: 'Manipulative', label: 'Manipulative' },
  { value: 'Demanding', label: 'Demanding' },
  { value: 'Pleasant', label: 'Pleasant' },
  { value: 'Withdrawn', label: 'Withdrawn' },
  { value: 'Not Assessed', label: 'Not Assessed' }
];

export const SPEECH_OPTIONS: MentalStatusOption[] = [
  { value: 'Normal rate and rhythm', label: 'Normal rate and rhythm' },
  { value: 'Rapid', label: 'Rapid' },
  { value: 'Slow', label: 'Slow' },
  { value: 'Loud', label: 'Loud' },
  { value: 'Soft', label: 'Soft' },
  { value: 'Pressured', label: 'Pressured' },
  { value: 'Monotone', label: 'Monotone' },
  { value: 'Slurred', label: 'Slurred' },
  { value: 'Stammering', label: 'Stammering' },
  { value: 'Circumstantial', label: 'Circumstantial' },
  { value: 'Tangential', label: 'Tangential' },
  { value: 'Flight of ideas', label: 'Flight of ideas' },
  { value: 'Not Assessed', label: 'Not Assessed' }
];

export const MOOD_OPTIONS: MentalStatusOption[] = [
  { value: 'Euthymic', label: 'Euthymic' },
  { value: 'Depressed', label: 'Depressed' },
  { value: 'Elevated', label: 'Elevated' },
  { value: 'Irritable', label: 'Irritable' },
  { value: 'Anxious', label: 'Anxious' },
  { value: 'Angry', label: 'Angry' },
  { value: 'Euphoric', label: 'Euphoric' },
  { value: 'Dysphoric', label: 'Dysphoric' },
  { value: 'Labile', label: 'Labile' },
  { value: 'Expansive', label: 'Expansive' },
  { value: 'Not Assessed', label: 'Not Assessed' }
];

export const AFFECT_OPTIONS: MentalStatusOption[] = [
  { value: 'Euthymic', label: 'Euthymic' },
  { value: 'Depressed', label: 'Depressed' },
  { value: 'Elevated', label: 'Elevated' },
  { value: 'Irritable', label: 'Irritable' },
  { value: 'Anxious', label: 'Anxious' },
  { value: 'Angry', label: 'Angry' },
  { value: 'Flat', label: 'Flat' },
  { value: 'Blunted', label: 'Blunted' },
  { value: 'Labile', label: 'Labile' },
  { value: 'Inappropriate', label: 'Inappropriate' },
  { value: 'Constricted', label: 'Constricted' },
  { value: 'Expansive', label: 'Expansive' },
  { value: 'Not Assessed', label: 'Not Assessed' }
];

export const INSIGHT_OPTIONS: MentalStatusOption[] = [
  { value: 'Excellent', label: 'Excellent' },
  { value: 'Good', label: 'Good' },
  { value: 'Fair', label: 'Fair' },
  { value: 'Poor', label: 'Poor' },
  { value: 'Nil', label: 'Nil' },
  { value: 'Not Assessed', label: 'Not Assessed' }
];

export const JUDGMENT_OPTIONS: MentalStatusOption[] = [
  { value: 'Excellent', label: 'Excellent' },
  { value: 'Good', label: 'Good' },
  { value: 'Fair', label: 'Fair' },
  { value: 'Poor', label: 'Poor' },
  { value: 'Nil', label: 'Nil' },
  { value: 'Not Assessed', label: 'Not Assessed' }
];

export const MEMORY_OPTIONS: MentalStatusOption[] = [
  { value: 'Excellent', label: 'Excellent' },
  { value: 'Good', label: 'Good' },
  { value: 'Fair', label: 'Fair' },
  { value: 'Poor', label: 'Poor' },
  { value: 'Nil', label: 'Nil' },
  { value: 'Not Assessed', label: 'Not Assessed' }
];

export const ATTENTION_OPTIONS: MentalStatusOption[] = [
  { value: 'Excellent', label: 'Excellent' },
  { value: 'Good', label: 'Good' },
  { value: 'Fair', label: 'Fair' },
  { value: 'Poor', label: 'Poor' },
  { value: 'Nil', label: 'Nil' },
  { value: 'Not Assessed', label: 'Not Assessed' }
];

export const THOUGHT_PROCESS_OPTIONS: MentalStatusOption[] = [
  { value: 'Linear', label: 'Linear' },
  { value: 'Goal-directed', label: 'Goal-directed' },
  { value: 'Circumstantial', label: 'Circumstantial' },
  { value: 'Tangential', label: 'Tangential' },
  { value: 'Flight of ideas', label: 'Flight of ideas' },
  { value: 'Loose associations', label: 'Loose associations' },
  { value: 'Word salad', label: 'Word salad' },
  { value: 'Thought blocking', label: 'Thought blocking' },
  { value: 'Perseveration', label: 'Perseveration' },
  { value: 'Clang associations', label: 'Clang associations' },
  { value: 'Not Assessed', label: 'Not Assessed' }
];

export const THOUGHT_CONTENT_OPTIONS: MentalStatusOption[] = [
  { value: 'No abnormalities noted', label: 'No abnormalities noted' },
  { value: 'Obsessions', label: 'Obsessions' },
  { value: 'Compulsions', label: 'Compulsions' },
  { value: 'Phobias', label: 'Phobias' },
  { value: 'Suicidal ideation', label: 'Suicidal ideation' },
  { value: 'Homicidal ideation', label: 'Homicidal ideation' },
  { value: 'Delusions', label: 'Delusions' },
  { value: 'Ideas of reference', label: 'Ideas of reference' },
  { value: 'Paranoid thoughts', label: 'Paranoid thoughts' },
  { value: 'Not Assessed', label: 'Not Assessed' }
];

export const PERCEPTION_OPTIONS: MentalStatusOption[] = [
  { value: 'No abnormalities noted', label: 'No abnormalities noted' },
  { value: 'Auditory hallucinations', label: 'Auditory hallucinations' },
  { value: 'Visual hallucinations', label: 'Visual hallucinations' },
  { value: 'Tactile hallucinations', label: 'Tactile hallucinations' },
  { value: 'Olfactory hallucinations', label: 'Olfactory hallucinations' },
  { value: 'Gustatory hallucinations', label: 'Gustatory hallucinations' },
  { value: 'Illusions', label: 'Illusions' },
  { value: 'Depersonalization', label: 'Depersonalization' },
  { value: 'Derealization', label: 'Derealization' },
  { value: 'Not Assessed', label: 'Not Assessed' }
];

export const FUNCTIONAL_STATUS_OPTIONS: MentalStatusOption[] = [
  { value: 'Independent in all activities', label: 'Independent in all activities' },
  { value: 'Mild impairment', label: 'Mild impairment' },
  { value: 'Moderate impairment', label: 'Moderate impairment' },
  { value: 'Severe impairment', label: 'Severe impairment' },
  { value: 'Requires assistance with ADLs', label: 'Requires assistance with ADLs' },
  { value: 'Requires supervision', label: 'Requires supervision' },
  { value: 'Homebound', label: 'Homebound' },
  { value: 'Institutionalized', label: 'Institutionalized' },
  { value: 'Not Assessed', label: 'Not Assessed' }
];

export interface RecommendationOption {
  value: string;
  label: string;
}

export const RECOMMENDATION_OPTIONS: RecommendationOption[] = [
  { value: 'Continue current therapeutic focus', label: 'Continue current therapeutic focus' },
  { value: 'Change treatment goals or objectives', label: 'Change treatment goals or objectives' },
  { value: 'Terminate treatment', label: 'Terminate treatment' }
];

export interface PrescribedFrequencyOption {
  value: string;
  label: string;
}

export const PRESCRIBED_FREQUENCY_OPTIONS: PrescribedFrequencyOption[] = [
  { value: 'As Needed', label: 'As Needed' },
  { value: 'Twice a Week', label: 'Twice a Week' },
  { value: 'Weekly', label: 'Weekly' },
  { value: 'Every 2 Weeks', label: 'Every 2 Weeks' },
  { value: 'Every 4 Weeks', label: 'Every 4 Weeks' },
  { value: 'Every Month', label: 'Every Month' },
  { value: 'Every 2 Months', label: 'Every 2 Months' },
  { value: 'Every 3 Months', label: 'Every 3 Months' },
  { value: 'Every 4 Months', label: 'Every 4 Months' }
];

export interface AreaOfRiskOption {
  value: string;
  label: string;
}

export const AREA_OF_RISK_OPTIONS: AreaOfRiskOption[] = [
  { value: 'Inability to care for self', label: 'Inability to care for self' },
  { value: 'Inability to care for others', label: 'Inability to care for others' },
  { value: 'Aggression toward others', label: 'Aggression toward others' },
  { value: 'Aggression toward property', label: 'Aggression toward property' },
  { value: 'Self-harm', label: 'Self-harm' },
  { value: 'Suicide', label: 'Suicide' },
  { value: 'Violence', label: 'Violence' },
  { value: 'Substance abuse', label: 'Substance abuse' },
  { value: 'Elopement/Wandering', label: 'Elopement/Wandering' },
  { value: 'Sexual acting out', label: 'Sexual acting out' },
  { value: 'Fire setting', label: 'Fire setting' },
  { value: 'Other', label: 'Other' }
];

export interface LocationOption {
  value: string;
  label: string;
  description: string;
}

export const LOCATION_OPTIONS: LocationOption[] = [
  { value: 'office', label: 'Office', description: 'In-person office visit' },
  { value: 'telehealth', label: 'HIPAA Compliant Telehealth Platform', description: 'Virtual session' },
  { value: 'home', label: 'Home Visit', description: 'Provider visit to client home' },
  { value: 'hospital', label: 'Hospital', description: 'Hospital-based session' },
  { value: 'other', label: 'Other', description: 'Other location' }
];

export interface ParticipantOption {
  value: string;
  label: string;
  description: string;
}

export const PARTICIPANT_OPTIONS: ParticipantOption[] = [
  { value: 'client-only', label: 'Client only', description: 'Individual session' },
  { value: 'client-family', label: 'Client and family', description: 'Family therapy with client present' },
  { value: 'family-only', label: 'Family only', description: 'Family therapy without client' },
  { value: 'group', label: 'Group session', description: 'Group therapy session' }
];

// ============================================================================
// DIAGNOSES
// ============================================================================

export interface Diagnosis {
  id: string;
  code: string;
  description: string;
  category: string;
  isActive: boolean;
}

export const AVAILABLE_DIAGNOSES: Diagnosis[] = [
  // Mood Disorders
  {
    id: '1',
    code: 'F32.1',
    description: 'Major Depressive Disorder, Moderate',
    category: 'Mood Disorders',
    isActive: true,
  },
  {
    id: '2',
    code: 'F32.2',
    description: 'Major Depressive Disorder, Severe',
    category: 'Mood Disorders',
    isActive: true,
  },
  {
    id: '3',
    code: 'F31.1',
    description: 'Bipolar I Disorder, Current Episode Manic',
    category: 'Mood Disorders',
    isActive: true,
  },
  {
    id: '4',
    code: 'F31.2',
    description: 'Bipolar I Disorder, Current Episode Depressed',
    category: 'Mood Disorders',
    isActive: true,
  },
  {
    id: '5',
    code: 'F34.1',
    description: 'Persistent Depressive Disorder (Dysthymia)',
    category: 'Mood Disorders',
    isActive: true,
  },
  {
    id: '6',
    code: 'F32.9',
    description: 'Unspecified Depressive Disorder',
    category: 'Mood Disorders',
    isActive: true,
  },

  // Anxiety Disorders
  {
    id: '7',
    code: 'F41.1',
    description: 'Generalized Anxiety Disorder',
    category: 'Anxiety Disorders',
    isActive: true,
  },
  {
    id: '8',
    code: 'F40.10',
    description: 'Social Anxiety Disorder (Social Phobia)',
    category: 'Anxiety Disorders',
    isActive: true,
  },
  {
    id: '9',
    code: 'F40.00',
    description: 'Agoraphobia',
    category: 'Anxiety Disorders',
    isActive: true,
  },
  {
    id: '10',
    code: 'F41.0',
    description: 'Panic Disorder',
    category: 'Anxiety Disorders',
    isActive: true,
  },
  {
    id: '11',
    code: 'F42.8',
    description: 'Obsessive-Compulsive Disorder',
    category: 'Anxiety Disorders',
    isActive: true,
  },
  {
    id: '12',
    code: 'F43.1',
    description: 'Posttraumatic Stress Disorder',
    category: 'Anxiety Disorders',
    isActive: true,
  },

  // Trauma and Stressor-Related Disorders
  {
    id: '13',
    code: 'F43.2',
    description: 'Adjustment Disorder with Depressed Mood',
    category: 'Trauma and Stressor-Related Disorders',
    isActive: true,
  },
  {
    id: '14',
    code: 'F43.21',
    description: 'Adjustment Disorder with Anxiety',
    category: 'Trauma and Stressor-Related Disorders',
    isActive: true,
  },
  {
    id: '15',
    code: 'F43.22',
    description: 'Adjustment Disorder with Mixed Anxiety and Depressed Mood',
    category: 'Trauma and Stressor-Related Disorders',
    isActive: true,
  },

  // Personality Disorders
  {
    id: '16',
    code: 'F60.3',
    description: 'Emotionally Unstable Personality Disorder (Borderline)',
    category: 'Personality Disorders',
    isActive: true,
  },
  {
    id: '17',
    code: 'F60.0',
    description: 'Paranoid Personality Disorder',
    category: 'Personality Disorders',
    isActive: true,
  },
  {
    id: '18',
    code: 'F60.1',
    description: 'Schizoid Personality Disorder',
    category: 'Personality Disorders',
    isActive: true,
  },
  {
    id: '19',
    code: 'F60.2',
    description: 'Antisocial Personality Disorder',
    category: 'Personality Disorders',
    isActive: true,
  },
  {
    id: '20',
    code: 'F60.4',
    description: 'Histrionic Personality Disorder',
    category: 'Personality Disorders',
    isActive: true,
  },

  // Substance Use Disorders
  {
    id: '21',
    code: 'F10.20',
    description: 'Alcohol Use Disorder, Moderate',
    category: 'Substance Use Disorders',
    isActive: true,
  },
  {
    id: '22',
    code: 'F10.21',
    description: 'Alcohol Use Disorder, Severe',
    category: 'Substance Use Disorders',
    isActive: true,
  },
  {
    id: '23',
    code: 'F12.20',
    description: 'Cannabis Use Disorder, Moderate',
    category: 'Substance Use Disorders',
    isActive: true,
  },
  {
    id: '24',
    code: 'F19.20',
    description: 'Other Psychoactive Substance Use Disorder, Moderate',
    category: 'Substance Use Disorders',
    isActive: true,
  },

  // Psychotic Disorders
  {
    id: '25',
    code: 'F20.9',
    description: 'Schizophrenia, Unspecified',
    category: 'Psychotic Disorders',
    isActive: true,
  },
  {
    id: '26',
    code: 'F22',
    description: 'Delusional Disorder',
    category: 'Psychotic Disorders',
    isActive: true,
  },
  {
    id: '27',
    code: 'F23',
    description: 'Brief Psychotic Disorder',
    category: 'Psychotic Disorders',
    isActive: true,
  },

  // Eating Disorders
  {
    id: '28',
    code: 'F50.00',
    description: 'Anorexia Nervosa, Restricting Type',
    category: 'Eating Disorders',
    isActive: true,
  },
  {
    id: '29',
    code: 'F50.01',
    description: 'Anorexia Nervosa, Binge-Eating/Purging Type',
    category: 'Eating Disorders',
    isActive: true,
  },
  {
    id: '30',
    code: 'F50.2',
    description: 'Bulimia Nervosa',
    category: 'Eating Disorders',
    isActive: true,
  },
  {
    id: '31',
    code: 'F50.8',
    description: 'Binge-Eating Disorder',
    category: 'Eating Disorders',
    isActive: true,
  },

  // Neurodevelopmental Disorders
  {
    id: '32',
    code: 'F90.1',
    description: 'Attention-Deficit/Hyperactivity Disorder, Predominantly Inattentive Type',
    category: 'Neurodevelopmental Disorders',
    isActive: true,
  },
  {
    id: '33',
    code: 'F90.2',
    description: 'Attention-Deficit/Hyperactivity Disorder, Combined Type',
    category: 'Neurodevelopmental Disorders',
    isActive: true,
  },
  {
    id: '34',
    code: 'F84.0',
    description: 'Autism Spectrum Disorder',
    category: 'Neurodevelopmental Disorders',
    isActive: true,
  },

  // Sleep-Wake Disorders
  {
    id: '35',
    code: 'F51.01',
    description: 'Insomnia Disorder',
    category: 'Sleep-Wake Disorders',
    isActive: true,
  },
  {
    id: '36',
    code: 'F51.11',
    description: 'Hypersomnolence Disorder',
    category: 'Sleep-Wake Disorders',
    isActive: true,
  },
  {
    id: '37',
    code: 'F51.3',
    description: 'Sleepwalking',
    category: 'Sleep-Wake Disorders',
    isActive: true,
  },

  // Dissociative Disorders
  {
    id: '38',
    code: 'F44.0',
    description: 'Dissociative Amnesia',
    category: 'Dissociative Disorders',
    isActive: true,
  },
  {
    id: '39',
    code: 'F44.1',
    description: 'Dissociative Identity Disorder',
    category: 'Dissociative Disorders',
    isActive: true,
  },
  {
    id: '40',
    code: 'F48.1',
    description: 'Depersonalization/Derealization Disorder',
    category: 'Dissociative Disorders',
    isActive: true,
  },

  // Somatic Symptom Disorders
  {
    id: '41',
    code: 'F45.1',
    description: 'Somatic Symptom Disorder',
    category: 'Somatic Symptom Disorders',
    isActive: true,
  },
  {
    id: '42',
    code: 'F45.21',
    description: 'Illness Anxiety Disorder',
    category: 'Somatic Symptom Disorders',
    isActive: true,
  },
  {
    id: '43',
    code: 'F44.4',
    description: 'Conversion Disorder (Functional Neurological Symptom Disorder)',
    category: 'Somatic Symptom Disorders',
    isActive: true,
  },

  // Other Mental Disorders
  {
    id: '44',
    code: 'F63.1',
    description: 'Pyromania',
    category: 'Other Mental Disorders',
    isActive: true,
  },
  {
    id: '45',
    code: 'F63.2',
    description: 'Kleptomania',
    category: 'Other Mental Disorders',
    isActive: true,
  },
  {
    id: '46',
    code: 'F42.8',
    description: 'Trichotillomania (Hair-Pulling Disorder)',
    category: 'Other Mental Disorders',
    isActive: true,
  },
  {
    id: '47',
    code: 'F42.4',
    description: 'Excoriation (Skin-Picking) Disorder',
    category: 'Other Mental Disorders',
    isActive: true,
  },

  // V Codes (Other Conditions)
  {
    id: '48',
    code: 'Z63.0',
    description: 'Relationship Distress with Spouse or Intimate Partner',
    category: 'V Codes',
    isActive: true,
  },
  {
    id: '49',
    code: 'Z63.4',
    description: 'Uncomplicated Bereavement',
    category: 'V Codes',
    isActive: true,
  },
  {
    id: '50',
    code: 'Z65.0',
    description: 'Conviction in Civil or Criminal Proceedings Without Imprisonment',
    category: 'V Codes',
    isActive: true,
  },
];

export const getDiagnosesByCategory = (category: string): Diagnosis[] => {
  return AVAILABLE_DIAGNOSES.filter(diagnosis => diagnosis.category === category);
};

export const getDiagnosisById = (id: string): Diagnosis | undefined => {
  return AVAILABLE_DIAGNOSES.find(diagnosis => diagnosis.id === id);
};

export const getDiagnosisByCode = (code: string): Diagnosis | undefined => {
  return AVAILABLE_DIAGNOSES.find(diagnosis => diagnosis.code === code);
};

export const getDiagnosisCategories = (): string[] => {
  return [...new Set(AVAILABLE_DIAGNOSES.map(diagnosis => diagnosis.category))];
};