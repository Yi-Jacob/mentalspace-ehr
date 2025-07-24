import { apiClient } from './api-helper/client';

export interface Payer {
  id: string;
  name: string;
  payerType: string;
  electronicPayerId?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phoneNumber?: string;
  faxNumber?: string;
  contactPerson?: string;
  contactEmail?: string;
  website?: string;
  requiresAuthorization?: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PayerContract {
  id: string;
  payerId: string;
  contractName: string;
  contractNumber?: string;
  effectiveDate: string;
  expirationDate?: string;
  status?: string;
  reimbursementRate?: number;
  contractTerms?: string;
  createdAt: string;
  updatedAt: string;
  payer?: {
    name: string;
  };
}

export interface FeeSchedule {
  id: string;
  payerId: string;
  cptCode: string;
  feeAmount: number;
  effectiveDate: string;
  expirationDate?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  payer?: {
    name: string;
  };
}

export interface CptCode {
  id: string;
  code: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

export interface InsuranceVerification {
  id: string;
  clientId: string;
  insuranceId: string;
  verificationDate: string;
  verifiedBy?: string;
  status?: string;
  benefitsVerified?: boolean;
  copayAmount?: number;
  deductibleAmount?: number;
  deductibleMet?: number;
  outOfPocketMax?: number;
  outOfPocketMet?: number;
  authorizationRequired?: boolean;
  authorizationNumber?: string;
  authorizationExpiry?: string;
  coveredServices: string[];
  excludedServices: string[];
  notes?: string;
  nextVerificationDate?: string;
  createdAt: string;
  updatedAt: string;
  client?: {
    firstName: string;
    lastName: string;
  };
  clientInsurance?: {
    insuranceCompany: string;
    policyNumber: string;
  };
}

export interface Claim {
  id: string;
  claimNumber: string;
  clientId: string;
  providerId: string;
  payerId?: string;
  serviceDate: string;
  submissionDate?: string;
  status?: string;
  totalAmount: number;
  paidAmount?: number;
  patientResponsibility?: number;
  authorizationNumber?: string;
  diagnosisCodes: string[];
  procedureCodes: string[];
  placeOfService?: string;
  claimFrequency?: string;
  batchId?: string;
  clearinghouseId?: string;
  submissionMethod?: string;
  rejectionReason?: string;
  denialReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  client?: {
    firstName: string;
    lastName: string;
  };
  payer?: {
    name: string;
  };
}

export interface Payment {
  id: string;
  paymentNumber: string;
  clientId: string;
  claimId?: string;
  payerId?: string;
  paymentDate: string;
  paymentMethod: string;
  paymentAmount: number;
  status?: string;
  referenceNumber?: string;
  creditCardLastFour?: string;
  paymentProcessor?: string;
  processingFee?: number;
  netAmount?: number;
  notes?: string;
  processedBy?: string;
  createdAt: string;
  updatedAt: string;
  client?: {
    firstName: string;
    lastName: string;
  };
  payer?: {
    name: string;
  };
  claim?: {
    claimNumber: string;
  };
}

export interface BillingDashboard {
  totalClaims: number;
  submittedClaims: number;
  paidClaims: number;
  deniedClaims: number;
  totalRevenue: number;
  totalPayments: number;
  averagePayment: number;
  recentClaims: Claim[];
  recentPayments: Payment[];
  payers: Payer[];
}

export interface BillingReports {
  totalClaims: number;
  submittedClaims: number;
  paidClaims: number;
  deniedClaims: number;
  statusData: Array<{ status: string; count: number }>;
  agingChartData: Array<{ range: string; count: number }>;
  recentClaims: Claim[];
}

export interface RevenueReports {
  totalRevenue: number;
  totalPayments: number;
  averagePayment: number;
  trendData: Array<{ date: string; revenue: number; count: number }>;
  payerData: Array<{ name: string; revenue: number; count: number }>;
}

class BillingService {
  // Dashboard
  async getBillingDashboard(timeRange: string = '30'): Promise<BillingDashboard> {
    const response = await apiClient.get(`/billing/dashboard?timeRange=${timeRange}`);
    return response.data;
  }

  async getBillingOverview(timeRange: string = '30'): Promise<BillingReports> {
    const response = await apiClient.get(`/billing/overview?timeRange=${timeRange}`);
    return response.data;
  }

  async getBillingMetrics(timeRange: string = '30'): Promise<RevenueReports> {
    const response = await apiClient.get(`/billing/metrics?timeRange=${timeRange}`);
    return response.data;
  }

  // Payers
  async getAllPayers(search?: string): Promise<Payer[]> {
    const params = search ? { search } : {};
    const response = await apiClient.get('/billing/payers', { params });
    return response.data;
  }

  async getPayerById(id: string): Promise<Payer> {
    const response = await apiClient.get(`/billing/payers/${id}`);
    return response.data;
  }

  async createPayer(payer: Omit<Payer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payer> {
    const response = await apiClient.post('/billing/payers', payer);
    return response.data;
  }

  async updatePayer(id: string, payer: Partial<Payer>): Promise<Payer> {
    const response = await apiClient.put(`/billing/payers/${id}`, payer);
    return response.data;
  }

  async deletePayer(id: string): Promise<void> {
    await apiClient.delete(`/billing/payers/${id}`);
  }

  // Contracts
  async getAllContracts(payerId?: string): Promise<PayerContract[]> {
    const params = payerId ? { payerId } : {};
    const response = await apiClient.get('/billing/contracts', { params });
    return response.data;
  }

  async getContractById(id: string): Promise<PayerContract> {
    const response = await apiClient.get(`/billing/contracts/${id}`);
    return response.data;
  }

  async createContract(contract: Omit<PayerContract, 'id' | 'createdAt' | 'updatedAt'>): Promise<PayerContract> {
    const response = await apiClient.post('/billing/contracts', contract);
    return response.data;
  }

  async updateContract(id: string, contract: Partial<PayerContract>): Promise<PayerContract> {
    const response = await apiClient.put(`/billing/contracts/${id}`, contract);
    return response.data;
  }

  async deleteContract(id: string): Promise<void> {
    await apiClient.delete(`/billing/contracts/${id}`);
  }

  // Fee Schedules
  async getAllFeeSchedules(payerId?: string): Promise<FeeSchedule[]> {
    const params = payerId ? { payerId } : {};
    const response = await apiClient.get('/billing/fee-schedules', { params });
    return response.data;
  }

  async getFeeScheduleById(id: string): Promise<FeeSchedule> {
    const response = await apiClient.get(`/billing/fee-schedules/${id}`);
    return response.data;
  }

  async createFeeSchedule(feeSchedule: Omit<FeeSchedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<FeeSchedule> {
    const response = await apiClient.post('/billing/fee-schedules', feeSchedule);
    return response.data;
  }

  async updateFeeSchedule(id: string, feeSchedule: Partial<FeeSchedule>): Promise<FeeSchedule> {
    const response = await apiClient.put(`/billing/fee-schedules/${id}`, feeSchedule);
    return response.data;
  }

  async deleteFeeSchedule(id: string): Promise<void> {
    await apiClient.delete(`/billing/fee-schedules/${id}`);
  }

  async getCptCodes(): Promise<CptCode[]> {
    const response = await apiClient.get('/billing/fee-schedules/cpt-codes');
    return response.data;
  }

  // Verifications
  async getAllVerifications(clientId?: string): Promise<InsuranceVerification[]> {
    const params = clientId ? { clientId } : {};
    const response = await apiClient.get('/billing/verifications', { params });
    return response.data;
  }

  async getVerificationById(id: string): Promise<InsuranceVerification> {
    const response = await apiClient.get(`/billing/verifications/${id}`);
    return response.data;
  }

  async createVerification(verification: Omit<InsuranceVerification, 'id' | 'createdAt' | 'updatedAt'>): Promise<InsuranceVerification> {
    const response = await apiClient.post('/billing/verifications', verification);
    return response.data;
  }

  async updateVerification(id: string, verification: Partial<InsuranceVerification>): Promise<InsuranceVerification> {
    const response = await apiClient.put(`/billing/verifications/${id}`, verification);
    return response.data;
  }

  async deleteVerification(id: string): Promise<void> {
    await apiClient.delete(`/billing/verifications/${id}`);
  }

  // Claims
  async getAllClaims(status?: string, search?: string): Promise<Claim[]> {
    const params: any = {};
    if (status) params.status = status;
    if (search) params.search = search;
    
    const response = await apiClient.get('/billing/claims', { params });
    return response.data;
  }

  async getClaimById(id: string): Promise<Claim> {
    const response = await apiClient.get(`/billing/claims/${id}`);
    return response.data;
  }

  async createClaim(claim: Omit<Claim, 'id' | 'createdAt' | 'updatedAt'>): Promise<Claim> {
    const response = await apiClient.post('/billing/claims', claim);
    return response.data;
  }

  async updateClaim(id: string, claim: Partial<Claim>): Promise<Claim> {
    const response = await apiClient.put(`/billing/claims/${id}`, claim);
    return response.data;
  }

  async deleteClaim(id: string): Promise<void> {
    await apiClient.delete(`/billing/claims/${id}`);
  }

  // Payments
  async getAllPayments(status?: string, search?: string): Promise<Payment[]> {
    const params: any = {};
    if (status) params.status = status;
    if (search) params.search = search;
    
    const response = await apiClient.get('/billing/payments', { params });
    return response.data;
  }

  async getPaymentById(id: string): Promise<Payment> {
    const response = await apiClient.get(`/billing/payments/${id}`);
    return response.data;
  }

  async createPayment(payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> {
    const response = await apiClient.post('/billing/payments', payment);
    return response.data;
  }

  async updatePayment(id: string, payment: Partial<Payment>): Promise<Payment> {
    const response = await apiClient.put(`/billing/payments/${id}`, payment);
    return response.data;
  }

  async deletePayment(id: string): Promise<void> {
    await apiClient.delete(`/billing/payments/${id}`);
  }

  // Reports
  async getBillingReports(timeRange: string = '30'): Promise<BillingReports> {
    const response = await apiClient.get(`/billing/reports/billing?timeRange=${timeRange}`);
    return response.data;
  }

  async getRevenueReports(timeRange: string = '30'): Promise<RevenueReports> {
    const response = await apiClient.get(`/billing/reports/revenue?timeRange=${timeRange}`);
    return response.data;
  }

  async getClaimsReports(timeRange: string = '30'): Promise<{ totalClaims: number; claims: Claim[] }> {
    const response = await apiClient.get(`/billing/reports/claims?timeRange=${timeRange}`);
    return response.data;
  }

  async getPaymentsReports(timeRange: string = '30'): Promise<{ totalPayments: number; payments: Payment[] }> {
    const response = await apiClient.get(`/billing/reports/payments?timeRange=${timeRange}`);
    return response.data;
  }
}

export const billingService = new BillingService(); 