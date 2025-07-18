
import { UserRole, UserStatus } from './staff';

export type SupervisionRequirementType = 
  | 'Not Supervised'
  | 'Access patient notes and co-sign notes for selected payers'
  | 'Must review and approve all notes'
  | 'Must review and co-sign all notes';

export interface CreateStaffMemberData {
  first_name: string;
  last_name: string;
  email: string;
  roles: UserRole[];
  employee_id?: string;
  job_title?: string;
  department?: string;
  phone_number?: string;
  npi_number?: string;
  license_number?: string;
  license_state?: string;
  license_expiry_date?: string;
  hire_date?: string;
  billing_rate?: number;
  can_bill_insurance?: boolean;
  status?: UserStatus;
  notes?: string;
  supervision_type?: SupervisionRequirementType;
  supervisor_id?: string;
}
