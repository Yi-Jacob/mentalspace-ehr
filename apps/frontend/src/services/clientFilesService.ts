import { apiClient } from './api-helper/client';
import { 
  ClientFileDto, 
  CreateClientFileDto, 
  UpdateClientFileDto,
  SignFileDto,
  CompleteFileDto
} from '@/types/clientType';

export interface ShareableFileDto {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  mimeType?: string;
  createdAt: string;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface ShareFileDto {
  fileId: string;
  notes?: string;
}

// Client Files Service
export class ClientFilesService {
  private baseUrl = '/clients';

  // Get all files for a specific client
  async getForClient(clientId: string): Promise<ClientFileDto[]> {
    const response = await apiClient.get<ClientFileDto[]>(`${this.baseUrl}/${clientId}/files`);
    return response.data;
  }

  // Share a file with a client
  async shareFile(clientId: string, shareData: ShareFileDto): Promise<ClientFileDto> {
    const response = await apiClient.post<ClientFileDto>(`${this.baseUrl}/${clientId}/files`, shareData);
    return response.data;
  }

  // Get shareable files
  async getShareableFiles(clientId: string): Promise<ShareableFileDto[]> {
    const response = await apiClient.get<ShareableFileDto[]>(`${this.baseUrl}/${clientId}/files/shareable`);
    return response.data;
  }

  // Sign a file by the author
  async signByAuthor(clientId: string, fileId: string): Promise<ClientFileDto> {
    const response = await apiClient.put<ClientFileDto>(`${this.baseUrl}/${clientId}/files/${fileId}/sign`);
    return response.data;
  }

  // Co-sign a file by supervisor
  async coSignFile(clientId: string, fileId: string): Promise<ClientFileDto> {
    const response = await apiClient.put<ClientFileDto>(`${this.baseUrl}/${clientId}/files/${fileId}/co-sign`);
    return response.data;
  }

  // Complete a file by the client
  async completeByClient(clientId: string, fileId: string): Promise<ClientFileDto> {
    const response = await apiClient.put<ClientFileDto>(`${this.baseUrl}/${clientId}/files/${fileId}/complete`);
    return response.data;
  }

  // Get a single file by ID
  async getFileById(clientId: string, fileId: string): Promise<ClientFileDto> {
    const response = await apiClient.get<ClientFileDto>(`${this.baseUrl}/${clientId}/files/${fileId}`);
    return response.data;
  }

  // Update a file
  async updateFile(clientId: string, fileId: string, updateData: UpdateClientFileDto): Promise<ClientFileDto> {
    const response = await apiClient.put<ClientFileDto>(`${this.baseUrl}/${clientId}/files/${fileId}`, updateData);
    return response.data;
  }

  // Delete a file
  async deleteFile(clientId: string, fileId: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`${this.baseUrl}/${clientId}/files/${fileId}`);
    return response.data;
  }

  // Download a file (this would typically redirect to the file URL or return a blob)
  async downloadFile(fileUrl: string, fileName: string): Promise<void> {
    try {
      // Create a temporary link element to trigger download
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      throw new Error('Failed to download file');
    }
  }

  // Get download URL for a file
  async getDownloadUrl(clientId: string, fileId: string): Promise<string> {
    const response = await apiClient.get<{ downloadUrl: string }>(`${this.baseUrl}/${clientId}/files/${fileId}/download`);
    return response.data.downloadUrl;
  }

}

export const clientFilesService = new ClientFilesService();
