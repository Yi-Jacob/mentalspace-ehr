import { apiClient } from './api-helper/client';
import { UserStatus, StaffMember, UserRole, SupervisionRelationship } from '@/types/staffType';

export interface CreateStaffInput {
  // Basic user information
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  suffix?: string;
  avatarUrl?: string;

  // Contact information
  userName?: string;
  mobilePhone?: string;
  workPhone?: string;
  homePhone?: string;
  canReceiveText?: boolean;

  // Address information
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zipCode?: string;

  // Staff profile information
  employeeId?: string;
  jobTitle?: string;
  formalName?: string;
  npiNumber?: string;
  department?: string;
  phoneNumber?: string;
  licenseNumber?: string;
  licenseState?: string;
  licenseExpiryDate?: string;
  hireDate?: string;
  billingRate?: number;
  canBillInsurance?: boolean;
  status?: UserStatus;
  notes?: string;

  // Additional fields
  clinicianType?: string;
  supervisionType?: string;
  supervisorId?: string;

  // Roles
  roles?: UserRole[];

  // User comments
  userComments?: string;

  // Licenses
  licenses?: Array<{
    licenseType: string;
    licenseNumber: string;
    licenseExpirationDate: string;
    licenseStatus: string;
    licenseState: string;
    issuedBy: string;
  }>;
}

export interface UpdateStaffInput extends Partial<CreateStaffInput> {
  // Additional update-specific fields can be added here
}

// Supervision Relationship interfaces
export interface CreateSupervisionRelationshipData {
  supervisorId: string;
  superviseeId: string;
  startDate: string;
  endDate?: string;
  notes?: string;
  status?: string;
}

export interface UpdateSupervisionRelationshipData {
  status?: string;
  endDate?: string;
  notes?: string;
  terminationNotes?: string;
}

export interface UserRoleAssignment {
  role: UserRole;
  assignedAt: string;
  assignedBy?: string;
}

export interface PerformanceMetric {
  id: string;
  userId: string;
  metricType: string;
  metricValue: number;
  targetValue?: number;
  measurementPeriod: string;
  periodStart: string;
  periodEnd: string;
  notes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
  };
  reviewer?: {
    firstName: string;
    lastName: string;
  };
}

class StaffService {
  async createStaff(input: CreateStaffInput): Promise<any> {
    try {
      const response = await apiClient.post<any>('/staff', input);
      alert(response.data.passwordResetUrl);
      return response.data;
    } catch (error) {
      console.error('Error creating staff:', error);
      throw error;
    }
  }

  async getAllStaff(): Promise<StaffMember[]> {
    try {
      const response = await apiClient.get<StaffMember[]>('/staff');
      return response.data;
    } catch (error) {
      console.error('Error fetching staff:', error);
      throw error;
    }
  }

  async getStaff(id: string): Promise<StaffMember> {
    try {
      const response = await apiClient.get<StaffMember>(`/staff/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching staff member:', error);
      throw error;
    }
  }

  async updateStaff(id: string, input: UpdateStaffInput): Promise<StaffMember> {
    try {
      const response = await apiClient.put<StaffMember>(`/staff/${id}`, input);
      return response.data;
    } catch (error) {
      console.error('Error updating staff member:', error);
      throw error;
    }
  }

  async deleteStaff(id: string): Promise<void> {
    try {
      await apiClient.delete(`/staff/${id}`);
    } catch (error) {
      console.error('Error deleting staff member:', error);
      throw error;
    }
  }

  async deactivateStaff(id: string): Promise<StaffMember> {
    try {
      const response = await apiClient.patch<StaffMember>(`/staff/${id}/deactivate`);
      return response.data;
    } catch (error) {
      console.error('Error deactivating staff member:', error);
      throw error;
    }
  }
  
  // User Roles
  async getAvailableRoles(): Promise<UserRole[]> {
    const response = await apiClient.get<UserRole[]>('/staff/roles/available');
    return response.data;
  }

  async assignRole(userId: string, role: string): Promise<any> {
    const response = await apiClient.post('/staff/roles/assign', {
      userId,
      role,
    });
    return response.data;
  }

  async removeRole(userId: string, role: string): Promise<any> {
    const response = await apiClient.post('/staff/roles/remove', {
      userId,
      role,
    });
    return response.data;
  }

  // Performance Metrics
  async getPerformanceMetrics(userId?: string): Promise<PerformanceMetric[]> {
    const params = userId ? { userId } : {};
    const response = await apiClient.get<PerformanceMetric[]>('/staff/performance-metrics', { params });
    return response.data;
  }

  async createPerformanceMetric(metric: Omit<PerformanceMetric, 'id' | 'createdAt'>): Promise<PerformanceMetric> {
    const response = await apiClient.post<PerformanceMetric>('/staff/performance-metrics', metric);
    return response.data;
  }

  async updatePerformanceMetric(id: string, updates: Partial<PerformanceMetric>): Promise<PerformanceMetric> {
    const response = await apiClient.put<PerformanceMetric>(`/staff/performance-metrics/${id}`, updates);
    return response.data;
  }

  // Supervision Relationships
  async getAllSupervisionRelationships(): Promise<SupervisionRelationship[]> {
    const response = await apiClient.get<SupervisionRelationship[]>('/supervision-relationships');
    return response.data;
  }

  async getSupervisionRelationship(id: string): Promise<SupervisionRelationship> {
    const response = await apiClient.get<SupervisionRelationship>(`/supervision-relationships/${id}`);
    return response.data;
  }

  async createSupervisionRelationship(data: CreateSupervisionRelationshipData): Promise<SupervisionRelationship> {
    const response = await apiClient.post<SupervisionRelationship>('/supervision-relationships', data);
    return response.data;
  }

  async updateSupervisionRelationship(id: string, data: UpdateSupervisionRelationshipData): Promise<SupervisionRelationship> {
    const response = await apiClient.patch<SupervisionRelationship>(`/supervision-relationships/${id}`, data);
    return response.data;
  }

  async getSupervisorCandidates(): Promise<StaffMember[]> {
    const response = await apiClient.get<StaffMember[]>('/supervision-relationships/supervisor-candidates');
    return response.data;
  }

  async getSuperviseeCandidates(): Promise<StaffMember[]> {
    const response = await apiClient.get<StaffMember[]>('/supervision-relationships/supervisee-candidates');
    return response.data;
  }

  // Get all users (staff and clients) for conversation creation
  async getAllUsers(): Promise<Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    userType: 'staff' | 'client';
    jobTitle?: string;
    department?: string;
  }>> {
    const response = await apiClient.get<Array<{
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      userType: 'staff' | 'client';
      staffProfile?: {
        jobTitle: string;
        department: string;
      };
    }>>('/staff/users');
    
    return response.data.map(user => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userType: user.userType,
      jobTitle: user.staffProfile?.jobTitle,
      department: user.staffProfile?.department,
    }));
  }

  // Get all staff profiles for provider selection
  async getAllStaffProfiles(): Promise<Array<{
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    isActive: boolean;
    employeeId?: string;
    jobTitle?: string;
    department?: string;
    npiNumber?: string;
    licenseNumber?: string;
    licenseState?: string;
    status?: string;
  }>> {
    const response = await apiClient.get<Array<{
      id: string;
      userId: string;
      firstName: string;
      lastName: string;
      email: string;
      isActive: boolean;
      employeeId?: string;
      jobTitle?: string;
      department?: string;
      npiNumber?: string;
      licenseNumber?: string;
      licenseState?: string;
      status?: string;
    }>>('/staff/profiles');
    
    return response.data;
  }

  // Get all available staff profiles for clinician assignment
  async getAvailableStaffProfiles(): Promise<Array<{
    id: string;
    staffId: string;
    firstName: string;
    lastName: string;
    email: string;
    isActive: boolean;
    employeeId?: string;
    jobTitle?: string;
    department?: string;
    formalName?: string;
    clinicianType?: string;
    npiNumber?: string;
    licenseNumber?: string;
    licenseState?: string;
    status?: string;
  }>> {
    const response = await apiClient.get<Array<{
      id: string;
      staffId: string;
      firstName: string;
      lastName: string;
      email: string;
      isActive: boolean;
      employeeId?: string;
      jobTitle?: string;
      department?: string;
      formalName?: string;
      clinicianType?: string;
      npiNumber?: string;
      licenseNumber?: string;
      licenseState?: string;
      status?: string;
    }>>('/staff/profiles/available');
    
    return response.data;
  }

  // Get staff profiles for clinician assignment (from clients endpoint)
  async getStaffProfilesForAssignment(): Promise<Array<{
    id: string;
    formalName?: string;
    user?: {
      firstName: string;
      lastName: string;
    };
  }>> {
    const response = await apiClient.get<Array<{
      id: string;
      formalName?: string;
      user?: {
        firstName: string;
        lastName: string;
      };
    }>>('/clients/staff-profiles');
    
    return response.data;
  }
}

export const staffService = new StaffService(); 