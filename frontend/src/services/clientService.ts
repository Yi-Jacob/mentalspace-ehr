
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
}

export const clientService = new ClientService();
