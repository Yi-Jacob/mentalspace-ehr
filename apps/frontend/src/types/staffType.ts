import { UserStatus, UserRole, ClinicianType, Department, JobTitle, LicenseState, SupervisionStatus } from './enums/staffEnum';

export type { UserStatus, UserRole, ClinicianType, Department, JobTitle, LicenseState, SupervisionStatus };

export interface StaffProfile {
  id: string;
  userId: string;
  employeeId?: string;
  npiNumber?: string;
  licenseNumber?: string;
  licenseState?: LicenseState;
  licenseExpiryDate?: string;
  department?: Department;
  jobTitle?: JobTitle;
  hireDate?: string;
  terminationDate?: string;
  phoneNumber?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  billingRate?: number;
  canBillInsurance: boolean;
  status: UserStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserRoleAssignment {
  id: string;
  userId: string;
  role: UserRole;
  assignedBy?: string;
  assignedAt: string;
  isActive: boolean;
}

export interface PatientAccessPermission {
  id: string;
  clientId: string;
  userId: string;
  grantedBy: string;
  grantedAt: string;
  revokedAt?: string;
  revokedBy?: string;
  accessType: 'full' | 'read_only' | 'billing_only';
  notes?: string;
  isActive: boolean;
}

export interface SupervisionRelationship {
  id: string;
  supervisorId: string;
  superviseeId: string;
  startDate: string;
  endDate?: string;
  notes?: string;
  status: SupervisionStatus;
  terminationNotes?: string;
  createdAt: string;
  updatedAt: string;
  // Joined data
  supervisor?: StaffMember;
  supervisee?: StaffMember;
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface StaffMember {
  employeeId: string;
  jobTitle: string;
  npiNumber: string;
  department: string;
  phoneNumber: string;
  licenseNumber: string;
  licenseState: string;
  licenseExpiryDate: string;
  hireDate: string;
  billingRate: any;
  canBillInsurance: boolean;
  status: string;
  notes: string;
  id: string;
  authUserId?: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  suffix?: string;
  email: string;
  userName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  staffProfile?: StaffProfile;
  roles?: UserRole[];
  
  // Additional fields from staffProfile that are now directly on the user
  userComments?: string;
  mobilePhone?: string;
  workPhone?: string;
  homePhone?: string;
  canReceiveText?: boolean;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  formalName?: string;
  clinicianType?: string;
}
