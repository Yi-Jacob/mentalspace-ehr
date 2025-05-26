
export interface CancellationNoteFormData {
  // Basic Information
  clientId: string;
  noteDate: string;
  sessionDate: string;
  sessionTime: string;
  
  // Cancellation Details
  cancellationReason: string;
  cancellationInitiator: 'client' | 'provider' | 'emergency' | 'system';
  notificationMethod: 'phone' | 'email' | 'text' | 'in_person' | 'no_show';
  advanceNoticeHours: number;
  
  // Billing & Policy
  billingStatus: 'billed' | 'not_billed' | 'partial_charge' | 'pending_review';
  chargeAmount: number;
  policyViolation: boolean;
  policyDetails: string;
  
  // Rescheduling
  willReschedule: boolean;
  rescheduleDate: string;
  rescheduleTime: string;
  rescheduleNotes: string;
  
  // Follow-up Actions
  followUpRequired: boolean;
  followUpActions: string[];
  providerNotes: string;
  
  // Documentation
  signature: string;
  isFinalized: boolean;
  signedBy?: string;
  signedAt?: string;
}
