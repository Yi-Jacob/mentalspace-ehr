
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText } from 'lucide-react';
import { TreatmentPlanFormData } from '../types/TreatmentPlanFormData';

interface FinalizeSectionProps {
  formData: TreatmentPlanFormData;
  updateFormData: (updates: Partial<TreatmentPlanFormData>) => void;
  clientData?: any;
}

const FinalizeSection: React.FC<FinalizeSectionProps> = ({
  formData,
  updateFormData,
}) => {
  const handleSignatureChange = (value: string) => {
    updateFormData({ 
      signature: value,
      signedBy: value,
      signedAt: value ? new Date().toISOString() : ''
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Digital Signature
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertDescription>
              By signing this treatment plan, you certify that the information is accurate and complete,
              and that the services outlined are medically necessary for the client's treatment.
            </AlertDescription>
          </Alert>

          <div>
            <Label htmlFor="signature">Electronic Signature *</Label>
            <Input
              id="signature"
              value={formData.signature}
              onChange={(e) => handleSignatureChange(e.target.value)}
              placeholder="Type your full name as your electronic signature"
            />
            <p className="text-sm text-gray-600 mt-1">
              Type your full name to serve as your electronic signature
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="finalize"
              checked={formData.isFinalized}
              onCheckedChange={(checked) => 
                updateFormData({ isFinalized: checked as boolean })
              }
              disabled={!formData.signature}
            />
            <Label htmlFor="finalize" className="text-sm">
              I certify this treatment plan is complete and ready for implementation
            </Label>
          </div>

          {formData.signature && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Signature Preview</h4>
              <p className="text-green-800">Electronically signed by: {formData.signature}</p>
              {formData.signedAt && (
                <p className="text-sm text-green-700">
                  Signed on: {new Date(formData.signedAt).toLocaleString()}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FinalizeSection;
