import { apiRequest } from './api-helper/apiRequest';

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
    return apiRequest<License[]>({
      url: this.baseUrl,
      method: 'GET',
    });
  }

  async getLicenseById(id: string): Promise<License> {
    return apiRequest<License>({
      url: `${this.baseUrl}/${id}`,
      method: 'GET',
    });
  }

  async getLicensesByStaffId(staffId: string): Promise<License[]> {
    return apiRequest<License[]>({
      url: `${this.baseUrl}/staff/${staffId}`,
      method: 'GET',
    });
  }

  async createLicense(data: CreateLicenseData): Promise<License> {
    return apiRequest<License>({
      url: this.baseUrl,
      method: 'POST',
      data,
    });
  }

  async updateLicense(id: string, data: UpdateLicenseData): Promise<License> {
    return apiRequest<License>({
      url: `${this.baseUrl}/${id}`,
      method: 'PATCH',
      data,
    });
  }

  async deleteLicense(id: string): Promise<void> {
    return apiRequest<void>({
      url: `${this.baseUrl}/${id}`,
      method: 'DELETE',
    });
  }
}

export const licenseService = new LicenseService();
export default licenseService; 