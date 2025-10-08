import React, { useState, useEffect } from 'react';
import { FileText, Download, PenTool, CheckCircle, Share, Eye, FileEdit } from 'lucide-react';
import { Button } from '@/components/basic/button';
import { Badge } from '@/components/basic/badge';
import { Table, TableColumn } from '@/components/basic/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/basic/dialog';
import { useToast } from '@/hooks/use-toast';
import { ClientFileDto } from '@/types/clientType';
import { clientFilesService } from '@/services/clientFilesService';
import { FILE_STATUS_OPTIONS, FileStatus } from '@/types/enums/clientEnum';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { useAuth } from '@/hooks/useAuth';
import ShareDocumentModal from './ShareDocumentModal';
import { useNavigate } from 'react-router-dom';

interface ClientFilesTabProps {
  clientId: string;
  clientName: string;
}

const ClientFilesTab: React.FC<ClientFilesTabProps> = ({ clientId, clientName }) => {
  const [files, setFiles] = useState<ClientFileDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedFileForNotes, setSelectedFileForNotes] = useState<ClientFileDto | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

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

  const handleFileShared = async () => {
    // Refresh files list after sharing
    await fetchFiles();
  };

  const handleViewNotes = (file: ClientFileDto) => {
    setSelectedFileForNotes(file);
  };

  const handleDownload = async (file: ClientFileDto) => {
    if (!file.file) {
      toast({
        title: "Error",
        description: "Cannot download portal forms",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get signed download URL from backend
      const downloadUrl = await clientFilesService.getDownloadUrl(clientId, file.id);
      
      // Create a temporary link element to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = file.file.fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Error",
        description: "Failed to download file",
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
    const variant = status === 'completedbyclient' ? 'default' : 'destructive';
    
    return (
      <Badge variant={variant}>
        {statusOption?.label || status}
      </Badge>
    );
  };

  const canComplete = (file: ClientFileDto) => {
    return file.clientId === user?.id && file.isCompletedOnStaff && file.status !== 'completedbyclient';
  };

  // Define table columns
  const columns: TableColumn<ClientFileDto>[] = [
    {
      key: 'fileName',
      header: 'Name',
      accessor: (file) => (
        <div className="flex items-center">
          {file.portalForm ? (
            <FileEdit className="h-5 w-5 text-blue-400 mr-3" />
          ) : (
            <FileText className="h-5 w-5 text-gray-400 mr-3" />
          )}
          <div>
            <div className="text-sm font-medium text-gray-900">
              {file.portalForm ? file.portalForm.title : file.file?.fileName}
            </div>
            {file.portalForm ? (
              <div className="text-sm text-gray-500">
                Portal Form
              </div>
            ) : file.file?.fileSize && (
              <div className="text-sm text-gray-500">
                {(file.file.fileSize / 1024).toFixed(1)} KB
              </div>
            )}
          </div>
        </div>
      ),
      sortable: true,
      searchable: true,
      searchValue: (file) => file.portalForm ? file.portalForm.title : file.file?.fileName || '',
    },
    {
      key: 'notes',
      header: 'Notes',
      accessor: (file) => (
        <div className="max-w-xs">
          {file.notes ? (
            <div className="text-sm text-gray-900 truncate" title={file.notes}>
              {file.notes}
            </div>
          ) : (
            <span className="text-sm text-gray-400 italic">No notes</span>
          )}
        </div>
      ),
      sortable: false,
      searchable: true,
      searchValue: (file) => file.notes || '',
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

  const handleViewPortalForm = async (file: ClientFileDto) => {
    if (file.portalForm) {
      navigate(`/library/portal-forms-response/${file.portalFormResponse.id}`);
    }
  };

  // Define table actions
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
      variant: 'ghost' as const,
    },
    {
      label: (file: ClientFileDto) => !file.portalForm ? 'Download' : '',
      icon: (file: ClientFileDto) => !file.portalForm ? <Download className="h-4 w-4" /> : null,
      onClick: (file: ClientFileDto) => handleDownload(file),
      disabled: (file: ClientFileDto) => !!file.portalForm,
    },
    {
      label: (file: ClientFileDto) => !file.portalForm && canComplete(file) ? 'Complete' : '',
      icon: (file: ClientFileDto) => !file.portalForm && canComplete(file) ? <CheckCircle className="h-4 w-4" /> : null,
      onClick: (file: ClientFileDto) => handleComplete(file),
      disabled: (file: ClientFileDto) => !!file.portalForm || !canComplete(file),
    },
  ].filter(action => action.label !== ''); // Filter out empty actions

  if (loading) {
    return <LoadingSpinner message="Loading files..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header with Share Document Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Client Files</h3>
          <p className="text-sm text-gray-600">Manage files for {clientName}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowShareModal(true)}
            className="flex items-center space-x-2"
          >
            <Share className="h-4 w-4" />
            <span>Share Document</span>
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
            description="Share documents to get started"
            icon={FileText}
          />
        }
        searchable={true}
        sortable={true}
        pagination={true}
        pageSize={10}
      />

      {/* Share Document Modal */}
      <ShareDocumentModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        clientId={clientId}
        onFileShared={handleFileShared}
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
    </div>
  );
};

export default ClientFilesTab;
