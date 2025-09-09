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
} from '@/types/clientType';

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
      id: dto.id,
      payerId: dto.payerId,
      insuranceType: dto.insuranceType,
      insuranceCompany: dto.payer?.name || dto.insuranceCompany,
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
    const response = await apiClient.get<ClientFormData[]>(url);
    return response.data;
  }

  // Get clients for notes and messages
  async getClientsForNotes(): Promise<{ id: string; first_name: string; last_name: string; email: string }[]> {
    const response = await apiClient.get<{ id: string; firstName: string; lastName: string; email?: string }[]>(`${this.baseUrl}/for-notes`);
    const clients = response.data;
    return clients.map(client => ({
      id: client.id,
      first_name: client.firstName,
      last_name: client.lastName,
      email: client.email || '',
    }));
  }

  // Get single client by ID
  async getClient(id: string): Promise<ClientFormData> {
    const response = await apiClient.get<ClientFormData>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // Create new client
  async createClient(data: ClientFormData): Promise<ClientFormData> {
    const response = await apiClient.post<ClientFormData>(this.baseUrl, data);
    return response.data;
  }

  // Update existing client
  async updateClient(id: string, data: Partial<ClientFormData>): Promise<ClientFormData> {
    const response = await apiClient.put<ClientFormData>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  // Delete client
  async deleteClient(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }

  // Phone numbers
  async getClientPhoneNumbers(clientId: string): Promise<PhoneNumberDto[]> {
    const response = await apiClient.get<PhoneNumberDto[]>(`${this.baseUrl}/${clientId}/phone-numbers`);
    return response.data as PhoneNumberDto[];
  }

  async updateClientPhoneNumbers(clientId: string, phoneNumbers: PhoneNumber[]): Promise<PhoneNumber[]> {
    const response = await apiClient.put<PhoneNumberDto[]>(`${this.baseUrl}/${clientId}/phone-numbers`, phoneNumbers);
    const dtos = response.data;
    return dtos.map(dto => this.convertPhoneDtoToForm(dto));
  }

  // Emergency contacts
  async getClientEmergencyContacts(clientId: string): Promise<EmergencyContact[]> {
    const response = await apiClient.get<EmergencyContactDto[]>(`${this.baseUrl}/${clientId}/emergency-contacts`);
    const dtos = response.data;
    return dtos.map(dto => this.convertEmergencyContactDtoToForm(dto));
  }

  async updateClientEmergencyContacts(clientId: string, contacts: EmergencyContact[]): Promise<EmergencyContact[]> {
    const response = await apiClient.put<EmergencyContactDto[]>(`${this.baseUrl}/${clientId}/emergency-contacts`, contacts);
    const dtos = response.data;
    return dtos.map(dto => this.convertEmergencyContactDtoToForm(dto));
  }

  // Insurance
  async getClientInsurance(clientId: string): Promise<InsuranceInfo[]> {
    const response = await apiClient.get<InsuranceInfoDto[]>(`${this.baseUrl}/${clientId}/insurance`);
    const dtos = response.data;
    return dtos.map(dto => this.convertInsuranceDtoToForm(dto));
  }

  async updateClientInsurance(clientId: string, insurance: InsuranceInfo[]): Promise<InsuranceInfo[]> {
    const response = await apiClient.put<InsuranceInfoDto[]>(`${this.baseUrl}/${clientId}/insurance`, insurance);
    const dtos = response.data;
    return dtos.map(dto => this.convertInsuranceDtoToForm(dto));
  }

  // Primary care provider
  async getClientPrimaryCareProvider(clientId: string): Promise<PrimaryCareProvider | null> {
    const response = await apiClient.get<PrimaryCareProviderDto | null>(`${this.baseUrl}/${clientId}/primary-care-provider`);
    const dto = response.data;
    return dto ? this.convertPcpDtoToForm(dto) : null;
  }

  async updateClientPrimaryCareProvider(clientId: string, pcp: PrimaryCareProvider): Promise<PrimaryCareProvider | null> {
    const response = await apiClient.put<PrimaryCareProviderDto | null>(`${this.baseUrl}/${clientId}/primary-care-provider`, pcp);
    const dto = response.data;
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

    const response = await apiClient.post<ClientFormData>(`${this.baseUrl}/with-form-data`, data);
    return response.data;
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

    const response = await apiClient.put<ClientFormData>(`${this.baseUrl}/${clientId}/with-form-data`, data);
    return response.data;
  }

  // Get client phone numbers for notes
  async getClientPhoneNumbersForNotes(clientId: string) {
    const response = await apiClient.get(`${this.baseUrl}/${clientId}/phone-numbers-for-notes`);
    return response.data;
  }

  // Get client insurance for notes
  async getClientInsuranceForNotes(clientId: string) {
    const response = await apiClient.get(`${this.baseUrl}/${clientId}/insurance-for-notes`);
    return response.data;
  }
}

export const clientService = new ClientService();
