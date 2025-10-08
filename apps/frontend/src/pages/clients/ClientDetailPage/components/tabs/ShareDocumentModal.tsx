import React, { useState, useEffect } from 'react';
import { FileText, FileEdit } from 'lucide-react';
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
  const [portalForms, setPortalForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string>('');
  const [selectedPortalFormId, setSelectedPortalFormId] = useState<string>('');
  const [shareType, setShareType] = useState<'file' | 'portal-form'>('file');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchShareableData();
    }
  }, [isOpen]);

  const fetchShareableData = async () => {
    try {
      setLoading(true);
      const [filesData, portalFormsData] = await Promise.all([
        clientFilesService.getShareableFiles(clientId),
        clientFilesService.getShareablePortalForms(clientId)
      ]);
      setFiles(filesData);
      setPortalForms(portalFormsData);
    } catch (error) {
      console.error('Error fetching shareable data:', error);
      toast({
        title: "Error",
        description: "Failed to load shareable items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (shareType === 'file' && !selectedFileId) return;
    if (shareType === 'portal-form' && !selectedPortalFormId) return;

    try {
      setSharing(true);
      
      if (shareType === 'file') {
        const shareData: ShareFileDto = {
          fileId: selectedFileId,
          notes: notes.trim() || undefined,
        };
        await clientFilesService.shareFile(clientId, shareData);
      } else {
        const shareData = {
          portalFormId: selectedPortalFormId,
          notes: notes.trim() || undefined,
        };
        await clientFilesService.sharePortalForm(clientId, shareData);
      }
      
      toast({
        title: "Success",
        description: "Item shared successfully",
      });

      onFileShared();
      onClose();
      setSelectedFileId('');
      setSelectedPortalFormId('');
      setNotes('');
    } catch (error) {
      console.error('Error sharing item:', error);
      toast({
        title: "Error",
        description: "Failed to share item",
        variant: "destructive",
      });
    } finally {
      setSharing(false);
    }
  };

  const handleClose = () => {
    setSelectedFileId('');
    setSelectedPortalFormId('');
    setNotes('');
    setShareType('file');
    onClose();
  };

  // Get selected item details
  const selectedFile = files.find(file => file.id === selectedFileId);
  const selectedPortalForm = portalForms.find(form => form.id === selectedPortalFormId);

  // Convert items to select options
  const fileOptions: SelectOption[] = files.map(file => ({
    value: file.id,
    label: `${file.fileName} (${file.creator.firstName} ${file.creator.lastName})`
  }));

  const portalFormOptions: SelectOption[] = portalForms.map(form => ({
    value: form.id,
    label: `${form.title} (${form.creator.firstName} ${form.creator.lastName})`
  }));


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Share Document</DialogTitle>
          <DialogDescription className="text-gray-600">
            Select a document or portal form to share with the client and add optional notes.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {/* Share Type Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Share Type
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="shareType"
                    value="file"
                    checked={shareType === 'file'}
                    onChange={(e) => setShareType(e.target.value as 'file' | 'portal-form')}
                    className="rounded"
                  />
                  <span className="text-sm">Document</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="shareType"
                    value="portal-form"
                    checked={shareType === 'portal-form'}
                    onChange={(e) => setShareType(e.target.value as 'file' | 'portal-form')}
                    className="rounded"
                  />
                  <span className="text-sm">Portal Form</span>
                </label>
              </div>
            </div>

            {/* Item Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Select {shareType === 'file' ? 'Document' : 'Portal Form'} to Share
              </label>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : (
                <SelectField
                  value={shareType === 'file' ? selectedFileId : selectedPortalFormId}
                  onValueChange={shareType === 'file' ? setSelectedFileId : setSelectedPortalFormId}
                  placeholder={`Choose a ${shareType === 'file' ? 'document' : 'portal form'} to share...`}
                  options={shareType === 'file' ? fileOptions : portalFormOptions}
                  disabled={loading || (shareType === 'file' ? fileOptions.length === 0 : portalFormOptions.length === 0)}
                />
              )}
              {!loading && (
                (shareType === 'file' && fileOptions.length === 0) || 
                (shareType === 'portal-form' && portalFormOptions.length === 0)
              ) && (
                <p className="text-sm text-gray-500 italic">
                  No shareable {shareType === 'file' ? 'documents' : 'portal forms'} available
                </p>
              )}
            </div>

            {/* Selected Item Info */}
            {(selectedFile || selectedPortalForm) && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  {shareType === 'file' ? (
                    <FileText className="h-8 w-8 text-gray-400 mr-4" />
                  ) : (
                    <FileEdit className="h-8 w-8 text-gray-400 mr-4" />
                  )}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {shareType === 'file' ? selectedFile?.fileName : selectedPortalForm?.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Created by {shareType === 'file' ? 
                        `${selectedFile?.creator.firstName} ${selectedFile?.creator.lastName}` :
                        `${selectedPortalForm?.creator.firstName} ${selectedPortalForm?.creator.lastName}`
                      }
                    </p>
                    {shareType === 'file' && selectedFile?.fileSize && (
                      <p className="text-sm text-gray-500">
                        {(selectedFile.fileSize / 1024).toFixed(1)} KB
                      </p>
                    )}
                    {shareType === 'portal-form' && selectedPortalForm?.description && (
                      <p className="text-sm text-gray-500">
                        {selectedPortalForm.description}
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
            onClick={handleShare}
            disabled={sharing || (shareType === 'file' ? !selectedFileId : !selectedPortalFormId)}
            className="flex-1 flex items-center space-x-2"
          >
            {sharing ? (
              <LoadingSpinner />
            ) : (
              shareType === 'file' ? <FileText className="h-4 w-4" /> : <FileEdit className="h-4 w-4" />
            )}
            <span>Share {shareType === 'file' ? 'Document' : 'Portal Form'}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDocumentModal;
