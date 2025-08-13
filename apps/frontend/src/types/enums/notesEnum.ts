export interface CptCodeOption {
  value: string;
  label: string;
  description: string;
  category?: string;
}

export const CPT_CODES: CptCodeOption[] = [
  // Psychiatric Diagnostic Evaluation
  {
    value: '90791',
    label: '90791 - Psychiatric diagnostic evaluation',
    description: 'Comprehensive psychiatric evaluation without medical services',
    category: 'Psychiatric Diagnostic Evaluation'
  },
  {
    value: '90792',
    label: '90792 - Psychiatric diagnostic evaluation with medical services',
    description: 'Comprehensive psychiatric evaluation with medical services',
    category: 'Psychiatric Diagnostic Evaluation'
  },
  
  // Psychotherapy
  {
    value: '90832',
    label: '90832 - Psychotherapy, 30 minutes',
    description: 'Individual psychotherapy, 30 minutes with patient',
    category: 'Psychotherapy'
  },
  {
    value: '90834',
    label: '90834 - Psychotherapy, 45 minutes',
    description: 'Individual psychotherapy, 45 minutes with patient',
    category: 'Psychotherapy'
  },
  {
    value: '90837',
    label: '90837 - Psychotherapy, 60 minutes',
    description: 'Individual psychotherapy, 60 minutes with patient',
    category: 'Psychotherapy'
  },
  {
    value: '90853',
    label: '90853 - Group psychotherapy',
    description: 'Group psychotherapy (other than of a multiple-family group)',
    category: 'Psychotherapy'
  },
  
  // Family Therapy
  {
    value: '90846',
    label: '90846 - Family psychotherapy (without patient present)',
    description: 'Family psychotherapy (conjoint psychotherapy) (without patient present)',
    category: 'Family Therapy'
  },
  {
    value: '90847',
    label: '90847 - Family psychotherapy (with patient present)',
    description: 'Family psychotherapy (conjoint psychotherapy) (with patient present)',
    category: 'Family Therapy'
  },
  
  // Crisis Intervention
  {
    value: '90839',
    label: '90839 - Psychotherapy for crisis; first 60 minutes',
    description: 'Psychotherapy for crisis; first 60 minutes',
    category: 'Crisis Intervention'
  },
  {
    value: '90840',
    label: '90840 - Psychotherapy for crisis; each additional 30 minutes',
    description: 'Psychotherapy for crisis; each additional 30 minutes',
    category: 'Crisis Intervention'
  },
  
  // Psychological Testing
  {
    value: '96116',
    label: '96116 - Neurobehavioral status exam',
    description: 'Neurobehavioral status exam (clinical assessment of thinking, reasoning and judgment)',
    category: 'Psychological Testing'
  },
  {
    value: '96121',
    label: '96121 - Neuropsychological testing evaluation',
    description: 'Neuropsychological testing evaluation services by physician or other qualified health care professional',
    category: 'Psychological Testing'
  },
  
  // Medication Management
  {
    value: '90862',
    label: '90862 - Pharmacologic management',
    description: 'Pharmacologic management, including prescription and review of medication',
    category: 'Medication Management'
  },
  {
    value: '90863',
    label: '90863 - Pharmacologic management with psychotherapy',
    description: 'Pharmacologic management, including prescription and review of medication, with psychotherapy',
    category: 'Medication Management'
  },
  
  // Telehealth
  {
    value: '99441',
    label: '99441 - Telephone evaluation and management',
    description: 'Telephone evaluation and management service by a physician or other qualified health care professional',
    category: 'Telehealth'
  },
  {
    value: '99442',
    label: '99442 - Telephone evaluation and management (11-20 minutes)',
    description: 'Telephone evaluation and management service by a physician or other qualified health care professional',
    category: 'Telehealth'
  },
  {
    value: '99443',
    label: '99443 - Telephone evaluation and management (21-30 minutes)',
    description: 'Telephone evaluation and management service by a physician or other qualified health care professional',
    category: 'Telehealth'
  },
  
  // Other Common Codes
  {
    value: '90885',
    label: '90885 - Psychiatric evaluation of hospital records',
    description: 'Psychiatric evaluation of hospital records, other psychiatric reports, psychometric and/or projective tests, and other accumulated data for medical diagnostic purposes',
    category: 'Other'
  },
  {
    value: '90887',
    label: '90887 - Interpretation or explanation of results',
    description: 'Interpretation or explanation of results of psychiatric, other medical examinations and procedures, or other accumulated data to family or other responsible persons',
    category: 'Other'
  },
  {
    value: '90889',
    label: '90889 - Preparation of report',
    description: 'Preparation of report of patient\'s psychiatric status, history, treatment, or progress (other than for legal or consultative purposes) for other physicians, agencies, or insurance carriers',
    category: 'Other'
  }
];

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
