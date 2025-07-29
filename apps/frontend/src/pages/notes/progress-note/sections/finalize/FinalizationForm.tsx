
import React from 'react';
import { Button } from '@/components/basic/button';
import { Checkbox } from '@/components/basic/checkbox';
import { Label } from '@/components/basic/label';
import { Input } from '@/components/basic/input';
import { AlertTriangle } from 'lucide-react';
import { ProgressNoteFormData } from '../../types/ProgressNoteFormData';

interface FinalizationFormProps {
  formData: ProgressNoteFormData;
  updateFormData: (updates: Partial<ProgressNoteFormData>) => void;
  allSectionsComplete: boolean;
  onFinalize: () => Promise<void>;
  onSaveDraft: () => Promise<void>;
  isLoading: boolean;
}

const FinalizationForm: React.FC<FinalizationFormProps> = ({
  formData,
  updateFormData,
  allSectionsComplete,
  onFinalize,
  onSaveDraft,
  isLoading,
}) => {
  return (
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
            disabled={!allSectionsComplete}
          />
          <Label htmlFor="reviewComplete" className={`text-sm ${!allSectionsComplete ? 'text-gray-400' : ''}`}>
            I have reviewed this progress note for completeness and accuracy
          </Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signature" className={!allSectionsComplete ? 'text-gray-400' : ''}>
            Electronic Signature
          </Label>
          <Input
            id="signature"
            value={formData.signature || ''}
            onChange={(e) => updateFormData({ signature: e.target.value })}
            placeholder="Type your full name to sign"
            disabled={!allSectionsComplete}
            className={!allSectionsComplete ? 'bg-gray-100' : ''}
          />
          <p className={`text-xs ${!allSectionsComplete ? 'text-gray-400' : 'text-gray-600'}`}>
            By typing your name, you are providing your electronic signature
          </p>
        </div>
      </div>

      <div className="flex space-x-3">
        <Button
          onClick={onSaveDraft}
          variant="outline"
          disabled={isLoading}
        >
          Save as Draft
        </Button>
        <Button
          onClick={onFinalize}
          disabled={!allSectionsComplete || !formData.signature || isLoading}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
        >
          {isLoading ? 'Finalizing...' : 'Finalize & Sign'}
        </Button>
      </div>
    </>
  );
};

export default FinalizationForm;
