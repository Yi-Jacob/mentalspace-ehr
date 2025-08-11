export interface NoteHistoryEntry {
  id: string;
  noteId: string;
  version: number;
  title: string;
  content: Record<string, any>;
  status: string;
  updatedContent: boolean;
  updatedStatus: boolean;
  updatedTitle: boolean;
  createdAt: string;
  noteTitle?: string;
  noteType?: string;
  clientFirstName?: string;
  clientLastName?: string;
  providerFirstName?: string;
  providerLastName?: string;
}

export interface NoteHistoryVersion {
  id: string;
  noteId: string;
  version: number;
  title: string;
  content: Record<string, any>;
  status: string;
  updatedContent: boolean;
  updatedStatus: boolean;
  updatedTitle: boolean;
  createdAt: string;
  noteTitle?: string;
  noteType?: string;
  clientFirstName?: string;
  clientLastName?: string;
  clientDateOfBirth?: string;
  clientEmail?: string;
  clientAddress1?: string;
  clientAddress2?: string;
  clientCity?: string;
  clientState?: string;
  clientZipCode?: string;
  clientGenderIdentity?: string;
  providerFirstName?: string;
  providerLastName?: string;
}
