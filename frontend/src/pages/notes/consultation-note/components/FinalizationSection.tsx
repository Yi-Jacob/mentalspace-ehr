
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { ConsultationNoteFormData } from '../types/ConsultationNoteFormData';

interface FinalizationSectionProps {
  formData: Pick<ConsultationNoteFormData, 'signature' | 'isFinalized' | 'signedBy' | 'signedAt'>;
  updateFormData: (updates: Partial<ConsultationNoteFormData>) => void;
}

const FinalizationSection: React.FC<FinalizationSectionProps> = ({
  formData,
  updateFormData,
}) => {
  if (formData.isFinalized) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <div>
            <p className="font-medium text-green-900">Note Finalized</p>
            <p className="text-sm text-green-800">
              Signed by: {formData.signedBy} on {formData.signedAt && new Date(formData.signedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 border-t pt-6">
      <h3 className="text-lg font-semibold text-gray-900">Finalize Note</h3>
      
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          By signing this note, you certify that the information is accurate and complete.
        </AlertDescription>
      </Alert>

      <div>
        <Label htmlFor="signature">Electronic Signature</Label>
        <Input
          id="signature"
          value={formData.signature}
          onChange={(e) => updateFormData({ signature: e.target.value })}
          placeholder="Type your full name to sign"
        />
      </div>
    </div>
  );
};

export default FinalizationSection;
