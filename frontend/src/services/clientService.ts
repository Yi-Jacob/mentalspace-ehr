
import { apiClient } from './api-helper/client';

// Types
export interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  date_of_birth?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateClientRequest {
  first_name: string;
  last_name: string;
  email?: string;
  date_of_birth?: string;
}

export interface UpdateClientRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  date_of_birth?: string;
}

// Form-specific types that match the form structure
export interface FormPhoneNumber {
  type: 'Mobile' | 'Home' | 'Work' | 'Other';
  number: string;
  message_preference: 'No messages' | 'Voice messages OK' | 'Text messages OK' | 'Voice/Text messages OK';
}

export interface FormEmergencyContact {
  name: string;
  relationship: string;
  phone_number: string;
  email: string;
  is_primary: boolean;
}

export interface FormInsuranceInfo {
  insurance_type: 'Primary' | 'Secondary';
  insurance_company: string;
  policy_number: string;
  group_number: string;
  subscriber_name: string;
  subscriber_relationship: string;
  subscriber_dob: string;
  effective_date: string;
  termination_date: string;
  copay_amount: number;
  deductible_amount: number;
}

export interface FormPrimaryCareProvider {
  provider_name: string;
  practice_name: string;
  phone_number: string;
  address: string;
}

// API types for backend communication
export interface PhoneNumber {
  id?: string;
  phone_number: string;
  phone_type: 'Mobile' | 'Home' | 'Work' | 'Other';
  message_preference: 'No messages' | 'Voice messages OK' | 'Text messages OK' | 'Voice/Text messages OK';
}

export interface EmergencyContact {
  id?: string;
  first_name: string;
  last_name: string;
  relationship: string;
  phone_number: string;
  email?: string;
}

export interface InsuranceInfo {
  id?: string;
  provider_name: string;
  policy_number: string;
  group_number?: string;
  subscriber_name: string;
  relationship_to_subscriber: string;
  effective_date?: string;
  expiration_date?: string;
}

// Client Service
export class ClientService {
  private baseUrl = '/clients';

  // Get all clients
  async getClients(params?: { page?: number; limit?: number; search?: string }): Promise<Client[]> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);

    const url = `${this.baseUrl}?${queryParams.toString()}`;
    return apiClient.get<Client[]>(url);
  }

  // Get single client by ID
  async getClient(id: string): Promise<Client> {
    return apiClient.get<Client>(`${this.baseUrl}/${id}`);
  }

  // Create new client
  async createClient(data: CreateClientRequest): Promise<Client> {
    return apiClient.post<Client>(this.baseUrl, data);
  }

  // Update existing client
  async updateClient(id: string, data: UpdateClientRequest): Promise<Client> {
    return apiClient.put<Client>(`${this.baseUrl}/${id}`, data);
  }

  // Delete client
  async deleteClient(id: string): Promise<void> {
    return apiClient.delete(`${this.baseUrl}/${id}`);
  }

  // Phone numbers
  async getClientPhoneNumbers(clientId: string): Promise<PhoneNumber[]> {
    return apiClient.get<PhoneNumber[]>(`${this.baseUrl}/${clientId}/phone-numbers`);
  }

  async updateClientPhoneNumbers(clientId: string, phoneNumbers: PhoneNumber[]): Promise<PhoneNumber[]> {
    return apiClient.put<PhoneNumber[]>(`${this.baseUrl}/${clientId}/phone-numbers`, { phoneNumbers });
  }

  // Emergency contacts
  async getClientEmergencyContacts(clientId: string): Promise<EmergencyContact[]> {
    return apiClient.get<EmergencyContact[]>(`${this.baseUrl}/${clientId}/emergency-contacts`);
  }

  async updateClientEmergencyContacts(clientId: string, contacts: EmergencyContact[]): Promise<EmergencyContact[]> {
    return apiClient.put<EmergencyContact[]>(`${this.baseUrl}/${clientId}/emergency-contacts`, { contacts });
  }

  // Insurance
  async getClientInsurance(clientId: string): Promise<InsuranceInfo[]> {
    return apiClient.get<InsuranceInfo[]>(`${this.baseUrl}/${clientId}/insurance`);
  }

  async updateClientInsurance(clientId: string, insurance: InsuranceInfo[]): Promise<InsuranceInfo[]> {
    return apiClient.put<InsuranceInfo[]>(`${this.baseUrl}/${clientId}/insurance`, { insurance });
  }

  // Form-specific methods that handle the form data structure
  async createClientWithFormData(
    formData: any,
    phoneNumbers: FormPhoneNumber[],
    emergencyContacts: FormEmergencyContact[],
    insuranceInfo: FormInsuranceInfo[],
    primaryCareProvider: FormPrimaryCareProvider
  ): Promise<Client> {
    // First create the client
    const client = await this.createClient(formData);
    
    // Then handle related data (this would need backend support for batch operations)
    // For now, we'll just create the client and return
    return client;
  }

  async updateClientWithFormData(
    clientId: string,
    formData: any,
    phoneNumbers: FormPhoneNumber[],
    emergencyContacts: FormEmergencyContact[],
    insuranceInfo: FormInsuranceInfo[],
    primaryCareProvider: FormPrimaryCareProvider
  ): Promise<Client> {
    // Update the client
    const client = await this.updateClient(clientId, formData);
    
    // Convert form data to API format and update related data
    const apiPhoneNumbers = phoneNumbers.map(phone => ({
      phone_number: phone.number,
      phone_type: phone.type,
      message_preference: phone.message_preference
    }));

    const apiEmergencyContacts = emergencyContacts.map(contact => ({
      first_name: contact.name.split(' ')[0] || '',
      last_name: contact.name.split(' ').slice(1).join(' ') || '',
      relationship: contact.relationship,
      phone_number: contact.phone_number,
      email: contact.email
    }));

    const apiInsuranceInfo = insuranceInfo.map(insurance => ({
      provider_name: insurance.insurance_company,
      policy_number: insurance.policy_number,
      group_number: insurance.group_number,
      subscriber_name: insurance.subscriber_name,
      relationship_to_subscriber: insurance.subscriber_relationship,
      effective_date: insurance.effective_date,
      expiration_date: insurance.termination_date
    }));

    // Update related data
    await this.updateClientPhoneNumbers(clientId, apiPhoneNumbers);
    await this.updateClientEmergencyContacts(clientId, apiEmergencyContacts);
    await this.updateClientInsurance(clientId, apiInsuranceInfo);
    
    return client;
  }
}

export const clientService = new ClientService();
