import React, { useState, useEffect } from 'react';
import { FileText, Download, PenTool, CheckCircle, Share, Eye, X } from 'lucide-react';
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
import ShareDocumentModal from './ShareDocumentModal';

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
              {file.file.fileName}
            </div>
            {file.file.fileSize && (
              <div className="text-sm text-gray-500">
                {(file.file.fileSize / 1024).toFixed(1)} KB
              </div>
            )}
          </div>
        </div>
      ),
      sortable: true,
      searchable: true,
      searchValue: (file) => file.file.fileName,
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

  // Define table actions
  const actions = [
    {
      label: 'Download',
      icon: <Download className="h-4 w-4" />,
      onClick: (file: ClientFileDto) => handleDownload(file),
      variant: 'ghost' as const,
    },
    {
      label: 'View Notes',
      icon: <Eye className="h-4 w-4" />,
      onClick: (file: ClientFileDto) => handleViewNotes(file),
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
      {selectedFileForNotes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">File Notes</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFileForNotes(null)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">File</h3>
                  <p className="text-sm text-gray-900">{selectedFileForNotes.file.fileName}</p>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientFilesTab;
