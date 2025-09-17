import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Button } from '@/components/basic/button';
import { Textarea } from '@/components/basic/textarea';
import { Label } from '@/components/basic/label';
import { CheckCircle, Save, FileText } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface FinalizeSectionProps {
  formData: any;
  updateFormData: (updates: any) => void;
  onSave: (isDraft: boolean) => void;
  onSaveDraft: () => void;
  isLoading?: boolean;
  noteType: string;
}

const FinalizeSection: React.FC<FinalizeSectionProps> = ({
  formData,
  updateFormData,
  onSave,
  onSaveDraft,
  isLoading = false,
  noteType
}) => {
  const { user } = useAuth();

  const handleInputChange = (field: string, value: any) => {
    updateFormData({ [field]: value });
  };

  const handleFinalize = () => {
    // Set the signedBy field to current user's ID
    updateFormData({ 
      signedBy: user?.id || '',
      signedAt: new Date().toISOString(),
      isFinalized: true 
    });
    onSave(false); // false means not a draft (finalize)
  };

  const isFormValid = () => {
    // Basic validation - can be extended for specific note types
    return formData.signature && formData.signature.trim().length > 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Finalize {noteType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Signature Section */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="signature">Provider Signature</Label>
            <Textarea
              id="signature"
              placeholder="Enter your signature or initials..."
              value={formData.signature || ''}
              onChange={(e) => handleInputChange('signature', e.target.value)}
              rows={3}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={onSaveDraft}
            variant="outline"
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          
          <Button
            onClick={handleFinalize}
            disabled={!isFormValid() || isLoading}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <FileText className="h-4 w-4" />
            Finalize & Sign
          </Button>
        </div>

        {/* Status Information */}
        {formData.isFinalized && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Note Finalized</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              This note has been finalized and signed by {user?.firstName} {user?.lastName}.
            </p>
          </div>
        )}

        {/* Validation Messages */}
        {!isFormValid() && (
          <div className="text-sm text-amber-600">
            Please provide a signature before finalizing the note.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinalizeSection;
