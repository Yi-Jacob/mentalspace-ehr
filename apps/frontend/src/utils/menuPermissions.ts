import { USER_ROLES, UserRole } from '@/types/enums/staffEnum';

// Define which roles can access each menu item and sub-item
export interface MenuPermission {
  roles: UserRole[];
  allowAll?: boolean; // If true, all authenticated users can access
  allowClients?: boolean; // If true, clients can access (for future use)
}

// Menu item permissions mapping
export const MENU_PERMISSIONS: Record<string, MenuPermission> = {
  // Dashboard - accessible to all authenticated users
  'dashboard': {
    roles: [
      USER_ROLES.PRACTICE_ADMINISTRATOR,
      USER_ROLES.CLINICAL_ADMINISTRATOR,
      USER_ROLES.SUPERVISOR,
      USER_ROLES.CLINICIAN,
      USER_ROLES.INTERN,
      USER_ROLES.ASSISTANT,
      USER_ROLES.ASSOCIATE
    ]
  },

  // Clients - accessible to clinical staff and schedulers
  'clients': {
    roles: [
      USER_ROLES.CLINICIAN,
      USER_ROLES.INTERN,
      USER_ROLES.ASSISTANT,
      USER_ROLES.ASSOCIATE,
      USER_ROLES.SUPERVISOR,
      USER_ROLES.CLINICAL_ADMINISTRATOR,
      USER_ROLES.PRACTICE_SCHEDULER,
      USER_ROLES.PRACTICE_ADMINISTRATOR
    ]
  },

  // Notes - accessible to clinical staff
  'notes': {
    roles: [
      USER_ROLES.CLINICIAN,
      USER_ROLES.INTERN,
      USER_ROLES.ASSISTANT,
      USER_ROLES.ASSOCIATE,
      USER_ROLES.SUPERVISOR,
      USER_ROLES.CLINICAL_ADMINISTRATOR,
      USER_ROLES.PRACTICE_ADMINISTRATOR
    ]
  },
  'all-notes': {
    roles: [
      USER_ROLES.CLINICIAN,
      USER_ROLES.INTERN,
      USER_ROLES.ASSISTANT,
      USER_ROLES.ASSOCIATE,
      USER_ROLES.SUPERVISOR,
      USER_ROLES.CLINICAL_ADMINISTRATOR,
      USER_ROLES.PRACTICE_ADMINISTRATOR
    ]
  },
  'create-note': {
    roles: [
      USER_ROLES.CLINICIAN,
      USER_ROLES.INTERN,
      USER_ROLES.ASSISTANT,
      USER_ROLES.ASSOCIATE,
      USER_ROLES.SUPERVISOR,
      USER_ROLES.CLINICAL_ADMINISTRATOR,
      USER_ROLES.PRACTICE_ADMINISTRATOR
    ]
  },
  'pending-approvals': {
    roles: [
      USER_ROLES.SUPERVISOR,
      USER_ROLES.CLINICAL_ADMINISTRATOR,
      USER_ROLES.PRACTICE_ADMINISTRATOR
    ]
  },

  // Scheduling - accessible to schedulers and clinical staff
  'scheduling': {
    roles: [
      USER_ROLES.PRACTICE_SCHEDULER,
      USER_ROLES.CLINICIAN,
      USER_ROLES.INTERN,
      USER_ROLES.ASSISTANT,
      USER_ROLES.ASSOCIATE,
      USER_ROLES.CLINICAL_ADMINISTRATOR,
      USER_ROLES.PRACTICE_ADMINISTRATOR
    ]
  },
  'calendar': {
    roles: [
      USER_ROLES.PRACTICE_SCHEDULER,
      USER_ROLES.CLINICIAN,
      USER_ROLES.INTERN,
      USER_ROLES.ASSISTANT,
      USER_ROLES.ASSOCIATE,
      USER_ROLES.CLINICAL_ADMINISTRATOR,
      USER_ROLES.PRACTICE_ADMINISTRATOR
    ]
  },
  'appointments': {
    roles: [
      USER_ROLES.PRACTICE_SCHEDULER,
      USER_ROLES.CLINICIAN,
      USER_ROLES.INTERN,
      USER_ROLES.ASSISTANT,
      USER_ROLES.ASSOCIATE,
      USER_ROLES.CLINICAL_ADMINISTRATOR,
      USER_ROLES.PRACTICE_ADMINISTRATOR
    ]
  },
  'work-schedule': {
    roles: [
      USER_ROLES.PRACTICE_SCHEDULER,
      USER_ROLES.CLINICIAN,
      USER_ROLES.INTERN,
      USER_ROLES.ASSISTANT,
      USER_ROLES.ASSOCIATE,
      USER_ROLES.CLINICAL_ADMINISTRATOR,
      USER_ROLES.PRACTICE_ADMINISTRATOR
    ]
  },

  // Messages - accessible to all clinical staff
  'message': {
    roles: [
      USER_ROLES.CLINICIAN,
      USER_ROLES.INTERN,
      USER_ROLES.ASSISTANT,
      USER_ROLES.ASSOCIATE,
      USER_ROLES.SUPERVISOR,
      USER_ROLES.CLINICAL_ADMINISTRATOR,
      USER_ROLES.PRACTICE_ADMINISTRATOR,
      USER_ROLES.PATIENT
    ]
  },

  // Todo - accessible to all staff
  'todo': {
    roles: [
      USER_ROLES.CLINICIAN,
      USER_ROLES.INTERN,
      USER_ROLES.ASSISTANT,
      USER_ROLES.ASSOCIATE,
      USER_ROLES.SUPERVISOR,
      USER_ROLES.CLINICAL_ADMINISTRATOR,
      USER_ROLES.PRACTICE_ADMINISTRATOR,
      USER_ROLES.PRACTICE_SCHEDULER,
      USER_ROLES.PRACTICE_BILLER,
      USER_ROLES.BILLER_FOR_ASSIGNED_PATIENTS_ONLY,
    ]
  },

  // Library - accessible to all staff
  'library': {
    roles: [
      USER_ROLES.CLINICIAN,
      USER_ROLES.INTERN,
      USER_ROLES.ASSISTANT,
      USER_ROLES.ASSOCIATE,
      USER_ROLES.SUPERVISOR,
      USER_ROLES.CLINICAL_ADMINISTRATOR,
      USER_ROLES.PRACTICE_ADMINISTRATOR,
      USER_ROLES.PRACTICE_SCHEDULER,
      USER_ROLES.PRACTICE_BILLER,
      USER_ROLES.BILLER_FOR_ASSIGNED_PATIENTS_ONLY,
    ]
  },

  // Files - accessible to clients and all staff
  'files': {
    roles: [
      USER_ROLES.CLINICIAN,
      USER_ROLES.INTERN,
      USER_ROLES.ASSISTANT,
      USER_ROLES.ASSOCIATE,
      USER_ROLES.SUPERVISOR,
      USER_ROLES.CLINICAL_ADMINISTRATOR,
      USER_ROLES.PRACTICE_ADMINISTRATOR,
      USER_ROLES.PRACTICE_SCHEDULER,
      USER_ROLES.PRACTICE_BILLER,
      USER_ROLES.BILLER_FOR_ASSIGNED_PATIENTS_ONLY,
      USER_ROLES.PATIENT
    ]
  },

  // Billing - accessible to billing staff and clinical staff with billing permissions
  'billing': {
    roles: [
      USER_ROLES.PRACTICE_BILLER,
      USER_ROLES.BILLER_FOR_ASSIGNED_PATIENTS_ONLY,
      USER_ROLES.CLINICIAN,
      USER_ROLES.INTERN,
      USER_ROLES.ASSISTANT,
      USER_ROLES.ASSOCIATE,
      USER_ROLES.CLINICAL_ADMINISTRATOR,
      USER_ROLES.PRACTICE_ADMINISTRATOR
    ]
  },
  'payer-management': {
    roles: [
      USER_ROLES.PRACTICE_BILLER,
      USER_ROLES.PRACTICE_ADMINISTRATOR
    ]
  },
  'insurance-verification': {
    roles: [
      USER_ROLES.PRACTICE_BILLER,
      USER_ROLES.BILLER_FOR_ASSIGNED_PATIENTS_ONLY,
      USER_ROLES.PRACTICE_SCHEDULER,
      USER_ROLES.CLINICAL_ADMINISTRATOR,
      USER_ROLES.PRACTICE_ADMINISTRATOR
    ]
  },
  'claims-submission': {
    roles: [
      USER_ROLES.PRACTICE_BILLER,
      USER_ROLES.BILLER_FOR_ASSIGNED_PATIENTS_ONLY,
      USER_ROLES.CLINICAL_ADMINISTRATOR,
      USER_ROLES.PRACTICE_ADMINISTRATOR
    ]
  },
  'payment-processing': {
    roles: [
      USER_ROLES.PRACTICE_BILLER,
      USER_ROLES.BILLER_FOR_ASSIGNED_PATIENTS_ONLY,
      USER_ROLES.CLINICAL_ADMINISTRATOR,
      USER_ROLES.PRACTICE_ADMINISTRATOR
    ]
  },
  'statement-generation': {
    roles: [
      USER_ROLES.PRACTICE_BILLER,
      USER_ROLES.BILLER_FOR_ASSIGNED_PATIENTS_ONLY,
      USER_ROLES.CLINICAL_ADMINISTRATOR,
      USER_ROLES.PRACTICE_ADMINISTRATOR
    ]
  },

  // Staff - accessible to administrators and supervisors
  'staff': {
    roles: [
      USER_ROLES.PRACTICE_ADMINISTRATOR,
      USER_ROLES.CLINICAL_ADMINISTRATOR,
      USER_ROLES.SUPERVISOR
    ]
  },
  'staff-list': {
    roles: [
      USER_ROLES.PRACTICE_ADMINISTRATOR,
      USER_ROLES.CLINICAL_ADMINISTRATOR,
      USER_ROLES.SUPERVISOR
    ]
  },
  'staff-supervision': {
    roles: [
      USER_ROLES.SUPERVISOR,
      USER_ROLES.CLINICAL_ADMINISTRATOR,
      USER_ROLES.PRACTICE_ADMINISTRATOR
    ]
  },
  'staff-roles': {
    roles: [
      USER_ROLES.PRACTICE_ADMINISTRATOR
    ]
  },
  'staff-permissions': {
    roles: [
      USER_ROLES.PRACTICE_ADMINISTRATOR
    ]
  },

  // Audit - accessible only to practice administrators and clinical administrators
  'audit': {
    roles: [
      USER_ROLES.PRACTICE_ADMINISTRATOR,
      USER_ROLES.CLINICAL_ADMINISTRATOR
    ]
  },
  'audit-logs': {
    roles: [
      USER_ROLES.PRACTICE_ADMINISTRATOR,
      USER_ROLES.CLINICAL_ADMINISTRATOR
    ]
  },
  'audit-stats': {
    roles: [
      USER_ROLES.PRACTICE_ADMINISTRATOR,
      USER_ROLES.CLINICAL_ADMINISTRATOR
    ]
  },

  // Compliance - accessible to administrators and clinical staff
  'compliance': {
    roles: [
      USER_ROLES.PRACTICE_ADMINISTRATOR,
      USER_ROLES.CLINICAL_ADMINISTRATOR,
      USER_ROLES.SUPERVISOR,
      USER_ROLES.CLINICIAN,
      USER_ROLES.INTERN,
      USER_ROLES.ASSISTANT,
      USER_ROLES.ASSOCIATE
    ]
  },
  'compensation': {
    roles: [
      USER_ROLES.PRACTICE_ADMINISTRATOR,
      USER_ROLES.CLINICAL_ADMINISTRATOR
    ]
  },
  'sessions': {
    roles: [
      USER_ROLES.CLINICIAN,
      USER_ROLES.INTERN,
      USER_ROLES.ASSISTANT,
      USER_ROLES.ASSOCIATE,
      USER_ROLES.SUPERVISOR,
      USER_ROLES.CLINICAL_ADMINISTRATOR,
      USER_ROLES.PRACTICE_ADMINISTRATOR
    ]
  },
  'time-tracking': {
    roles: [
      USER_ROLES.CLINICIAN,
      USER_ROLES.INTERN,
      USER_ROLES.ASSISTANT,
      USER_ROLES.ASSOCIATE,
      USER_ROLES.SUPERVISOR,
      USER_ROLES.CLINICAL_ADMINISTRATOR,
      USER_ROLES.PRACTICE_ADMINISTRATOR
    ]
  },
  'payments': {
    roles: [
      USER_ROLES.PRACTICE_BILLER,
      USER_ROLES.BILLER_FOR_ASSIGNED_PATIENTS_ONLY,
      USER_ROLES.CLINICAL_ADMINISTRATOR,
      USER_ROLES.PRACTICE_ADMINISTRATOR
    ]
  },
  'deadlines': {
    roles: [
      USER_ROLES.CLINICIAN,
      USER_ROLES.INTERN,
      USER_ROLES.ASSISTANT,
      USER_ROLES.ASSOCIATE,
      USER_ROLES.SUPERVISOR,
      USER_ROLES.CLINICAL_ADMINISTRATOR,
      USER_ROLES.PRACTICE_ADMINISTRATOR
    ]
  },

  // Practice Settings - accessible only to practice administrators
  'practice-settings': {
    roles: [
      USER_ROLES.PRACTICE_ADMINISTRATOR
    ]
  }
};

/**
 * Check if a user with the given role can access a specific menu item
 */
export function canAccessMenuItem(menuItemId: string, userRole: UserRole | null): boolean {
  if (!userRole) return false;
  
  const permission = MENU_PERMISSIONS[menuItemId];
  if (!permission) return false;
  
  // If allowAll is true, any authenticated user can access
  if (permission.allowAll) return true;
  
  // Check if the user's role is in the allowed roles list
  return permission.roles.includes(userRole);
}

/**
 * Filter menu items based on user role
 */
export function filterMenuItemsByRole<T extends { id: string; subItems?: { id: string }[] }>(
  menuItems: T[],
  userRole: UserRole | null
): T[] {
  return menuItems
    .map(item => {
      // Check if the main item is accessible
      const canAccessMain = canAccessMenuItem(item.id, userRole);
      
      if (!canAccessMain) {
        return null;
      }
      
      // Filter sub-items if they exist
      if (item.subItems) {
        const accessibleSubItems = item.subItems.filter(subItem => 
          canAccessMenuItem(subItem.id, userRole)
        );
        
        // If no sub-items are accessible, don't show the main item
        if (accessibleSubItems.length === 0) {
          return null;
        }
        
        return {
          ...item,
          subItems: accessibleSubItems
        };
      }
      
      return item;
    })
    .filter((item): item is T => item !== null);
}
