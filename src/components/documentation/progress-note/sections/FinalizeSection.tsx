
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { ProgressNoteFormData } from '../types/ProgressNoteFormData';

interface FinalizeSectionProps {
  formData: ProgressNoteFormData;
  updateFormData: (updates: Partial<ProgressNoteFormData>) => void;
  onSave?: (isDraft: boolean) => Promise<void>;
  isLoading?: boolean;
  clientData?: any;
}

const FinalizeSection: React.FC<FinalizeSectionProps> = ({
  formData,
  updateFormData,
  onSave,
  isLoading = false,
  clientData,
}) => {
  const handleFinalize = async () => {
    if (!formData.signature) {
      alert('Please provide your signature before finalizing.');
      return;
    }

    const now = new Date().toISOString();
    updateFormData({
      isFinalized: true,
      signedBy: formData.signature,
      signedAt: now,
    });

    if (onSave) {
      await onSave(false);
    }
  };

  const handleSaveDraft = async () => {
    if (onSave) {
      await onSave(true);
    }
  };

  const clientName = clientData 
    ? `${clientData.first_name} ${clientData.last_name}`
    : 'Unknown Client';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span>Finalize & Sign Progress Note</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Progress Note Summary</h3>
          <div className="space-y-1 text-sm text-blue-800">
            <p><strong>Client:</strong> {clientName}</p>
            <p><strong>Session Date:</strong> {formData.sessionDate}</p>
            <p><strong>Duration:</strong> {formData.duration} minutes</p>
            <p><strong>Service Code:</strong> {formData.serviceCode}</p>
          </div>
        </div>

        {!formData.isFinalized && (
          <>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium">Before finalizing:</p>
                  <ul className="mt-1 space-y-1 list-disc list-inside">
                    <li>Review all sections for completeness and accuracy</li>
                    <li>Ensure all required fields are completed</li>
                    <li>Verify client information and session details</li>
                    <li>Confirm interventions and progress notes are accurate</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="reviewComplete"
                  checked={!!formData.signature}
                  onCheckedChange={(checked) => {
                    if (!checked) {
                      updateFormData({ signature: '' });
                    }
                  }}
                />
                <Label htmlFor="reviewComplete" className="text-sm">
                  I have reviewed this progress note for completeness and accuracy
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signature">Electronic Signature</Label>
                <Input
                  id="signature"
                  value={formData.signature || ''}
                  onChange={(e) => updateFormData({ signature: e.target.value })}
                  placeholder="Type your full name to sign"
                />
                <p className="text-xs text-gray-600">
                  By typing your name, you are providing your electronic signature
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={handleSaveDraft}
                variant="outline"
                disabled={isLoading}
              >
                Save as Draft
              </Button>
              <Button
                onClick={handleFinalize}
                disabled={!formData.signature || isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? 'Finalizing...' : 'Finalize & Sign'}
              </Button>
            </div>
          </>
        )}

        {formData.isFinalized && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">Progress Note Finalized</p>
                <p className="text-sm text-green-800">
                  Signed by: {formData.signedBy} on {new Date(formData.signedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinalizeSection;
