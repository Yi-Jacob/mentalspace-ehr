export interface ClientInfo {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  email?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  genderIdentity?: string;
}

export interface ProviderInfo {
  id: string;
  firstName: string;
  lastName: string;
}

export interface Note {
  id: string;
  title: string;
  content: Record<string, any>;
  clientId: string;
  providerId: string;
  noteType: NoteType;
  status: NoteStatus;
  signedAt?: string;
  signedBy?: string;
  approvedAt?: string;
  approvedBy?: string;
  coSignedAt?: string;
  coSignedBy?: string;
  lockedAt?: string;
  version?: number;
  createdAt: string;
  updatedAt: string;
  client?: ClientInfo;
  provider?: ProviderInfo;
}

export type NoteType = 
  | 'intake'
  | 'progress_note'
  | 'treatment_plan'
  | 'contact_note'
  | 'consultation_note'
  | 'cancellation_note'
  | 'miscellaneous_note';

export type NoteStatus = 
  | 'draft'
  | 'submitted_for_review'
  | 'signed'
  | 'locked';

export interface CreateNoteRequest {
  title: string;
  content: Record<string, any>;
  clientId: string;
  noteType: NoteType;
  status?: NoteStatus;
}

export interface UpdateNoteRequest {
  title?: string;
  content?: Record<string, any>;
  status?: NoteStatus;
}

export interface QueryNotesParams {
  page?: number;
  limit?: number;
  clientId?: string;
  noteType?: string;
  status?: string;
}

export interface NotesResponse {
  notes: Note[];
  total: number;
} 