
import { apiClient } from './api-helper/client';
import { 
  ClientFormData, 
  PhoneNumber, 
  EmergencyContact, 
  InsuranceInfo, 
  PrimaryCareProvider,
  PhoneNumberDto,
  EmergencyContactDto,
  InsuranceInfoDto,
  PrimaryCareProviderDto
} from '@/types/client';

// Client Service
export class ClientService {
  private baseUrl = '/clients';

  // Conversion functions
  private convertPhoneDtoToForm(dto: PhoneNumberDto): PhoneNumber {
    return {
      type: dto.phoneType,
      number: dto.phoneNumber,
      messagePreference: dto.messagePreference,
    };
  }

  private convertEmergencyContactDtoToForm(dto: EmergencyContactDto): EmergencyContact {
    return {
      name: dto.name,
      relationship: dto.relationship,
      phoneNumber: dto.phoneNumber,
      email: dto.email || '',
      isPrimary: dto.isPrimary,
    };
  }

  private convertInsuranceDtoToForm(dto: InsuranceInfoDto): InsuranceInfo {
    return {
      insuranceType: dto.insuranceType,
      insuranceCompany: dto.insuranceCompany,
      policyNumber: dto.policyNumber,
      groupNumber: dto.groupNumber || '',
      subscriberName: dto.subscriberName,
      subscriberRelationship: dto.subscriberRelationship,
      subscriberDob: dto.subscriberDob || '',
      effectiveDate: dto.effectiveDate || '',
      terminationDate: dto.terminationDate || '',
      copayAmount: dto.copayAmount,
      deductibleAmount: dto.deductibleAmount,
    };
  }

  private convertPcpDtoToForm(dto: PrimaryCareProviderDto): PrimaryCareProvider {
    return {
      providerName: dto.providerName,
      practiceName: dto.practiceName,
      phoneNumber: dto.phoneNumber,
      address: dto.address,
    };
  }

  // Get all clients
  async getClients(params?: { page?: number; limit?: number; search?: string }): Promise<ClientFormData[]> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);

    const url = `${this.baseUrl}?${queryParams.toString()}`;
    return apiClient.get<ClientFormData[]>(url);
  }

  // Get single client by ID
  async getClient(id: string): Promise<ClientFormData> {
    return apiClient.get<ClientFormData>(`${this.baseUrl}/${id}`);
  }

  // Create new client
  async createClient(data: ClientFormData): Promise<ClientFormData> {
    return apiClient.post<ClientFormData>(this.baseUrl, data);
  }

  // Update existing client
  async updateClient(id: string, data: Partial<ClientFormData>): Promise<ClientFormData> {
    return apiClient.put<ClientFormData>(`${this.baseUrl}/${id}`, data);
  }

  // Delete client
  async deleteClient(id: string): Promise<void> {
    return apiClient.delete(`${this.baseUrl}/${id}`);
  }

  // Phone numbers
  async getClientPhoneNumbers(clientId: string): Promise<PhoneNumber[]> {
    const dtos = await apiClient.get<PhoneNumberDto[]>(`${this.baseUrl}/${clientId}/phone-numbers`);
    return dtos.map(dto => this.convertPhoneDtoToForm(dto));
  }

  async updateClientPhoneNumbers(clientId: string, phoneNumbers: PhoneNumber[]): Promise<PhoneNumber[]> {
    const dtos = await apiClient.put<PhoneNumberDto[]>(`${this.baseUrl}/${clientId}/phone-numbers`, phoneNumbers);
    return dtos.map(dto => this.convertPhoneDtoToForm(dto));
  }

  // Emergency contacts
  async getClientEmergencyContacts(clientId: string): Promise<EmergencyContact[]> {
    const dtos = await apiClient.get<EmergencyContactDto[]>(`${this.baseUrl}/${clientId}/emergency-contacts`);
    return dtos.map(dto => this.convertEmergencyContactDtoToForm(dto));
  }

  async updateClientEmergencyContacts(clientId: string, contacts: EmergencyContact[]): Promise<EmergencyContact[]> {
    const dtos = await apiClient.put<EmergencyContactDto[]>(`${this.baseUrl}/${clientId}/emergency-contacts`, contacts);
    return dtos.map(dto => this.convertEmergencyContactDtoToForm(dto));
  }

  // Insurance
  async getClientInsurance(clientId: string): Promise<InsuranceInfo[]> {
    const dtos = await apiClient.get<InsuranceInfoDto[]>(`${this.baseUrl}/${clientId}/insurance`);
    return dtos.map(dto => this.convertInsuranceDtoToForm(dto));
  }

  async updateClientInsurance(clientId: string, insurance: InsuranceInfo[]): Promise<InsuranceInfo[]> {
    const dtos = await apiClient.put<InsuranceInfoDto[]>(`${this.baseUrl}/${clientId}/insurance`, insurance);
    return dtos.map(dto => this.convertInsuranceDtoToForm(dto));
  }

  // Primary care provider
  async getClientPrimaryCareProvider(clientId: string): Promise<PrimaryCareProvider | null> {
    const dto = await apiClient.get<PrimaryCareProviderDto | null>(`${this.baseUrl}/${clientId}/primary-care-provider`);
    return dto ? this.convertPcpDtoToForm(dto) : null;
  }

  async updateClientPrimaryCareProvider(clientId: string, pcp: PrimaryCareProvider): Promise<PrimaryCareProvider | null> {
    const dto = await apiClient.put<PrimaryCareProviderDto | null>(`${this.baseUrl}/${clientId}/primary-care-provider`, pcp);
    return dto ? this.convertPcpDtoToForm(dto) : null;
  }

  // Create client with form data
  async createClientWithFormData(
    formData: ClientFormData,
    phoneNumbers: PhoneNumber[],
    emergencyContacts: EmergencyContact[],
    insuranceInfo: InsuranceInfo[],
    primaryCareProvider: PrimaryCareProvider
  ): Promise<ClientFormData> {
    const data = {
      clientData: formData,
      phoneNumbers,
      emergencyContacts,
      insuranceInfo,
      primaryCareProvider,
    };

    return apiClient.post<ClientFormData>(`${this.baseUrl}/with-form-data`, data);
  }

  // Update client with form data
  async updateClientWithFormData(
    clientId: string,
    formData: Partial<ClientFormData>,
    phoneNumbers: PhoneNumber[],
    emergencyContacts: EmergencyContact[],
    insuranceInfo: InsuranceInfo[],
    primaryCareProvider: PrimaryCareProvider
  ): Promise<ClientFormData> {
    const data = {
      clientData: formData,
      phoneNumbers,
      emergencyContacts,
      insuranceInfo,
      primaryCareProvider,
    };

    return apiClient.put<ClientFormData>(`${this.baseUrl}/${clientId}/with-form-data`, data);
  }
}

export const clientService = new ClientService();
