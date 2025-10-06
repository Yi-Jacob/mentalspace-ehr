import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/basic/button';
import { Textarea } from '@/components/basic/textarea';
import { SelectField, SelectOption } from '@/components/basic/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/basic/dialog';
import { useToast } from '@/hooks/use-toast';
import { clientFilesService, ShareableFileDto, ShareFileDto } from '@/services/clientFilesService';
import LoadingSpinner from '@/components/LoadingSpinner';

interface ShareDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  onFileShared: () => void;
}

const ShareDocumentModal: React.FC<ShareDocumentModalProps> = ({
  isOpen,
  onClose,
  clientId,
  onFileShared,
}) => {
  const [files, setFiles] = useState<ShareableFileDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string>('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchShareableFiles();
    }
  }, [isOpen]);

  const fetchShareableFiles = async () => {
    try {
      setLoading(true);
      const filesData = await clientFilesService.getShareableFiles(clientId);
      setFiles(filesData);
    } catch (error) {
      console.error('Error fetching shareable files:', error);
      toast({
        title: "Error",
        description: "Failed to load shareable files",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShareFile = async () => {
    if (!selectedFileId) return;

    try {
      setSharing(true);
      const shareData: ShareFileDto = {
        fileId: selectedFileId,
        notes: notes.trim() || undefined,
      };

      await clientFilesService.shareFile(clientId, shareData);
      
      toast({
        title: "Success",
        description: "Document shared successfully",
      });

      onFileShared();
      onClose();
      setSelectedFileId('');
      setNotes('');
    } catch (error) {
      console.error('Error sharing file:', error);
      toast({
        title: "Error",
        description: "Failed to share document",
        variant: "destructive",
      });
    } finally {
      setSharing(false);
    }
  };

  const handleClose = () => {
    setSelectedFileId('');
    setNotes('');
    onClose();
  };

  // Get selected file details
  const selectedFile = files.find(file => file.id === selectedFileId);

  // Convert files to select options
  const fileOptions: SelectOption[] = files.map(file => ({
    value: file.id,
    label: `${file.fileName} (${file.creator.firstName} ${file.creator.lastName})`
  }));


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Share Document</DialogTitle>
          <DialogDescription className="text-gray-600">
            Select a document to share with the client and add optional notes.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {/* File Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Select Document to Share
              </label>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : (
                <SelectField
                  value={selectedFileId}
                  onValueChange={setSelectedFileId}
                  placeholder="Choose a document to share..."
                  options={fileOptions}
                  disabled={loading || fileOptions.length === 0}
                />
              )}
              {!loading && fileOptions.length === 0 && (
                <p className="text-sm text-gray-500 italic">
                  No shareable documents available
                </p>
              )}
            </div>

            {/* Selected File Info */}
            {selectedFile && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-gray-400 mr-4" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {selectedFile.fileName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Created by {selectedFile.creator.firstName} {selectedFile.creator.lastName}
                    </p>
                    {selectedFile.fileSize && (
                      <p className="text-sm text-gray-500">
                        {(selectedFile.fileSize / 1024).toFixed(1)} KB
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Notes Input */}
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium text-gray-700">
                Notes (Optional)
              </label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this document..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={sharing}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleShareFile}
            disabled={sharing || !selectedFileId}
            className="flex-1 flex items-center space-x-2"
          >
            {sharing ? (
              <LoadingSpinner />
            ) : (
              <FileText className="h-4 w-4" />
            )}
            <span>Share Document</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDocumentModal;
