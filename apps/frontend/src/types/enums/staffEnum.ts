// Staff-related enums and options for SelectField components

// User Status Options
export const USER_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
  { value: 'suspended', label: 'Suspended' }
];

export type UserStatus = typeof USER_STATUS_OPTIONS[number]['value'];

export const USER_ROLES = {
  PRACTICE_ADMINISTRATOR: 'Practice Administrator',
  PRACTICE_SCHEDULER: 'Practice Scheduler',
  CLINICIAN: 'Clinician',
  INTERN: 'Intern',
  ASSISTANT: 'Assistant',
  ASSOCIATE: 'Associate',
  SUPERVISOR: 'Supervisor',
  CLINICAL_ADMINISTRATOR: 'Clinical Administrator',
  BILLER_FOR_ASSIGNED_PATIENTS_ONLY: 'Biller for Assigned Patients Only',
  PRACTICE_BILLER: 'Practice Biller',
  PATIENT: 'Patient'
}

// User Role Options - Static list based on roleCategories
export const USER_ROLE_OPTIONS = [
  { value: USER_ROLES.PRACTICE_ADMINISTRATOR, label: 'Practice Administrator' },
  { value: USER_ROLES.PRACTICE_SCHEDULER, label: 'Practice Scheduler' },
  { value: USER_ROLES.CLINICIAN, label: 'Clinician' },
  { value: USER_ROLES.INTERN, label: 'Intern / Assistant / Associate' },
  { value: USER_ROLES.ASSISTANT, label: 'Assistant' },
  { value: USER_ROLES.ASSOCIATE, label: 'Associate' },
  { value: USER_ROLES.SUPERVISOR, label: 'Supervisor' },
  { value: USER_ROLES.CLINICAL_ADMINISTRATOR, label: 'Clinical Administrator' },
  { value: USER_ROLES.BILLER_FOR_ASSIGNED_PATIENTS_ONLY, label: 'Biller for Assigned Patients Only' },
  { value: USER_ROLES.PRACTICE_BILLER, label: 'Practice Biller' },
  { value: USER_ROLES.PATIENT, label: 'Patient' }
];

export type UserRole = typeof USER_ROLE_OPTIONS[number]['value'];

// Role Descriptions (for tooltips and help text)
export const ROLE_DESCRIPTIONS = {
  [USER_ROLES.PRACTICE_ADMINISTRATOR]: 'A TherapyNotes Practice Administrator can add and edit TherapyNotes users, change user roles, reset passwords, and set account access settings.',
  [USER_ROLES.PRACTICE_SCHEDULER]: 'A Scheduler can schedule, reschedule, and cancel appointments for any clinician. They can add, edit, or remove new patients.',
  [USER_ROLES.CLINICIAN]: 'Clinicians provide services to a client. They can view and edit their own schedule, complete notes and manage records of patients assigned to them.',
  [USER_ROLES.INTERN]: 'The Intern role is similar to a Clinician but with limitations. Interns do not have an NPI and can only bill to insurance under a Supervisor\'s credentials.',
  [USER_ROLES.ASSISTANT]: 'The Assistant role is similar to a Clinician but with limitations. Assistants do not have an NPI and can only bill to insurance under a Supervisor\'s credentials.',
  [USER_ROLES.ASSOCIATE]: 'The Associate role is similar to a Clinician but with limitations. Associates do not have an NPI and can only bill to insurance under a Supervisor\'s credentials.',
  [USER_ROLES.SUPERVISOR]: 'A Supervisor can be assigned to individual clinicians and interns, granting full access to their supervisees\' patient\'s notes.',
  [USER_ROLES.CLINICAL_ADMINISTRATOR]: 'A Clinical Administrator must also have the Clinician role. They can access any patient\'s records and can give other clinicians access to any patient records.',
  [USER_ROLES.BILLER_FOR_ASSIGNED_PATIENTS_ONLY]: 'Clinicians with this role can collect and enter copay information, including by processing patient credit cards.',
  [USER_ROLES.PRACTICE_BILLER]: 'A Practice Biller has full billing access to all patients in the practice. They can verify patient insurance, generate and track claims, enter patient and insurance payments, and run billing reports.',
  [USER_ROLES.PATIENT]: 'Patients are clients who receive mental health services. They have limited access to view their own appointments, documents, and basic account information.'
} as const;

// Static role categories for the RolesSection component
export const ROLE_CATEGORIES = [
  {
    title: 'Practice Administration',
    items: [
      {
        id: USER_ROLES.PRACTICE_ADMINISTRATOR,
        label: 'Practice Administrator',
        description: ROLE_DESCRIPTIONS[USER_ROLES.PRACTICE_ADMINISTRATOR]
      }
    ]
  },
  {
    title: 'Scheduling Access',
    items: [
      {
        id: USER_ROLES.PRACTICE_SCHEDULER,
        label: 'Practice Scheduler',
        description: ROLE_DESCRIPTIONS[USER_ROLES.PRACTICE_SCHEDULER]
      }
    ]
  },
  {
    title: 'Clinical Access',
    items: [
      {
        id: USER_ROLES.CLINICIAN,
        label: 'Clinician',
        description: ROLE_DESCRIPTIONS[USER_ROLES.CLINICIAN]
      },
      {
        id: USER_ROLES.INTERN,
        label: 'Intern',
        displayName: 'Intern / Assistant / Associate',
        description: ROLE_DESCRIPTIONS[USER_ROLES.INTERN]
      },
      {
        id: USER_ROLES.SUPERVISOR,
        label: 'Supervisor',
        description: ROLE_DESCRIPTIONS[USER_ROLES.SUPERVISOR]
      },
      {
        id: USER_ROLES.CLINICAL_ADMINISTRATOR,
        label: 'Clinical Administrator',
        description: ROLE_DESCRIPTIONS[USER_ROLES.CLINICAL_ADMINISTRATOR]
      }
    ]
  },
  {
    title: 'Billing Access',
    items: [
      {
        id: USER_ROLES.BILLER_FOR_ASSIGNED_PATIENTS_ONLY,
        label: 'Biller for Assigned Patients Only',
        description: ROLE_DESCRIPTIONS[USER_ROLES.BILLER_FOR_ASSIGNED_PATIENTS_ONLY]
      },
      {
        id: USER_ROLES.PRACTICE_BILLER,
        label: 'Practice Biller',
        description: ROLE_DESCRIPTIONS[USER_ROLES.PRACTICE_BILLER]
      }
    ]
  },
  {
    title: 'Patient Access',
    items: [
      {
        id: USER_ROLES.PATIENT,
        label: 'Patient',
        description: ROLE_DESCRIPTIONS[USER_ROLES.PATIENT]
      }
    ]
  }
];

// Permission Options
export const PERMISSION_OPTIONS = [
  { value: 'User Management', label: 'User Management' },
  { value: 'Role Management', label: 'Role Management' },
  { value: 'Password Reset', label: 'Password Reset' },
  { value: 'Account Access Settings', label: 'Account Access Settings' },
  { value: 'System Configuration Access', label: 'System Configuration Access' },
  { value: 'Audit Logs', label: 'Audit Logs' },
  { value: 'Security Policy Configuration', label: 'Security Policy Configuration' },
  { value: 'Schedule Management', label: 'Schedule Management' },
  { value: 'Clinical Documentation', label: 'Clinical Documentation' },
  { value: 'Patient Record Management', label: 'Patient Record Management' },
  { value: 'Access Sharing', label: 'Access Sharing' },
  { value: 'Treatment Plan Management', label: 'Treatment Plan Management' },
  { value: 'Session Documentation', label: 'Session Documentation' },
  { value: 'Billing', label: 'Billing' },
  { value: 'Note Reopening', label: 'Note Reopening' },
  { value: 'Claims Management', label: 'Claims Management' },
  { value: 'Payment Entry', label: 'Payment Entry' },
  { value: 'Insurance Benefit Verification', label: 'Insurance Benefit Verification' },
  { value: 'Claims Generation and Tracking', label: 'Claims Generation and Tracking' },
  { value: 'Billing Reports', label: 'Billing Reports' },
  { value: 'Create Contact/Miscellaneous Notes', label: 'Create Contact/Miscellaneous Notes' },
  { value: 'Create Missed Appointment Notes', label: 'Create Missed Appointment Notes' },
  { value: 'Create Contact Notes', label: 'Create Contact Notes' },
  { value: 'Create Miscellaneous Notes', label: 'Create Miscellaneous Notes' },
  { value: 'Supervision', label: 'Supervision' },
  { value: 'View Own Appointments', label: 'View Own Appointments' },
  { value: 'View Own Documents', label: 'View Own Documents' },
  { value: 'View Own Account Information', label: 'View Own Account Information' },
  { value: 'Update Contact Information', label: 'Update Contact Information' }
];

export type Permission = typeof PERMISSION_OPTIONS[number]['value'];

// Permission Descriptions
export const PERMISSION_DESCRIPTIONS = {
  'User Management': 'Create, edit, and manage user accounts and profiles',
  'Role Management': 'Assign and modify user roles and permissions',
  'Password Reset': 'Reset user passwords and manage authentication',
  'Account Access Settings': 'Configure account access and security settings',
  'System Configuration Access': 'Access and modify system-wide configurations',
  'Audit Logs': 'View and analyze system audit logs',
  'Security Policy Configuration': 'Configure security policies and compliance settings',
  'Schedule Management': 'Manage appointment scheduling and calendar access',
  'Clinical Documentation': 'Create and manage clinical documentation and notes',
  'Patient Record Management': 'Access and manage patient records and information',
  'Access Sharing': 'Share patient access with other clinicians',
  'Treatment Plan Management': 'Create and manage treatment plans',
  'Session Documentation': 'Document therapy sessions and progress notes',
  'Billing': 'Process billing and insurance claims',
  'Note Reopening': 'Reopen and modify completed clinical notes',
  'Claims Management': 'Manage insurance claims and billing processes',
  'Payment Entry': 'Enter and process patient payments',
  'Insurance Benefit Verification': 'Verify insurance benefits and coverage',
  'Claims Generation and Tracking': 'Generate and track insurance claims',
  'Billing Reports': 'Generate and view billing reports',
  'Create Contact/Miscellaneous Notes': 'Create contact and miscellaneous clinical notes',
  'Create Missed Appointment Notes': 'Document missed appointments and follow-ups',
  'Create Contact Notes': 'Create contact notes for patient interactions',
  'Create Miscellaneous Notes': 'Create miscellaneous clinical documentation',
  'Supervision': 'Supervise other clinicians and review their work',
  'View Own Appointments': 'View personal appointment schedule and details',
  'View Own Documents': 'View personal documents and records',
  'View Own Account Information': 'View personal account and profile information',
  'Update Contact Information': 'Update personal contact details and preferences'
} as const;

// Role-Permission Mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [USER_ROLES.PRACTICE_ADMINISTRATOR]: [
    'User Management',
    'Role Management',
    'Password Reset',
    'Account Access Settings',
    'System Configuration Access',
    'Audit Logs',
    'Security Policy Configuration'
  ],
  [USER_ROLES.PRACTICE_SCHEDULER]: [
    'Schedule Management'
  ],
  [USER_ROLES.CLINICIAN]: [
    'Schedule Management',
    'Clinical Documentation',
    'Patient Record Management',
    'Access Sharing',
    'Treatment Plan Management',
    'Session Documentation',
    'Billing',
    'Note Reopening',
    'Create Contact/Miscellaneous Notes',
    'Create Missed Appointment Notes',
    'Create Contact Notes',
    'Create Miscellaneous Notes'
  ],
  [USER_ROLES.INTERN]: [
    'Schedule Management',
    'Clinical Documentation',
    'Patient Record Management',
    'Access Sharing',
    'Treatment Plan Management',
    'Session Documentation',
    'Billing',
    'Create Contact/Miscellaneous Notes',
    'Create Missed Appointment Notes',
    'Create Contact Notes',
    'Create Miscellaneous Notes'
  ],
  [USER_ROLES.ASSISTANT]: [
    'Schedule Management',
    'Clinical Documentation',
    'Patient Record Management',
    'Access Sharing',
    'Treatment Plan Management',
    'Session Documentation',
    'Billing',
    'Create Contact/Miscellaneous Notes',
    'Create Missed Appointment Notes',
    'Create Contact Notes',
    'Create Miscellaneous Notes'
  ],
  [USER_ROLES.ASSOCIATE]: [
    'Schedule Management',
    'Clinical Documentation',
    'Patient Record Management',
    'Access Sharing',
    'Treatment Plan Management',
    'Session Documentation',
    'Billing',
    'Create Contact/Miscellaneous Notes',
    'Create Missed Appointment Notes',
    'Create Contact Notes',
    'Create Miscellaneous Notes'
  ],
  [USER_ROLES.SUPERVISOR]: [
    'Clinical Documentation',
    'Patient Record Management',
    'Access Sharing',
    'Treatment Plan Management',
    'Session Documentation',
    'Note Reopening',
    'Supervision'
  ],
  [USER_ROLES.CLINICAL_ADMINISTRATOR]: [
    'Schedule Management',
    'Clinical Documentation',
    'Patient Record Management',
    'Access Sharing',
    'Treatment Plan Management',
    'Session Documentation',
    'Note Reopening',
    'Create Contact/Miscellaneous Notes',
    'Create Missed Appointment Notes',
    'Create Contact Notes',
    'Create Miscellaneous Notes'
  ],
  [USER_ROLES.BILLER_FOR_ASSIGNED_PATIENTS_ONLY]: [
    'Billing',
    'Claims Management',
    'Payment Entry',
    'Insurance Benefit Verification',
    'Claims Generation and Tracking',
    'Billing Reports'
  ],
  [USER_ROLES.PRACTICE_BILLER]: [
    'Billing',
    'Claims Management',
    'Payment Entry',
    'Insurance Benefit Verification',
    'Claims Generation and Tracking',
    'Billing Reports'
  ],
  [USER_ROLES.PATIENT]: [
    'View Own Appointments',
    'View Own Documents',
    'View Own Account Information',
    'Update Contact Information'
  ]
};

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

// License Type Options - Common license types with ability to add custom ones
export const LICENSE_TYPE_OPTIONS = [
  { value: 'LCSW', label: 'LCSW - Licensed Clinical Social Worker' },
  { value: 'LMFT', label: 'LMFT - Licensed Marriage and Family Therapist' },
  { value: 'LPC', label: 'LPC - Licensed Professional Counselor' },
  { value: 'LCPC', label: 'LCPC - Licensed Clinical Professional Counselor' },
  { value: 'PsyD', label: 'PsyD - Doctor of Psychology' },
  { value: 'PhD', label: 'PhD - Doctor of Philosophy in Psychology' },
  { value: 'MD', label: 'MD - Medical Doctor' },
  { value: 'APRN', label: 'APRN - Advanced Practice Registered Nurse' },
  { value: 'PA', label: 'PA - Physician Assistant' },
  { value: 'RN', label: 'RN - Registered Nurse' },
  { value: 'LPN', label: 'LPN - Licensed Practical Nurse' },
  { value: 'MA', label: 'MA - Medical Assistant' },
  { value: 'Other', label: 'Other' }
];

export type LicenseType = typeof LICENSE_TYPE_OPTIONS[number]['value'];

// License Status Options
export const LICENSE_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'expired', label: 'Expired' }
];

export type LicenseStatus = typeof LICENSE_STATUS_OPTIONS[number]['value'];

// Issued By Options - Common licensing authorities with ability to add custom ones
export const ISSUED_BY_OPTIONS = [
  { value: 'California Board of Behavioral Sciences', label: 'California Board of Behavioral Sciences' },
  { value: 'New York State Education Department', label: 'New York State Education Department' },
  { value: 'Texas State Board of Examiners of Professional Counselors', label: 'Texas State Board of Examiners of Professional Counselors' },
  { value: 'Florida Department of Health', label: 'Florida Department of Health' },
  { value: 'Illinois Department of Financial and Professional Regulation', label: 'Illinois Department of Financial and Professional Regulation' },
  { value: 'Pennsylvania State Board of Social Workers', label: 'Pennsylvania State Board of Social Workers' },
  { value: 'Ohio Counselor, Social Worker and Marriage & Family Therapist Board', label: 'Ohio Counselor, Social Worker and Marriage & Family Therapist Board' },
  { value: 'Michigan Department of Licensing and Regulatory Affairs', label: 'Michigan Department of Licensing and Regulatory Affairs' },
  { value: 'Georgia Composite Board of Professional Counselors', label: 'Georgia Composite Board of Professional Counselors' },
  { value: 'North Carolina Social Work Certification and Licensure Board', label: 'North Carolina Social Work Certification and Licensure Board' },
  { value: 'Other', label: 'Other' }
];

export type IssuedBy = typeof ISSUED_BY_OPTIONS[number]['value'];

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