
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { ProgressNoteFormData } from '@/types/noteType';

interface FinalizedStatusProps {
  formData: ProgressNoteFormData;
}

const FinalizedStatus: React.FC<FinalizedStatusProps> = ({ formData }) => {
  return (
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
  );
};

export default FinalizedStatus;
