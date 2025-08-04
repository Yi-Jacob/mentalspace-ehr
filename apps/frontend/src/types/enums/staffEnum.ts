// Staff-related enums and options for SelectField components

// User Status Options
export const USER_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
  { value: 'suspended', label: 'Suspended' }
];

export type UserStatus = typeof USER_STATUS_OPTIONS[number]['value'];

// User Role Options - Static list based on roleCategories
export const USER_ROLE_OPTIONS = [
  { value: 'Practice Administrator', label: 'Practice Administrator' },
  { value: 'Practice Scheduler', label: 'Practice Scheduler' },
  { value: 'Clinician', label: 'Clinician' },
  { value: 'Intern', label: 'Intern / Assistant / Associate' },
  { value: 'Assistant', label: 'Assistant' },
  { value: 'Associate', label: 'Associate' },
  { value: 'Supervisor', label: 'Supervisor' },
  { value: 'Clinical Administrator', label: 'Clinical Administrator' },
  { value: 'Biller for Assigned Patients Only', label: 'Biller for Assigned Patients Only' },
  { value: 'Practice Biller', label: 'Practice Biller' }
];

export type UserRole = typeof USER_ROLE_OPTIONS[number]['value'];

// Role Descriptions (for tooltips and help text)
export const ROLE_DESCRIPTIONS = {
  'Practice Administrator': 'A TherapyNotes Practice Administrator can add and edit TherapyNotes users, change user roles, reset passwords, and set account access settings.',
  'Practice Scheduler': 'A Scheduler can schedule, reschedule, and cancel appointments for any clinician. They can add, edit, or remove new patients.',
  'Clinician': 'Clinicians provide services to a client. They can view and edit their own schedule, complete notes and manage records of patients assigned to them.',
  'Intern': 'The Intern role is similar to a Clinician but with limitations. Interns do not have an NPI and can only bill to insurance under a Supervisor\'s credentials.',
  'Assistant': 'The Assistant role is similar to a Clinician but with limitations. Assistants do not have an NPI and can only bill to insurance under a Supervisor\'s credentials.',
  'Associate': 'The Associate role is similar to a Clinician but with limitations. Associates do not have an NPI and can only bill to insurance under a Supervisor\'s credentials.',
  'Supervisor': 'A Supervisor can be assigned to individual clinicians and interns, granting full access to their supervisees\' patient\'s notes.',
  'Clinical Administrator': 'A Clinical Administrator must also have the Clinician role. They can access any patient\'s records and can give other clinicians access to any patient records.',
  'Biller for Assigned Patients Only': 'Clinicians with this role can collect and enter copay information, including by processing patient credit cards.',
  'Practice Biller': 'A Practice Biller has full billing access to all patients in the practice. They can verify patient insurance, generate and track claims, enter patient and insurance payments, and run billing reports.'
} as const;

// Static role categories for the RolesSection component
export const ROLE_CATEGORIES = [
  {
    title: 'Practice Administration',
    items: [
      {
        id: 'Practice Administrator',
        label: 'Practice Administrator',
        description: ROLE_DESCRIPTIONS['Practice Administrator']
      }
    ]
  },
  {
    title: 'Scheduling Access',
    items: [
      {
        id: 'Practice Scheduler',
        label: 'Practice Scheduler',
        description: ROLE_DESCRIPTIONS['Practice Scheduler']
      }
    ]
  },
  {
    title: 'Clinical Access',
    items: [
      {
        id: 'Clinician',
        label: 'Clinician',
        description: ROLE_DESCRIPTIONS['Clinician']
      },
      {
        id: 'Intern',
        label: 'Intern',
        displayName: 'Intern / Assistant / Associate',
        description: ROLE_DESCRIPTIONS['Intern']
      },
      {
        id: 'Supervisor',
        label: 'Supervisor',
        description: ROLE_DESCRIPTIONS['Supervisor']
      },
      {
        id: 'Clinical Administrator',
        label: 'Clinical Administrator',
        description: ROLE_DESCRIPTIONS['Clinical Administrator']
      }
    ]
  },
  {
    title: 'Billing Access',
    items: [
      {
        id: 'Biller for Assigned Patients Only',
        label: 'Biller for Assigned Patients Only',
        description: ROLE_DESCRIPTIONS['Biller for Assigned Patients Only']
      },
      {
        id: 'Practice Biller',
        label: 'Practice Biller',
        description: ROLE_DESCRIPTIONS['Practice Biller']
      }
    ]
  }
];

// Supervision Type Options
export const SUPERVISION_TYPE_OPTIONS = [
  { value: 'Not Supervised', label: 'Not Supervised' },
  { value: 'Access patient notes and co-sign notes for selected payers', label: 'Access patient notes and co-sign notes for selected payers' },
  { value: 'Must review and approve all notes', label: 'Must review and approve all notes' },
  { value: 'Must review and co-sign all notes', label: 'Must review and co-sign all notes' }
];

export type SupervisionType = typeof SUPERVISION_TYPE_OPTIONS[number]['value'];

// Clinician Type Options
export const CLINICIAN_TYPE_OPTIONS = [
  { value: 'Psychiatrist', label: 'Psychiatrist' },
  { value: 'Psychologist', label: 'Psychologist' },
  { value: 'Licensed Clinical Social Worker (LCSW)', label: 'Licensed Clinical Social Worker (LCSW)' },
  { value: 'Licensed Professional Counselor (LPC)', label: 'Licensed Professional Counselor (LPC)' },
  { value: 'Licensed Marriage and Family Therapist (LMFT)', label: 'Licensed Marriage and Family Therapist (LMFT)' },
  { value: 'Licensed Clinical Professional Counselor (LCPC)', label: 'Licensed Clinical Professional Counselor (LCPC)' },
  { value: 'Advanced Practice Registered Nurse (APRN)', label: 'Advanced Practice Registered Nurse (APRN)' },
  { value: 'Physician Assistant (PA)', label: 'Physician Assistant (PA)' },
  { value: 'Registered Nurse (RN)', label: 'Registered Nurse (RN)' },
  { value: 'Licensed Practical Nurse (LPN)', label: 'Licensed Practical Nurse (LPN)' },
  { value: 'Medical Assistant (MA)', label: 'Medical Assistant (MA)' },
  { value: 'Case Manager', label: 'Case Manager' },
  { value: 'Peer Support Specialist', label: 'Peer Support Specialist' },
  { value: 'Student/Intern', label: 'Student/Intern' },
  { value: 'Other', label: 'Other' }
];

export type ClinicianType = typeof CLINICIAN_TYPE_OPTIONS[number]['value'];

// Department Options
export const DEPARTMENT_OPTIONS = [
  { value: 'Administration', label: 'Administration' },
  { value: 'Clinical Services', label: 'Clinical Services' },
  { value: 'Mental Health', label: 'Mental Health' },
  { value: 'Substance Abuse', label: 'Substance Abuse' },
  { value: 'Crisis Services', label: 'Crisis Services' },
  { value: 'Outpatient Services', label: 'Outpatient Services' },
  { value: 'Inpatient Services', label: 'Inpatient Services' },
  { value: 'Emergency Services', label: 'Emergency Services' },
  { value: 'Billing', label: 'Billing' },
  { value: 'Human Resources', label: 'Human Resources' },
  { value: 'IT/Technology', label: 'IT/Technology' },
  { value: 'Quality Assurance', label: 'Quality Assurance' },
  { value: 'Compliance', label: 'Compliance' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Other', label: 'Other' }
];

export type Department = typeof DEPARTMENT_OPTIONS[number]['value'];

// Job Title Options
export const JOB_TITLE_OPTIONS = [
  { value: 'Practice Administrator', label: 'Practice Administrator' },
  { value: 'Clinical Director', label: 'Clinical Director' },
  { value: 'Medical Director', label: 'Medical Director' },
  { value: 'Psychiatrist', label: 'Psychiatrist' },
  { value: 'Psychologist', label: 'Psychologist' },
  { value: 'Licensed Clinical Social Worker', label: 'Licensed Clinical Social Worker' },
  { value: 'Licensed Professional Counselor', label: 'Licensed Professional Counselor' },
  { value: 'Licensed Marriage and Family Therapist', label: 'Licensed Marriage and Family Therapist' },
  { value: 'Advanced Practice Registered Nurse', label: 'Advanced Practice Registered Nurse' },
  { value: 'Physician Assistant', label: 'Physician Assistant' },
  { value: 'Registered Nurse', label: 'Registered Nurse' },
  { value: 'Licensed Practical Nurse', label: 'Licensed Practical Nurse' },
  { value: 'Medical Assistant', label: 'Medical Assistant' },
  { value: 'Case Manager', label: 'Case Manager' },
  { value: 'Peer Support Specialist', label: 'Peer Support Specialist' },
  { value: 'Receptionist', label: 'Receptionist' },
  { value: 'Scheduler', label: 'Scheduler' },
  { value: 'Billing Specialist', label: 'Billing Specialist' },
  { value: 'Office Manager', label: 'Office Manager' },
  { value: 'IT Specialist', label: 'IT Specialist' },
  { value: 'Quality Assurance Coordinator', label: 'Quality Assurance Coordinator' },
  { value: 'Compliance Officer', label: 'Compliance Officer' },
  { value: 'Marketing Coordinator', label: 'Marketing Coordinator' },
  { value: 'Student/Intern', label: 'Student/Intern' },
  { value: 'Other', label: 'Other' }
];

export type JobTitle = typeof JOB_TITLE_OPTIONS[number]['value'];

// License State Options (using US_STATES_OPTIONS from clientEnum)
export const LICENSE_STATE_OPTIONS = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 
  'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 
  'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 
  'WV', 'WI', 'WY'
].map(state => ({ value: state, label: state }));

export type LicenseState = typeof LICENSE_STATE_OPTIONS[number]['value'];

// Communication Preference Options (for CheckboxGroup)
export const COMMUNICATION_PREFERENCE_OPTIONS = [
  { 
    id: 'can_receive_text', 
    label: 'Can receive text messages', 
    description: 'Allow this staff member to receive SMS notifications and reminders' 
  }
];

export type CommunicationPreference = typeof COMMUNICATION_PREFERENCE_OPTIONS[number]['id'];

// Billing Settings Options (for CheckboxGroup)
export const BILLING_SETTINGS_OPTIONS = [
  { 
    id: 'can_bill_insurance', 
    label: 'Can bill insurance', 
    description: 'This staff member is authorized to submit insurance claims' 
  }
];

export type BillingSetting = typeof BILLING_SETTINGS_OPTIONS[number]['id'];

// Supervision Status Options
export const SUPERVISION_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'completed', label: 'Completed' }
];

export type SupervisionStatus = typeof SUPERVISION_STATUS_OPTIONS[number]['value'];

// Supervision Status Descriptions
export const SUPERVISION_STATUS_DESCRIPTIONS = {
  'active': 'The supervision relationship is currently active and ongoing.',
  'inactive': 'The supervision relationship is temporarily suspended.',
  'completed': 'The supervision relationship has been completed and terminated.'
} as const;

// Supervision Type Descriptions
export const SUPERVISION_TYPE_DESCRIPTIONS = {
  'Not Supervised': 'This staff member does not require supervision.',
  'Access patient notes and co-sign notes for selected payers': 'This staff member will have access to patient notes and can co-sign notes for specific insurance payers as designated by their supervisor.',
  'Must review and approve all notes': 'All clinical notes created by this staff member must be reviewed and approved by their assigned supervisor before being finalized.',
  'Must review and co-sign all notes': 'All clinical notes created by this staff member must be reviewed and co-signed by their assigned supervisor for billing and compliance purposes.'
} as const; 