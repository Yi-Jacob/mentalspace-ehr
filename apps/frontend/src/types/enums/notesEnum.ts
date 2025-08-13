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
