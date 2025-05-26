
export interface MiscellaneousNoteFormData {
  // Basic Information
  clientId: string;
  noteDate: string;
  eventDate: string;
  
  // Note Classification
  noteCategory: 'administrative' | 'legal' | 'insurance' | 'coordination_of_care' | 'incident_report' | 'other';
  noteSubtype: string;
  urgencyLevel: 'low' | 'medium' | 'high' | 'urgent';
  
  // Content
  noteTitle: string;
  noteDescription: string;
  detailedNotes: string;
  
  // Related Information
  relatedPersons: Array<{
    name: string;
    relationship: string;
    role: string;
  }>;
  
  // Documentation & Attachments
  documentsReferenced: string[];
  actionsTaken: string[];
  followUpRequired: boolean;
  followUpDetails: string;
  
  // Legal & Compliance
  mandatoryReporting: boolean;
  reportingDetails: string;
  legalImplications: string;
  
  // Outcomes
  resolution: string;
  outcomeSummary: string;
  
  // Documentation
  signature: string;
  isFinalized: boolean;
  signedBy?: string;
  signedAt?: string;
  
  // Index signature for Json compatibility
  [key: string]: any;
}
