
export type UserRole = 
  | 'Practice Administrator'
  | 'Clinician'
  | 'Intern / Assistant / Associate'
  | 'Supervisor'
  | 'Clinical Administrator'
  | 'Practice Scheduler'
  | 'Biller for Assigned Patients Only'
  | 'Practice Biller';

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export interface StaffProfile {
  id: string;
  user_id: string;
  employee_id?: string;
  npi_number?: string;
  license_number?: string;
  license_state?: string;
  license_expiry_date?: string;
  department?: string;
  job_title?: string;
  hire_date?: string;
  termination_date?: string;
  phone_number?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  supervisor_id?: string;
  billing_rate?: number;
  can_bill_insurance: boolean;
  status: UserStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface UserRoleAssignment {
  id: string;
  user_id: string;
  role: UserRole;
  assigned_by?: string;
  assigned_at: string;
  is_active: boolean;
}

export interface PatientAccessPermission {
  id: string;
  client_id: string;
  user_id: string;
  granted_by: string;
  granted_at: string;
  revoked_at?: string;
  revoked_by?: string;
  access_type: 'full' | 'read_only' | 'billing_only';
  notes?: string;
  is_active: boolean;
}

export interface SupervisionRelationship {
  id: string;
  supervisor_id: string;
  supervisee_id: string;
  start_date: string;
  end_date?: string;
  supervision_type: 'clinical' | 'administrative';
  is_active: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface StaffMember {
  id: string;
  auth_user_id?: string;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  staff_profile?: StaffProfile;
  roles: UserRoleAssignment[];
}
