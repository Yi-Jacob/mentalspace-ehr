import { apiClient } from './api-helper/client';

export interface License {
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
  staff?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateLicenseData {
  staffId: string;
  licenseType: string;
  licenseNumber: string;
  licenseExpirationDate: string;
  licenseStatus: string;
  licenseState: string;
  issuedBy: string;
}

export interface UpdateLicenseData {
  licenseType?: string;
  licenseNumber?: string;
  licenseExpirationDate?: string;
  licenseStatus?: string;
  licenseState?: string;
  issuedBy?: string;
}

class LicenseService {
  private baseUrl = '/licenses';

  async getAllLicenses(): Promise<License[]> {
    const response = await apiClient.get<License[]>(this.baseUrl);
    return response.data;
  }

  async getLicenseById(id: string): Promise<License> {
    const response = await apiClient.get<License>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async getLicensesByStaffId(staffId: string): Promise<License[]> {
    const response = await apiClient.get<License[]>(`${this.baseUrl}/staff/${staffId}`);
    return response.data;
  }

  async createLicense(data: CreateLicenseData): Promise<License> {
    const response = await apiClient.post<License>(this.baseUrl, data);
    return response.data;
  }

  async updateLicense(id: string, data: UpdateLicenseData): Promise<License> {
    const response = await apiClient.patch<License>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async deleteLicense(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }
}

export const licenseService = new LicenseService();
export default licenseService; 