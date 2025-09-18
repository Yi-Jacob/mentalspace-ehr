import { apiClient } from './api-helper/client';

export interface ClinicianAssignment {
  id: string;
  clientId: string;
  clinicianId: string;
  assignedAt: string;
  assignedBy?: string;
  clinician: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
    jobTitle?: string;
    department?: string;
  };
}

export const clinicianAssignmentService = {
  // Assign a clinician to a client
  async assignClinician(clientId: string, clinicianId: string): Promise<ClinicianAssignment> {
    const response = await apiClient.post(`/clients/${clientId}/clinicians/${clinicianId}`);
    return response.data;
  },

  // Remove a clinician from a client
  async removeClinician(clientId: string, clinicianId: string): Promise<void> {
    await apiClient.delete(`/clients/${clientId}/clinicians/${clinicianId}`);
  },

  // Get all clinicians assigned to a client
  async getClientClinicians(clientId: string): Promise<ClinicianAssignment[]> {
    const response = await apiClient.get(`/clients/${clientId}/clinicians`);
    return response.data;
  },
};
