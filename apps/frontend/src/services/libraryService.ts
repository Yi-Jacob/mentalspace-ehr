import { apiClient } from './api-helper/client';

export interface LibraryFile {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  mimeType?: string;
  sharable: 'sharable' | 'not_sharable';
  accessLevel: 'admin' | 'clinician' | 'billing';
  isForPatient: boolean;
  isForStaff: boolean;
  clientId?: string;
  userId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  client?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  creator: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateLibraryFileDto {
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  mimeType?: string;
  sharable?: 'sharable' | 'not_sharable';
  accessLevel?: 'admin' | 'clinician' | 'billing';
  isForPatient?: boolean;
  isForStaff?: boolean;
  clientId?: string;
  userId?: string;
}

export interface UpdateLibraryFileDto {
  fileName?: string;
  authorId?: string;
  sharable?: 'sharable' | 'not_sharable';
  accessLevel?: 'admin' | 'clinician' | 'billing';
  isForPatient?: boolean;
  isForStaff?: boolean;
  clientId?: string;
  userId?: string;
}

export interface UploadFileResponse {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}

export interface DownloadUrlResponse {
  downloadUrl: string;
}

export interface ViewUrlResponse {
  viewUrl: string;
}

class LibraryService {
  private baseUrl = '/library';

  async getAllFiles(): Promise<LibraryFile[]> {
    const response = await apiClient.get<LibraryFile[]>(this.baseUrl);
    return response.data;
  }

  async getFileById(fileId: string): Promise<LibraryFile> {
    const response = await apiClient.get<LibraryFile>(`${this.baseUrl}/${fileId}`);
    return response.data;
  }

  async createFile(data: CreateLibraryFileDto): Promise<LibraryFile> {
    const response = await apiClient.post<LibraryFile>(this.baseUrl, data);
    return response.data;
  }

  async updateFile(fileId: string, data: UpdateLibraryFileDto): Promise<LibraryFile> {
    const response = await apiClient.put<LibraryFile>(`${this.baseUrl}/${fileId}`, data);
    return response.data;
  }

  async deleteFile(fileId: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`${this.baseUrl}/${fileId}`);
    return response.data;
  }

  async getDownloadUrl(fileId: string): Promise<DownloadUrlResponse> {
    const response = await apiClient.get<DownloadUrlResponse>(`${this.baseUrl}/${fileId}/download`);
    return response.data;
  }

  async getViewUrl(fileId: string): Promise<ViewUrlResponse> {
    const response = await apiClient.get<ViewUrlResponse>(`${this.baseUrl}/${fileId}/view`);
    return response.data;
  }

  async uploadFile(file: File): Promise<UploadFileResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<UploadFileResponse>('/upload/library', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export const libraryService = new LibraryService();
