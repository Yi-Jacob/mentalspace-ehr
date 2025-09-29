// Sidebar and Menu Permissions Enums

import { UserRole } from './staffEnum';

// Menu Item IDs
export const MENU_ITEM_IDS = {
  DASHBOARD: 'dashboard',
  CLIENTS: 'clients',
  NOTES: 'notes',
  SCHEDULING: 'scheduling',
  WORK_SCHEDULE: 'work-schedule',
  MESSAGE: 'message',
  TODO: 'todo',
  LIBRARY: 'library',
  CLIENT_FILES: 'client-files',
  BILLING: 'billing',
  STAFF: 'staff',
  AUDIT: 'audit',
  COMPLIANCE: 'compliance',
  PRACTICE_SETTINGS: 'practice-settings',
} as const;

// Billing Sub-Items
export const BILLING_SUB_ITEMS = {
  PAYER_MANAGEMENT: 'payer-management',
  INSURANCE_VERIFICATION: 'insurance-verification',
  CLAIMS_SUBMISSION: 'claims-submission',
  PAYMENT_PROCESSING: 'payment-processing',
  STATEMENT_GENERATION: 'statement-generation',
} as const;

// Staff Sub-Items
export const STAFF_SUB_ITEMS = {
  STAFF_LIST: 'staff-list',
  STAFF_SUPERVISION: 'staff-supervision',
  STAFF_ROLES: 'staff-roles',
  STAFF_PERMISSIONS: 'staff-permissions',
} as const;

// Audit Sub-Items
export const AUDIT_SUB_ITEMS = {
  AUDIT_LOGS: 'audit-logs',
  AUDIT_STATS: 'audit-stats',
} as const;

// Compliance Sub-Items
export const COMPLIANCE_SUB_ITEMS = {
  COMPENSATION: 'compensation',
  SESSIONS: 'sessions',
  TIME_TRACKING: 'time-tracking',
  PAYMENTS: 'payments',
  DEADLINES: 'deadlines',
} as const;

// Menu Item Configuration
export interface MenuItemConfig {
  id: string;
  label: string;
  path: string;
  subItems?: {
    id: string;
    label: string;
    path: string;
  }[];
}

// All Menu Items Configuration
export const MENU_ITEMS_CONFIG: MenuItemConfig[] = [
  {
    id: MENU_ITEM_IDS.DASHBOARD,
    label: 'Dashboard',
    path: '/'
  },
  {
    id: MENU_ITEM_IDS.CLIENTS,
    label: 'Clients',
    path: '/clients'
  },
  {
    id: MENU_ITEM_IDS.NOTES,
    label: 'Notes',
    path: '/notes/all-notes'
  },
  {
    id: MENU_ITEM_IDS.SCHEDULING,
    label: 'Scheduling',
    path: '/scheduling'
  },
  {
    id: MENU_ITEM_IDS.WORK_SCHEDULE,
    label: 'Work Schedule',
    path: '/work-schedule'
  },
  {
    id: MENU_ITEM_IDS.MESSAGE,
    label: 'Message',
    path: '/message'
  },
  {
    id: MENU_ITEM_IDS.TODO,
    label: 'To-Do',
    path: '/todo'
  },
  {
    id: MENU_ITEM_IDS.LIBRARY,
    label: 'Library',
    path: '/library'
  },
  {
    id: MENU_ITEM_IDS.CLIENT_FILES,
    label: 'Files',
    path: '/files'
  },
  {
    id: MENU_ITEM_IDS.BILLING,
    label: 'Billing',
    path: '/billing',
    subItems: [
      {
        id: BILLING_SUB_ITEMS.PAYER_MANAGEMENT,
        label: 'Payer Management',
        path: '/billing/payer-management'
      },
      {
        id: BILLING_SUB_ITEMS.INSURANCE_VERIFICATION,
        label: 'Insurance Verification',
        path: '/billing/insurance-verification'
      },
      {
        id: BILLING_SUB_ITEMS.CLAIMS_SUBMISSION,
        label: 'Claims Submission',
        path: '/billing/claims-submission'
      },
      {
        id: BILLING_SUB_ITEMS.PAYMENT_PROCESSING,
        label: 'Payment Processing',
        path: '/billing/payment-processing'
      },
      {
        id: BILLING_SUB_ITEMS.STATEMENT_GENERATION,
        label: 'Statement Generation',
        path: '/billing/statement-generation'
      },
    ]
  },
  {
    id: MENU_ITEM_IDS.STAFF,
    label: 'Staff',
    path: '/staff',
    subItems: [
      {
        id: STAFF_SUB_ITEMS.STAFF_LIST,
        label: 'Staffs',
        path: '/staff'
      },
      {
        id: STAFF_SUB_ITEMS.STAFF_SUPERVISION,
        label: 'Supervision',
        path: '/staff/supervision'
      },
      {
        id: STAFF_SUB_ITEMS.STAFF_ROLES,
        label: 'Roles',
        path: '/staff/roles'
      },
      {
        id: STAFF_SUB_ITEMS.STAFF_PERMISSIONS,
        label: 'Permissions',
        path: '/staff/permissions'
      },
    ]
  },
  {
    id: MENU_ITEM_IDS.AUDIT,
    label: 'Audit',
    path: '/audit',
    subItems: [
      {
        id: AUDIT_SUB_ITEMS.AUDIT_LOGS,
        label: 'Audit Logs',
        path: '/audit/logs'
      },
      {
        id: AUDIT_SUB_ITEMS.AUDIT_STATS,
        label: 'Statistics',
        path: '/audit/stats'
      },
    ]
  },
  {
    id: MENU_ITEM_IDS.COMPLIANCE,
    label: 'Compliance',
    path: '/compliance',
    subItems: [
      {
        id: COMPLIANCE_SUB_ITEMS.COMPENSATION,
        label: 'Compensation',
        path: '/compliance/compensation'
      },
      {
        id: COMPLIANCE_SUB_ITEMS.SESSIONS,
        label: 'Sessions',
        path: '/compliance/sessions'
      },
      {
        id: COMPLIANCE_SUB_ITEMS.TIME_TRACKING,
        label: 'Time Tracking',
        path: '/compliance/time-tracking'
      },
      {
        id: COMPLIANCE_SUB_ITEMS.PAYMENTS,
        label: 'Payments',
        path: '/compliance/payments'
      },
      {
        id: COMPLIANCE_SUB_ITEMS.DEADLINES,
        label: 'Deadlines',
        path: '/compliance/deadlines'
      }
    ]
  },
  {
    id: MENU_ITEM_IDS.PRACTICE_SETTINGS,
    label: 'Practice Settings',
    path: '/practice-settings'
  }
];

// Menu Permission Configuration
export interface MenuPermissionConfig {
  roles: UserRole[];
  allowAll?: boolean;
  allowClients?: boolean;
}

// Menu Permissions Mapping
export const MENU_PERMISSIONS: Record<string, MenuPermissionConfig> = {
  // Dashboard - accessible to all authenticated users
  [MENU_ITEM_IDS.DASHBOARD]: {
    roles: [
      'Practice Administrator',
      'Clinical Administrator',
      'Supervisor',
      'Clinician',
      'Intern',
      'Assistant',
      'Associate'
    ]
  },

  // Clients - accessible to clinical staff and schedulers
  [MENU_ITEM_IDS.CLIENTS]: {
    roles: [
      'Clinician',
      'Intern',
      'Assistant',
      'Associate',
      'Supervisor',
      'Clinical Administrator',
      'Practice Scheduler',
      'Practice Administrator'
    ]
  },

  // Notes - accessible to clinical staff
  [MENU_ITEM_IDS.NOTES]: {
    roles: [
      'Clinician',
      'Intern',
      'Assistant',
      'Associate',
      'Supervisor',
      'Clinical Administrator',
      'Practice Administrator'
    ]
  },

  // Scheduling - accessible to schedulers, clinical staff, and clients
  [MENU_ITEM_IDS.SCHEDULING]: {
    roles: [
      'Practice Scheduler',
      'Clinician',
      'Intern',
      'Assistant',
      'Associate',
      'Clinical Administrator',
      'Practice Administrator',
      'Patient'
    ]
  },

  [MENU_ITEM_IDS.WORK_SCHEDULE]: {
    roles: [
      'Practice Scheduler',
      'Clinician',
      'Intern',
      'Assistant',
      'Associate',
      'Clinical Administrator',
      'Practice Administrator'
    ]
  },

  // Messages - accessible to all clinical staff
  [MENU_ITEM_IDS.MESSAGE]: {
    roles: [
      'Clinician',
      'Intern',
      'Assistant',
      'Associate',
      'Supervisor',
      'Clinical Administrator',
      'Practice Administrator',
      'Patient'
    ]
  },

  // Todo - accessible to all staff
  [MENU_ITEM_IDS.TODO]: {
    roles: [
      'Clinician',
      'Intern',
      'Assistant',
      'Associate',
      'Supervisor',
      'Clinical Administrator',
      'Practice Administrator',
      'Practice Scheduler',
      'Practice Biller',
      'Biller for Assigned Patients Only',
    ]
  },

  // Library - accessible to all staff
  [MENU_ITEM_IDS.LIBRARY]: {
    roles: [
      'Clinician',
      'Intern',
      'Assistant',
      'Associate',
      'Supervisor',
      'Clinical Administrator',
      'Practice Administrator',
      'Practice Scheduler',
      'Practice Biller',
      'Biller for Assigned Patients Only',
    ]
  },

  // Files - accessible to clients only
  [MENU_ITEM_IDS.CLIENT_FILES]: {
    roles: [
      'Patient'
    ]
  },

  // Billing - accessible to billing staff and clinical staff with billing permissions
  [MENU_ITEM_IDS.BILLING]: {
    roles: [
      'Practice Biller',
      'Biller for Assigned Patients Only',
      'Clinician',
      'Intern',
      'Assistant',
      'Associate',
      'Clinical Administrator',
      'Practice Administrator'
    ]
  },
  [BILLING_SUB_ITEMS.PAYER_MANAGEMENT]: {
    roles: [
      'Practice Biller',
      'Practice Administrator'
    ]
  },
  [BILLING_SUB_ITEMS.INSURANCE_VERIFICATION]: {
    roles: [
      'Practice Biller',
      'Biller for Assigned Patients Only',
      'Practice Scheduler',
      'Clinical Administrator',
      'Practice Administrator'
    ]
  },
  [BILLING_SUB_ITEMS.CLAIMS_SUBMISSION]: {
    roles: [
      'Practice Biller',
      'Biller for Assigned Patients Only',
      'Clinical Administrator',
      'Practice Administrator'
    ]
  },
  [BILLING_SUB_ITEMS.PAYMENT_PROCESSING]: {
    roles: [
      'Practice Biller',
      'Biller for Assigned Patients Only',
      'Clinical Administrator',
      'Practice Administrator'
    ]
  },
  [BILLING_SUB_ITEMS.STATEMENT_GENERATION]: {
    roles: [
      'Practice Biller',
      'Biller for Assigned Patients Only',
      'Clinical Administrator',
      'Practice Administrator'
    ]
  },

  // Staff - accessible to administrators and supervisors
  [MENU_ITEM_IDS.STAFF]: {
    roles: [
      'Practice Administrator',
      'Clinical Administrator',
      'Supervisor'
    ]
  },
  [STAFF_SUB_ITEMS.STAFF_LIST]: {
    roles: [
      'Practice Administrator',
      'Clinical Administrator',
      'Supervisor'
    ]
  },
  [STAFF_SUB_ITEMS.STAFF_SUPERVISION]: {
    roles: [
      'Supervisor',
      'Clinical Administrator',
      'Practice Administrator'
    ]
  },
  [STAFF_SUB_ITEMS.STAFF_ROLES]: {
    roles: [
      'Practice Administrator'
    ]
  },
  [STAFF_SUB_ITEMS.STAFF_PERMISSIONS]: {
    roles: [
      'Practice Administrator'
    ]
  },

  // Audit - accessible only to practice administrators and clinical administrators
  [MENU_ITEM_IDS.AUDIT]: {
    roles: [
      'Practice Administrator',
      'Clinical Administrator'
    ]
  },
  [AUDIT_SUB_ITEMS.AUDIT_LOGS]: {
    roles: [
      'Practice Administrator',
      'Clinical Administrator'
    ]
  },
  [AUDIT_SUB_ITEMS.AUDIT_STATS]: {
    roles: [
      'Practice Administrator',
      'Clinical Administrator'
    ]
  },

  // Compliance - accessible to administrators and clinical staff
  [MENU_ITEM_IDS.COMPLIANCE]: {
    roles: [
      'Practice Administrator',
      'Clinical Administrator',
      'Supervisor',
      'Clinician',
      'Intern',
      'Assistant',
      'Associate'
    ]
  },
  [COMPLIANCE_SUB_ITEMS.COMPENSATION]: {
    roles: [
      'Practice Administrator',
      'Clinical Administrator'
    ]
  },
  [COMPLIANCE_SUB_ITEMS.SESSIONS]: {
    roles: [
      'Clinician',
      'Intern',
      'Assistant',
      'Associate',
      'Supervisor',
      'Clinical Administrator',
      'Practice Administrator'
    ]
  },
  [COMPLIANCE_SUB_ITEMS.TIME_TRACKING]: {
    roles: [
      'Clinician',
      'Intern',
      'Assistant',
      'Associate',
      'Supervisor',
      'Clinical Administrator',
      'Practice Administrator'
    ]
  },
  [COMPLIANCE_SUB_ITEMS.PAYMENTS]: {
    roles: [
      'Practice Biller',
      'Biller for Assigned Patients Only',
      'Clinical Administrator',
      'Practice Administrator'
    ]
  },
  [COMPLIANCE_SUB_ITEMS.DEADLINES]: {
    roles: [
      'Clinician',
      'Intern',
      'Assistant',
      'Associate',
      'Supervisor',
      'Clinical Administrator',
      'Practice Administrator'
    ]
  },

  // Practice Settings - accessible only to practice administrators
  [MENU_ITEM_IDS.PRACTICE_SETTINGS]: {
    roles: [
      'Practice Administrator'
    ]
  }
};

// Export types
export type MenuItemId = typeof MENU_ITEM_IDS[keyof typeof MENU_ITEM_IDS];
export type BillingSubItemId = typeof BILLING_SUB_ITEMS[keyof typeof BILLING_SUB_ITEMS];
export type StaffSubItemId = typeof STAFF_SUB_ITEMS[keyof typeof STAFF_SUB_ITEMS];
export type AuditSubItemId = typeof AUDIT_SUB_ITEMS[keyof typeof AUDIT_SUB_ITEMS];
export type ComplianceSubItemId = typeof COMPLIANCE_SUB_ITEMS[keyof typeof COMPLIANCE_SUB_ITEMS];
