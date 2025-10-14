import { apiClient } from './api-helper/client';
import { Note, CreateNoteRequest, UpdateNoteRequest, QueryNotesParams, NotesResponse } from '../types/noteType';
import { NoteHistoryEntry, NoteHistoryVersion } from '../types/noteHistoryType';

// Note Service
export class NoteService {
  private baseUrl = '/notes';

  // Get all notes with pagination and filtering
  async getNotes(params?: QueryNotesParams): Promise<NotesResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.clientId) queryParams.append('clientId', params.clientId);
    if (params?.noteType) queryParams.append('noteType', params.noteType);
    if (params?.status) queryParams.append('status', params.status);

    const url = `${this.baseUrl}?${queryParams.toString()}`;
    const response = await apiClient.get<NotesResponse>(url);
    return response.data;
  }

  // Get single note by ID
  async getNote(id: string): Promise<Note> {
    const response = await apiClient.get<Note>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // Create new note
  async createNote(data: CreateNoteRequest): Promise<Note> {
    const response = await apiClient.post<Note>(this.baseUrl, data);
    return response.data;
  }

  // Update existing note (unified method for saving and signing)
  async updateNote(id: string, data: UpdateNoteRequest & { sign?: boolean }): Promise<Note> {
    const response = await apiClient.patch<Note>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  // Save note as draft (convenience method)
  async saveDraft(id: string, data: UpdateNoteRequest): Promise<Note> {
    return this.updateNote(id, { ...data, sign: false });
  }

  // Sign note (convenience method)
  async signNote(id: string, data?: UpdateNoteRequest): Promise<Note> {
    return this.updateNote(id, { ...data, sign: true });
  }

  // Co-sign note
  async coSign(id: string): Promise<Note> {
    const response = await apiClient.patch<Note>(`${this.baseUrl}/${id}/co-sign`, {});
    return response.data;
  }

  // Lock note
  async lockNote(id: string): Promise<Note> {
    const response = await apiClient.patch<Note>(`${this.baseUrl}/${id}/lock`, {});
    return response.data;
  }

  // Unlock note
  async unlockNote(id: string): Promise<Note> {
    const response = await apiClient.patch<Note>(`${this.baseUrl}/${id}/unlock`, {});
    return response.data;
  }

  // Delete note
  async deleteNote(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }

  // Get notes by client
  async getClientNotes(clientId: string, params?: {
    page?: number;
    limit?: number;
    noteType?: string;
  }): Promise<NotesResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.noteType) queryParams.append('noteType', params.noteType);

    const url = `${this.baseUrl}/client/${clientId}?${queryParams.toString()}`;
    const response = await apiClient.get<NotesResponse>(url);
    return response.data;
  }

  // Submit note for review
  async submitForReview(id: string): Promise<Note> {
    const response = await apiClient.patch<Note>(`${this.baseUrl}/${id}/submit`, {});
    return response.data;
  }

  // Get note history
  async getNoteHistory(noteId: string): Promise<NoteHistoryEntry[]> {
    const response = await apiClient.get<NoteHistoryEntry[]>(`${this.baseUrl}/${noteId}/history`);
    return response.data;
  }

  // Get specific note history version
  async getNoteHistoryVersion(noteId: string, versionId: string): Promise<NoteHistoryVersion> {
    const response = await apiClient.get<NoteHistoryVersion>(`${this.baseUrl}/${noteId}/history/${versionId}`);
    return response.data;
  }
}

export const noteService = new NoteService(); 