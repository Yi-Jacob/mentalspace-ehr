import { apiClient } from './api-helper/client';

export type UserType = {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  suffix?: string;
  email: string;
  userName?: string;
  clientId?: string;
  staffId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  suffix?: string;
  email: string;
  userName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userType: 'staff' | 'client' | 'unknown';
  roles: string[];
  
  // Staff profile fields
  employeeId?: string;
  npiNumber?: string;
  licenseNumber?: string;
  licenseState?: string;
  licenseExpiryDate?: string;
  department?: string;
  jobTitle?: string;
  hireDate?: string;
  phoneNumber?: string;
  billingRate?: number;
  canBillInsurance?: boolean;
  status?: string;
  notes?: string;
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
  supervisionType?: string;
  assignedClients?: Array<{
    id: string;
    firstName: string;
    lastName: string;
    preferredName?: string;
    email?: string;
  }>;
  
  // Client fields
  clientId?: string;
  dateOfBirth?: string;
  preferredName?: string;
  pronouns?: string;
  administrativeSex?: string;
  genderIdentity?: string;
  sexualOrientation?: string;
  timezone?: string;
  race?: string;
  ethnicity?: string;
  languages?: string;
  maritalStatus?: string;
  employmentStatus?: string;
  religiousAffiliation?: string;
  smokingStatus?: string;
  appointmentReminders?: string;
  hipaaSigned?: boolean;
  pcpRelease?: string;
  patientComments?: string;
  assignedClinicianIds?: string[];
  assignedClinicians?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    jobTitle?: string;
    department?: string;
  }[];
  
  // Supervision relationships
  supervisors: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    jobTitle?: string;
    department?: string;
    startDate: string;
    endDate?: string;
    status: string;
  }>;
  
  supervisees: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    jobTitle?: string;
    department?: string;
    startDate: string;
    endDate?: string;
    status: string;
  }>;
  
  licenses: Array<{
    id: string;
    staffId: string;
    licenseType: string;
    licenseNumber: string;
    licenseExpirationDate: string;
    licenseStatus: string;
    licenseState: string;
    issuedBy: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  suffix?: string;
  email?: string;
  userName?: string;
  // Staff fields
  phoneNumber?: string;
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
  supervisionType?: string;
  userComments?: string;
  notes?: string;
  // Client fields
  preferredName?: string;
  pronouns?: string;
  administrativeSex?: string;
  genderIdentity?: string;
  sexualOrientation?: string;
  timezone?: string;
  race?: string;
  ethnicity?: string;
  languages?: string;
  maritalStatus?: string;
  employmentStatus?: string;
  religiousAffiliation?: string;
  smokingStatus?: string;
  appointmentReminders?: string;
  patientComments?: string;
}

class UsersService {
  async getAllUsers(): Promise<UserType[]> {
    try {
      const response = await apiClient.get<UserType[]>('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching staff:', error);
      throw error;
    }
  }

  async getMyProfile(): Promise<UserProfile> {
    try {
      const response = await apiClient.get<UserProfile>('/users/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  async updateMyProfile(data: UpdateProfileData): Promise<UserProfile> {
    try {
      const response = await apiClient.put<UserProfile>('/users/profile', data);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  async updatePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<{ message: string; userId: string; email: string }> {
    try {
      const response = await apiClient.put<{ message: string; userId: string; email: string }>('/users/password', passwordData);
      return response.data;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }
}

export const usersService = new UsersService(); 