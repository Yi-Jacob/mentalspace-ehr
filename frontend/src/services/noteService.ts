import { apiClient } from './api-helper/client';
import { Note, CreateNoteRequest, UpdateNoteRequest, QueryNotesParams, NotesResponse } from '../types/note';

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
    return apiClient.get<NotesResponse>(url);
  }

  // Get single note by ID
  async getNote(id: string): Promise<Note> {
    return apiClient.get<Note>(`${this.baseUrl}/${id}`);
  }

  // Create new note
  async createNote(data: CreateNoteRequest): Promise<Note> {
    return apiClient.post<Note>(this.baseUrl, data);
  }

  // Update existing note
  async updateNote(id: string, data: UpdateNoteRequest): Promise<Note> {
    return apiClient.patch<Note>(`${this.baseUrl}/${id}`, data);
  }

  // Delete note
  async deleteNote(id: string): Promise<void> {
    return apiClient.delete(`${this.baseUrl}/${id}`);
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
    return apiClient.get<NotesResponse>(url);
  }

  // Submit note for review
  async submitForReview(id: string): Promise<Note> {
    return apiClient.patch<Note>(`${this.baseUrl}/${id}/submit`, {});
  }

  // Sign note
  async signNote(id: string, signature: string): Promise<Note> {
    return apiClient.patch<Note>(`${this.baseUrl}/${id}/sign`, { signature });
  }

  // Lock note
  async lockNote(id: string): Promise<Note> {
    return apiClient.patch<Note>(`${this.baseUrl}/${id}/lock`, {});
  }
}

export const noteService = new NoteService(); 