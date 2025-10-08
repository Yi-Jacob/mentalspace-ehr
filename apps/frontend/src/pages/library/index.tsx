import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, Upload, Plus, Library, FileEdit } from 'lucide-react';
import { Button } from '@/components/basic/button';
import { Badge } from '@/components/basic/badge';
import { Table, TableColumn } from '@/components/basic/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/basic/tabs';
import { useToast } from '@/hooks/use-toast';
import { LibraryFile, libraryService } from '@/services/libraryService';
import { portalFormService } from '@/services/portalFormService';
import { PortalForm } from '@/types/portalFormType';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import UploadFileModal from './components/UploadFileModal';
import FileViewerModal from './components/FileViewerModal';
import { useStaffRoles } from '@/pages/staff/hook/useStaffRoles';
import { useNavigate } from 'react-router-dom';

const LibraryPage: React.FC = () => {
  const [files, setFiles] = useState<LibraryFile[]>([]);
  const [portalForms, setPortalForms] = useState<PortalForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isViewerModalOpen, setIsViewerModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<LibraryFile | null>(null);
  const { toast } = useToast();
  const { hasRole } = useStaffRoles();
  const navigate = useNavigate();
  const canUploadFiles = hasRole('Practice Administrator');

  const fetchFiles = async () => {
    try {
      const filesData = await libraryService.getAllFiles();
      setFiles(filesData);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast({
        title: "Error",
        description: "Failed to load library files",
        variant: "destructive",
      });
    }
  };

  const fetchPortalForms = async () => {
    try {
      const formsData = await portalFormService.getAllPortalForms();
      setPortalForms(formsData);
    } catch (error) {
      console.error('Error fetching portal forms:', error);
      toast({
        title: "Error",
        description: "Failed to load portal forms",
        variant: "destructive",
      });
    }
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchFiles(), fetchPortalForms()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleFileUpload = async (file: File, metadata: {
    sharable: 'sharable' | 'not_sharable';
    accessLevel: 'admin' | 'clinician' | 'billing';
  }) => {
    try {
      setUploading(true);
      
      // Upload file to S3
      const uploadResult = await libraryService.uploadFile(file);

      // Create file record
      await libraryService.createFile({
        fileName: uploadResult.fileName,
        fileUrl: uploadResult.fileUrl,
        fileSize: uploadResult.fileSize,
        mimeType: uploadResult.mimeType,
        isForPatient: false,
        isForStaff: false,
        ...metadata,
      });

      toast({
        title: "Success",
        description: "File uploaded successfully",
      });

      // Refresh files list
      await fetchAllData();
      setIsUploadModalOpen(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (file: LibraryFile) => {
    try {
      // Get signed download URL from backend
      const downloadUrl = await libraryService.getDownloadUrl(file.id);
      
      // Create a temporary link element to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl.downloadUrl;
      link.download = file.fileName;
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

  const handleOpen = (file: LibraryFile) => {
    setSelectedFile(file);
    setIsViewerModalOpen(true);
  };

  const handleCloseViewer = () => {
    setIsViewerModalOpen(false);
    setSelectedFile(null);
  };

  const handleCreatePortalForm = () => {
    navigate('/library/portal-forms/create');
  };

  const handleViewPortalForm = (form: PortalForm) => {
    navigate(`/library/portal-forms/${form.id}`);
  };

  const handleEditPortalForm = (form: PortalForm) => {
    navigate(`/library/portal-forms/${form.id}/edit`);
  };

  const getAccessLevelBadge = (accessLevel: string) => {
    const variants = {
      admin: 'destructive' as const,
      clinician: 'secondary' as const,
      billing: 'outline' as const,
    };
    
    return (
      <Badge variant={variants[accessLevel as keyof typeof variants] || 'outline'}>
        {accessLevel.charAt(0).toUpperCase() + accessLevel.slice(1)}
      </Badge>
    );
  };

  const getSharableBadge = (sharable: string) => {
    return (
      <Badge variant={sharable === 'sharable' ? 'default' : 'secondary'}>
        {sharable === 'sharable' ? 'Sharable' : 'Not Sharable'}
      </Badge>
    );
  };

  // Define table columns
  const columns: TableColumn<LibraryFile>[] = [
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
      key: 'accessLevel',
      header: 'Access Level',
      accessor: (file) => getAccessLevelBadge(file.accessLevel),
      sortable: true,
      searchable: true,
      searchValue: (file) => file.accessLevel,
    },
    {
      key: 'sharable',
      header: 'Sharable',
      accessor: (file) => getSharableBadge(file.sharable),
      sortable: true,
      searchable: true,
      searchValue: (file) => file.sharable,
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
      label: 'Open',
      icon: <Eye className="h-4 w-4" />,
      onClick: (file: LibraryFile) => handleOpen(file),
      variant: 'ghost' as const,
    },
    {
      label: 'Download',
      icon: <Download className="h-4 w-4" />,
      onClick: (file: LibraryFile) => handleDownload(file),
      variant: 'ghost' as const,
    },
  ];

  // Define portal form table columns
  const portalFormColumns: TableColumn<PortalForm>[] = [
    {
      key: 'title',
      header: 'Form Name',
      accessor: (form) => (
        <div className="flex items-center">
          <FileEdit className="h-5 w-5 text-gray-400 mr-3" />
          <div>
            <div className="text-sm font-medium text-gray-900">
              {form.title}
            </div>
            {form.description && (
              <div className="text-sm text-gray-500 truncate max-w-xs">
                {form.description}
              </div>
            )}
          </div>
        </div>
      ),
      sortable: true,
      searchable: true,
      searchValue: (form) => form.title,
    },
    {
      key: 'accessLevel',
      header: 'Access Level',
      accessor: (form) => getAccessLevelBadge(form.accessLevel),
      sortable: true,
      searchable: true,
      searchValue: (form) => form.accessLevel,
    },
    {
      key: 'sharable',
      header: 'Sharable',
      accessor: (form) => getSharableBadge(form.sharable),
      sortable: true,
      searchable: true,
      searchValue: (form) => form.sharable,
    },
    {
      key: 'createdBy',
      header: 'Created By',
      accessor: (form) => `${form.creator.firstName} ${form.creator.lastName}`,
      sortable: true,
      searchable: true,
      searchValue: (form) => `${form.creator.firstName} ${form.creator.lastName}`,
    },
    {
      key: 'createdAt',
      header: 'Created Date',
      accessor: (form) => new Date(form.createdAt).toLocaleDateString(),
      sortable: true,
      searchable: false,
    },
  ];

  // Define portal form table actions
  const portalFormActions = [
    {
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: (form: PortalForm) => handleViewPortalForm(form),
      variant: 'ghost' as const,
    },
    {
      label: 'Edit',
      icon: <FileEdit className="h-4 w-4" />,
      onClick: (form: PortalForm) => handleEditPortalForm(form),
      variant: 'ghost' as const,
    },
  ];

  if (loading) {
    return <LoadingSpinner message="Loading library files..." />;
  }

  return (
    <PageLayout>
      <PageHeader
        icon={Library}
        title="Library"
        description="Manage shared files and portal forms"
        action={
          canUploadFiles && (
            <div className="flex space-x-2">
              <Button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Upload File</span>
              </Button>
              <Button
                onClick={handleCreatePortalForm}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Create Form</span>
              </Button>
            </div>
          )
        }
      />

      <Tabs defaultValue="files" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="portal-forms">Portal Forms</TabsTrigger>
        </TabsList>
        
        <TabsContent value="files" className="space-y-4">
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
        </TabsContent>
        
        <TabsContent value="portal-forms" className="space-y-4">
          <Table
            data={portalForms}
            columns={portalFormColumns}
            actions={portalFormActions}
            loading={loading}
            emptyMessage={
              <EmptyState
                title="No portal forms found"
                description="Create portal forms to get started"
                icon={FileEdit}
              />
            }
            searchable={true}
            sortable={true}
            pagination={true}
            pageSize={10}
          />
        </TabsContent>
      </Tabs>

      {/* Upload Modal */}
      <UploadFileModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleFileUpload}
        uploading={uploading}
      />

      {/* File Viewer Modal */}
      <FileViewerModal
        isOpen={isViewerModalOpen}
        onClose={handleCloseViewer}
        file={selectedFile}
      />
    </PageLayout>
  );
};

export default LibraryPage;