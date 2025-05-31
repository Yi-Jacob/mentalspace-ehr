
import { Database } from '@/integrations/supabase/types';

// Database types
export type Payer = Database['public']['Tables']['payers']['Row'];
export type PayerInsert = Database['public']['Tables']['payers']['Insert'];
export type PayerContract = Database['public']['Tables']['payer_contracts']['Row'];
export type PayerFeeSchedule = Database['public']['Tables']['payer_fee_schedules']['Row'];
export type InsuranceVerification = Database['public']['Tables']['insurance_verifications']['Row'];
export type Claim = Database['public']['Tables']['claims']['Row'];
export type ClaimLineItem = Database['public']['Tables']['claim_line_items']['Row'];
export type Payment = Database['public']['Tables']['payments']['Row'];
export type PaymentAllocation = Database['public']['Tables']['payment_allocations']['Row'];
export type PatientStatement = Database['public']['Tables']['patient_statements']['Row'];
export type StatementLineItem = Database['public']['Tables']['statement_line_items']['Row'];

// Extended types for UI
export interface PayerWithContracts extends Payer {
  contracts?: PayerContract[];
  fee_schedules?: PayerFeeSchedule[];
}

export interface ClaimWithDetails extends Claim {
  line_items?: ClaimLineItem[];
  client?: {
    first_name: string;
    last_name: string;
    email?: string;
  };
  provider?: {
    first_name: string;
    last_name: string;
  };
  payer?: Payer;
}

export interface PaymentWithDetails extends Payment {
  client?: {
    first_name: string;
    last_name: string;
  };
  payer?: Payer;
  allocations?: PaymentAllocation[];
}

export interface StatementWithDetails extends PatientStatement {
  client?: {
    first_name: string;
    last_name: string;
    email?: string;
  };
  line_items?: StatementLineItem[];
}

// Form types
export interface PayerFormData {
  name: string;
  payer_type: 'in_network' | 'out_of_network' | 'government' | 'self_pay';
  electronic_payer_id?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  phone_number?: string;
  fax_number?: string;
  website?: string;
  contact_person?: string;
  contact_email?: string;
  requires_authorization: boolean;
  notes?: string;
}

export interface ClaimFormData {
  client_id: string;
  provider_id: string;
  payer_id: string;
  service_date: string;
  authorization_number?: string;
  diagnosis_codes: string[];
  place_of_service: string;
  line_items: ClaimLineItemFormData[];
}

export interface ClaimLineItemFormData {
  service_date: string;
  cpt_code: string;
  modifier_1?: string;
  modifier_2?: string;
  modifier_3?: string;
  modifier_4?: string;
  diagnosis_pointer?: number;
  units: number;
  charge_amount: number;
  line_note?: string;
}

export interface PaymentFormData {
  client_id: string;
  claim_id?: string;
  payer_id?: string;
  payment_date: string;
  payment_method: 'insurance' | 'credit_card' | 'check' | 'cash' | 'bank_transfer' | 'payment_plan';
  payment_amount: number;
  reference_number?: string;
  credit_card_last_four?: string;
  payment_processor?: string;
  processing_fee?: number;
  notes?: string;
}

// Report types
export interface RevenueReportData {
  provider_revenue: { provider_name: string; revenue: number }[];
  service_revenue: { service_type: string; revenue: number }[];
  payer_revenue: { payer_name: string; revenue: number }[];
  monthly_trend: { month: string; revenue: number }[];
  collection_rate: number;
  total_revenue: number;
}

export interface ClaimsReportData {
  total_claims: number;
  submitted_claims: number;
  paid_claims: number;
  denied_claims: number;
  pending_claims: number;
  average_processing_time: number;
  denial_reasons: { reason: string; count: number }[];
}

export interface AgingReportData {
  current: number;
  days_30: number;
  days_60: number;
  days_90: number;
  days_120_plus: number;
  total_ar: number;
}
