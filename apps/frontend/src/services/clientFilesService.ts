import { apiClient } from './api-helper/client';
import { 
  ClientFileDto, 
  CreateClientFileDto, 
  UpdateClientFileDto,
  SignFileDto,
  CompleteFileDto
} from '@/types/clientType';

// Client Files Service
export class ClientFilesService {
  private baseUrl = '/clients';

  // Get all files for a specific client
  async getForClient(clientId: string): Promise<ClientFileDto[]> {
    const response = await apiClient.get<ClientFileDto[]>(`${this.baseUrl}/${clientId}/files`);
    return response.data;
  }

  // Create a new file for a client
  async newFile(clientId: string, fileData: Omit<CreateClientFileDto, 'clientId' | 'createdBy'>): Promise<ClientFileDto> {
    const createData: CreateClientFileDto = {
      ...fileData,
      clientId, // This will be set by the backend from the authenticated user
    };
    const response = await apiClient.post<ClientFileDto>(`${this.baseUrl}/${clientId}/files`, createData);
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

  // Upload a file to S3 (this would typically be handled by a separate upload service)
  async uploadFile(file: File, clientId: string): Promise<{ fileUrl: string; fileName: string; fileSize: number; mimeType: string }> {
    try {
      // This is a placeholder for S3 upload functionality
      // In a real implementation, you would:
      // 1. Get a presigned URL from your backend
      // 2. Upload the file directly to S3
      // 3. Return the file information
      
      // For now, we'll simulate the upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('clientId', clientId);

      const response = await apiClient.post<{ fileUrl: string; fileName: string; fileSize: number; mimeType: string }>(
        '/upload/client-file',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }
}

export const clientFilesService = new ClientFilesService();
