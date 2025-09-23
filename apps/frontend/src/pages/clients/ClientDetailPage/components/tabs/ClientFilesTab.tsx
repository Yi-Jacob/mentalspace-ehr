import React, { useState, useEffect } from 'react';
import { FileText, Download, PenTool, CheckCircle, Upload } from 'lucide-react';
import { Button } from '@/components/basic/button';
import { Badge } from '@/components/basic/badge';
import { Table, TableColumn } from '@/components/basic/table';
import { useToast } from '@/hooks/use-toast';
import { ClientFileDto } from '@/types/clientType';
import { clientFilesService } from '@/services/clientFilesService';
import { FILE_STATUS_OPTIONS, FileStatus } from '@/types/enums/clientEnum';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { useAuth } from '@/hooks/useAuth';

interface ClientFilesTabProps {
  clientId: string;
  clientName: string;
}

const ClientFilesTab: React.FC<ClientFilesTabProps> = ({ clientId, clientName }) => {
  const [files, setFiles] = useState<ClientFileDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const filesData = await clientFilesService.getForClient(clientId);
      setFiles(filesData);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast({
        title: "Error",
        description: "Failed to load files",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [clientId]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      
      // Upload file to S3
      const uploadResult = await clientFilesService.uploadFile(file, clientId);

      // Create file record
      await clientFilesService.newFile(clientId, {
        fileName: uploadResult.fileName,
        fileUrl: uploadResult.fileUrl,
        fileSize: uploadResult.fileSize,
        mimeType: uploadResult.mimeType,
      });
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });

      // Refresh files list
      await fetchFiles();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleDownload = async (file: ClientFileDto) => {
    try {
      await clientFilesService.downloadFile(file.fileUrl, file.fileName);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const handleSign = async (file: ClientFileDto) => {
    try {
      await clientFilesService.signByAuthor(clientId, file.id);
      toast({
        title: "Success",
        description: "File signed successfully",
      });
      await fetchFiles();
    } catch (error) {
      console.error('Error signing file:', error);
      toast({
        title: "Error",
        description: "Failed to sign file",
        variant: "destructive",
      });
    }
  };

  const handleCoSign = async (file: ClientFileDto) => {
    try {
      await clientFilesService.coSignFile(clientId, file.id);
      toast({
        title: "Success",
        description: "File co-signed successfully",
      });
      await fetchFiles();
    } catch (error) {
      console.error('Error co-signing file:', error);
      toast({
        title: "Error",
        description: "Failed to co-sign file",
        variant: "destructive",
      });
    }
  };

  const handleComplete = async (file: ClientFileDto) => {
    try {
      await clientFilesService.completeByClient(clientId, file.id);
      toast({
        title: "Success",
        description: "File completed successfully",
      });
      await fetchFiles();
    } catch (error) {
      console.error('Error completing file:', error);
      toast({
        title: "Error",
        description: "Failed to complete file",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: FileStatus) => {
    const statusOption = FILE_STATUS_OPTIONS.find(option => option.value === status);
    const variant = status === 'completedbyclient' ? 'default' : 
                   status === 'signedbysupervisor' ? 'secondary' : 
                   status === 'signedbyauthor' ? 'outline' : 'destructive';
    
    return (
      <Badge variant={variant}>
        {statusOption?.label || status}
      </Badge>
    );
  };

  const canSign = (file: ClientFileDto) => {
    return file.createdBy === user?.id && file.status === 'draft';
  };

  const canCoSign = (file: ClientFileDto) => {
    // This would need to be implemented based on supervision relationships
    // For now, we'll check if the user is not the creator and the file is signed by author
    return file.createdBy !== user?.id && file.status === 'signedbyauthor' && !file.isCompletedOnStaff;
  };

  const canComplete = (file: ClientFileDto) => {
    return file.clientId === user?.id && file.isCompletedOnStaff && file.status !== 'completedbyclient';
  };

  // Define table columns
  const columns: TableColumn<ClientFileDto>[] = [
    {
      key: 'fileName',
      header: 'File Name',
      accessor: (file) => (
        <div className="flex items-center">
          <FileText className="h-5 w-5 text-gray-400 mr-3" />
          <div>
            <div className="text-sm font-medium text-gray-900">
              {file.fileName}
            </div>
            {file.fileSize && (
              <div className="text-sm text-gray-500">
                {(file.fileSize / 1024).toFixed(1)} KB
              </div>
            )}
          </div>
        </div>
      ),
      sortable: true,
      searchable: true,
      searchValue: (file) => file.fileName,
    },
    {
      key: 'createdBy',
      header: 'Created By',
      accessor: (file) => `${file.creator.firstName} ${file.creator.lastName}`,
      sortable: true,
      searchable: true,
      searchValue: (file) => `${file.creator.firstName} ${file.creator.lastName}`,
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (file) => getStatusBadge(file.status),
      sortable: true,
      searchable: true,
      searchValue: (file) => file.status,
    },
    {
      key: 'createdAt',
      header: 'Created Date',
      accessor: (file) => new Date(file.createdAt).toLocaleDateString(),
      sortable: true,
      searchable: false,
    },
  ];

  // Define table actions
  const actions = [
    {
      label: 'Download',
      icon: <Download className="h-4 w-4" />,
      onClick: (file: ClientFileDto) => handleDownload(file),
      variant: 'ghost' as const,
    },
    {
      label: (file: ClientFileDto) => canSign(file) ? 'Sign' : '',
      icon: (file: ClientFileDto) => canSign(file) ? <PenTool className="h-4 w-4" /> : null,
      onClick: (file: ClientFileDto) => handleSign(file),
      disabled: (file: ClientFileDto) => !canSign(file),
    },
    {
      label: (file: ClientFileDto) => canCoSign(file) ? 'Co-sign' : '',
      icon: (file: ClientFileDto) => canCoSign(file) ? <PenTool className="h-4 w-4" /> : null,
      onClick: (file: ClientFileDto) => handleCoSign(file),
      disabled: (file: ClientFileDto) => !canCoSign(file),
    },
    {
      label: (file: ClientFileDto) => canComplete(file) ? 'Complete' : '',
      icon: (file: ClientFileDto) => canComplete(file) ? <CheckCircle className="h-4 w-4" /> : null,
      onClick: (file: ClientFileDto) => handleComplete(file),
      disabled: (file: ClientFileDto) => !canComplete(file),
    },
  ].filter(action => action.label !== ''); // Filter out empty actions

  if (loading) {
    return <LoadingSpinner message="Loading files..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header with Upload Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Client Files</h3>
          <p className="text-sm text-gray-600">Manage files for {clientName}</p>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={uploading}
            className="flex items-center space-x-2"
          >
            {uploading ? (
              <LoadingSpinner />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            <span>Upload File</span>
          </Button>
        </div>
      </div>

      {/* Files Table */}
      <Table
        data={files}
        columns={columns}
        actions={actions}
        loading={loading}
        emptyMessage={
          <EmptyState
            title="No files found"
            description="Upload files to get started"
            icon={FileText}
          />
        }
        searchable={true}
        sortable={true}
        pagination={true}
        pageSize={10}
      />
    </div>
  );
};

export default ClientFilesTab;
