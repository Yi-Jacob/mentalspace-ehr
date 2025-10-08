import React, { useState, useEffect } from 'react';
import { FileText, Download, CheckCircle, Clock, AlertCircle, Eye, FileEdit } from 'lucide-react';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import { Table, TableColumn } from '@/components/basic/table';
import { Badge } from '@/components/basic/badge';
import { clientFilesService } from '@/services/clientFilesService';
import { ClientFileDto } from '@/types/clientType';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/basic/dialog';
import { Button } from '@/components/basic/button';

const ClientFilesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [files, setFiles] = useState<ClientFileDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [completing, setCompleting] = useState<string | null>(null);
  const [selectedFileForNotes, setSelectedFileForNotes] = useState<ClientFileDto | null>(null);

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
    if (!file.file || file.portalForm) {
      toast.error('Cannot download portal forms');
      return;
    }

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

  const handleViewPortalForm = async (file: ClientFileDto) => {
    if (file.portalForm) {
      navigate(`/library/portal-forms-response/${file.portalFormResponse.id}`);
    }
  };

  const handleViewNotes = (file: ClientFileDto) => {
    setSelectedFileForNotes(file);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'completedbyclient':
        return <Badge variant="outline">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const canComplete = (file: ClientFileDto) => {
    return file.status !== 'completedbyclient';
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
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
          {file.portalForm ? (
            <FileEdit className="h-4 w-4 text-blue-500" />
          ) : (
            <FileText className="h-4 w-4 text-gray-500" />
          )}
          <span className="font-medium">{file.file?.fileName || file.portalForm?.title}</span>
          {file.portalForm && (
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">Portal Form</span>
          )}
        </div>
      ),
      searchable: true,
      searchValue: (file) => file.file?.fileName || file.portalForm?.title || ''
    },
    {
      key: 'fileSize',
      header: 'Size',
      accessor: (file) => formatFileSize(file.file?.fileSize),
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
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: (file: ClientFileDto) => {
        if (file.portalForm) {
          handleViewPortalForm(file);
        } else {
          handleViewNotes(file);
        }
      },
      variant: 'outline' as const
    },
    {
      label: (file: ClientFileDto) => 'Download',
      icon: (file: ClientFileDto) => <Download className="h-4 w-4" />,
      onClick: handleDownload,
      variant: 'outline' as const,
      disabled: (file: ClientFileDto) => !!file.portalForm || downloading === file.id
    },
    {
      label: (file: ClientFileDto) => canComplete(file) ? 'Mark Complete' : 'Complete',
      icon: (file: ClientFileDto) => canComplete(file) ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />,
      onClick: handleComplete,
      variant: (file: ClientFileDto) => canComplete(file) ? 'default' as const : 'secondary' as const,
      disabled: (file: ClientFileDto) => !canComplete(file) || completing === file.id
    }
  ].filter(action => action.label !== ''); // Filter out empty actions

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
            {/* Notes Modal */}
            <Dialog open={!!selectedFileForNotes} onOpenChange={() => setSelectedFileForNotes(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">File Notes</DialogTitle>
            <DialogDescription className="text-gray-600">
              View notes for the selected file.
            </DialogDescription>
          </DialogHeader>
          
          {selectedFileForNotes && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  {selectedFileForNotes.portalForm ? 'Portal Form' : 'File'}
                </h3>
                <p className="text-sm text-gray-900">
                  {selectedFileForNotes.portalForm 
                    ? selectedFileForNotes.portalForm.title 
                    : selectedFileForNotes.file?.fileName
                  }
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Notes</h3>
                {selectedFileForNotes.notes ? (
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedFileForNotes.notes}</p>
                ) : (
                  <p className="text-sm text-gray-400 italic">No notes available</p>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedFileForNotes(null)}
              className="flex-1"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default ClientFilesPage;
