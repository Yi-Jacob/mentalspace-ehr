import React, { useState, useEffect } from 'react';
import { X, Download, FileText, Image, File } from 'lucide-react';
import { Button } from '@/components/basic/button';
import { useToast } from '@/hooks/use-toast';
import { LibraryFile, libraryService } from '@/services/libraryService';

interface FileViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: LibraryFile | null;
}

const FileViewerModal: React.FC<FileViewerModalProps> = ({
  isOpen,
  onClose,
  file,
}) => {
  const [viewUrl, setViewUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && file) {
      fetchViewUrl();
    } else {
      setViewUrl('');
      setError('');
    }
  }, [isOpen, file]);

  const fetchViewUrl = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setError('');
      const response = await libraryService.getViewUrl(file.id);
      setViewUrl(response.viewUrl);
    } catch (error) {
      console.error('Error fetching view URL:', error);
      setError('Failed to load file');
      toast({
        title: "Error",
        description: "Failed to load file for viewing",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!file) return;

    try {
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

  const getFileIcon = (mimeType?: string) => {
    if (!mimeType) return <File className="h-8 w-8 text-gray-400" />;
    
    if (mimeType.startsWith('image/')) {
      return <Image className="h-8 w-8 text-blue-500" />;
    } else if (mimeType === 'application/pdf') {
      return <FileText className="h-8 w-8 text-red-500" />;
    } else {
      return <File className="h-8 w-8 text-gray-400" />;
    }
  };

  const getFileExtension = (fileName: string) => {
    return fileName.split('.').pop()?.toLowerCase();
  };

  const canEmbedFile = (mimeType?: string, fileName?: string) => {
    // If we have a MIME type, use it
    if (mimeType) {
      return (
        mimeType === 'application/pdf' ||
        mimeType.startsWith('image/') ||
        mimeType.startsWith('text/') ||
        mimeType === 'application/json' ||
        mimeType === 'text/plain' ||
        mimeType === 'text/html' ||
        mimeType === 'text/css' ||
        mimeType === 'text/javascript' ||
        mimeType === 'application/msword' ||
        mimeType.includes('officedocument') ||
        mimeType === 'application/vnd.ms-excel' ||
        mimeType === 'application/vnd.ms-powerpoint'
      );
    }

    // Fallback to file extension if MIME type is missing
    if (fileName) {
      const extension = getFileExtension(fileName);
      const embeddableExtensions = [
        'pdf', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg',
        'txt', 'html', 'css', 'js', 'json', 'xml', 'csv',
        'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'
      ];
      return embeddableExtensions.includes(extension || '');
    }

    return false;
  };

  const renderFileContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading file...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <File className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchViewUrl} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    if (!viewUrl) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-gray-400 mb-4">
              <File className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-gray-600">No file to display</p>
          </div>
        </div>
      );
    }

    if (!canEmbedFile(file?.mimeType, file?.fileName)) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            {getFileIcon(file?.mimeType)}
            <p className="text-gray-600 mt-4 mb-4">
              This file type cannot be previewed in the browser.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              MIME Type: {file?.mimeType || 'Unknown'}
            </p>
            <Button onClick={handleDownload} className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Download to View</span>
            </Button>
          </div>
        </div>
      );
    }

    // Render embeddable content
    const extension = getFileExtension(file.fileName);
    const isPdf = file.mimeType === 'application/pdf' || extension === 'pdf';
    const isImage = file.mimeType?.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(extension || '');
    const isText = file.mimeType?.startsWith('text/') || file.mimeType === 'application/json' || ['txt', 'html', 'css', 'js', 'json', 'xml', 'csv'].includes(extension || '');
    
    // Office documents that can be viewed with Microsoft Office Online
    const isOfficeDoc = file.mimeType?.includes('officedocument') || 
                       file.mimeType === 'application/msword' ||
                       ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(extension || '');

    if (isPdf) {
      return (
        <iframe
          src={viewUrl}
          className="w-full h-full border-0"
          title={file.fileName}
        />
      );
    } else if (isImage) {
      return (
        <div className="flex items-center justify-center h-full">
          <img
            src={viewUrl}
            alt={file.fileName}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      );
    } else if (isText) {
      return (
        <iframe
          src={viewUrl}
          className="w-full h-full border-0"
          title={file.fileName}
        />
      );
    } else if (isOfficeDoc) {
      // For Office documents, we'll use Microsoft Office Online viewer
      // This requires the file to be publicly accessible, so we'll show a message
      // with options to download or open in Office Online
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-md">
            <div className="mb-4">
              <FileText className="h-16 w-16 text-blue-500 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Office Document
            </h3>
            <p className="text-gray-600 mb-6">
              This is a Microsoft Office document. You can download it to view in your preferred application.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={handleDownload} 
                className="w-full flex items-center justify-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download Document</span>
              </Button>
              <Button 
                onClick={() => window.open(`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(viewUrl)}`, '_blank')}
                variant="outline"
                className="w-full flex items-center justify-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>Open in Office Online</span>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          {getFileIcon(file.mimeType)}
          <p className="text-gray-600 mt-4">Preview not available for this file type</p>
        </div>
      </div>
    );
  };

  if (!isOpen || !file) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            {getFileIcon(file.mimeType)}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 truncate max-w-md">
                {file.fileName}
              </h2>
              <p className="text-sm text-gray-500">
                {file.fileSize ? `${(file.fileSize / 1024).toFixed(1)} KB` : 'Unknown size'} • 
                {file.mimeType || 'Unknown MIME type'} • 
                {getFileExtension(file.fileName) || 'No extension'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleDownload}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Close</span>
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {renderFileContent()}
        </div>
      </div>
    </div>
  );
};

export default FileViewerModal;
