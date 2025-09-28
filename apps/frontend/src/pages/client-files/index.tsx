import React, { useState, useEffect } from 'react';
import { FileText, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import { Table, TableColumn } from '@/components/basic/table';
import { Badge } from '@/components/basic/badge';
import { Button } from '@/components/basic/button';
import { clientFilesService } from '@/services/clientFilesService';
import { ClientFileDto } from '@/types/clientType';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const ClientFilesPage: React.FC = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState<ClientFileDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [completing, setCompleting] = useState<string | null>(null);

  // Get client ID from user context
  const clientId = user?.clientId;

  useEffect(() => {
    if (clientId) {
      loadFiles();
    }
  }, [clientId]);

  const loadFiles = async () => {
    if (!clientId) return;
    
    try {
      setLoading(true);
      const filesData = await clientFilesService.getForClient(clientId);
      setFiles(filesData);
    } catch (error) {
      console.error('Error loading files:', error);
      toast.error('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (file: ClientFileDto) => {
    try {
      setDownloading(file.id);
      const downloadUrl = await clientFilesService.getDownloadUrl(clientId!, file.id);
      await clientFilesService.downloadFile(downloadUrl, file.file.fileName);
      toast.success('File download started');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    } finally {
      setDownloading(null);
    }
  };

  const handleComplete = async (file: ClientFileDto) => {
    try {
      setCompleting(file.id);
      await clientFilesService.completeByClient(clientId!, file.id);
      toast.success('File marked as completed');
      // Reload files to update status
      await loadFiles();
    } catch (error) {
      console.error('Error completing file:', error);
      toast.error('Failed to complete file');
    } finally {
      setCompleting(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'signedbyauthor':
        return <Badge variant="default">Signed by Author</Badge>;
      case 'signedbysupervisor':
        return <Badge variant="default">Signed by Supervisor</Badge>;
      case 'completedbyclient':
        return <Badge variant="success">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const canComplete = (file: ClientFileDto) => {
    return (
      file.status === 'signedbyauthor' || 
      file.status === 'signedbysupervisor'
    ) && file.isCompletedOnStaff && file.status !== 'completedbyclient';
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const columns: TableColumn<ClientFileDto>[] = [
    {
      key: 'fileName',
      header: 'File Name',
      accessor: (file) => (
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{file.file.fileName}</span>
        </div>
      ),
      searchable: true,
      searchValue: (file) => file.file.fileName
    },
    {
      key: 'fileSize',
      header: 'Size',
      accessor: (file) => formatFileSize(file.file.fileSize),
      width: '120px'
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (file) => getStatusBadge(file.status),
      width: '150px'
    },
    {
      key: 'creator',
      header: 'Created By',
      accessor: (file) => `${file.creator.firstName} ${file.creator.lastName}`,
      searchable: true,
      searchValue: (file) => `${file.creator.firstName} ${file.creator.lastName}`
    },
    {
      key: 'createdAt',
      header: 'Created',
      accessor: (file) => formatDate(file.createdAt),
      width: '150px'
    },
    {
      key: 'notes',
      header: 'Notes',
      accessor: (file) => file.notes || '-',
      searchable: true,
      searchValue: (file) => file.notes || ''
    }
  ];

  const actions = [
    {
      label: 'Download',
      icon: <Download className="h-4 w-4" />,
      onClick: handleDownload,
      variant: 'outline' as const
    },
    {
      label: (file: ClientFileDto) => canComplete(file) ? 'Mark Complete' : 'Complete',
      icon: (file: ClientFileDto) => canComplete(file) ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />,
      onClick: handleComplete,
      variant: (file: ClientFileDto) => canComplete(file) ? 'default' as const : 'secondary' as const,
      disabled: (file: ClientFileDto) => !canComplete(file) || completing === file.id
    }
  ];

  if (!clientId) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
            <p className="text-gray-500">You need to be logged in as a client to access this page.</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        icon={FileText}
        title="My Files"
        description="View and manage files shared with you by your healthcare providers"
      />
      
      <Table
        data={files}
        columns={columns}
        actions={actions}
        loading={loading}
        emptyMessage="No files have been shared with you yet."
        searchable={true}
        pagination={true}
        pageSize={10}
      />
    </PageLayout>
  );
};

export default ClientFilesPage;
