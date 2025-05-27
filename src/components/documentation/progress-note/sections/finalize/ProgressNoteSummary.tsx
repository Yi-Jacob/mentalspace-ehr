
import React from 'react';
import { ProgressNoteFormData } from '../../types/ProgressNoteFormData';

interface ProgressNoteSummaryProps {
  formData: ProgressNoteFormData;
  clientData?: any;
}

const ProgressNoteSummary: React.FC<ProgressNoteSummaryProps> = ({
  formData,
  clientData,
}) => {
  const clientName = clientData 
    ? `${clientData.first_name} ${clientData.last_name}`
    : 'Unknown Client';

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 className="font-medium text-blue-900 mb-2">Progress Note Summary</h3>
      <div className="space-y-1 text-sm text-blue-800">
        <p><strong>Client:</strong> {clientName}</p>
        <p><strong>Session Date:</strong> {formData.sessionDate}</p>
        <p><strong>Duration:</strong> {formData.duration} minutes</p>
        <p><strong>Service Code:</strong> {formData.serviceCode}</p>
      </div>
    </div>
  );
};

export default ProgressNoteSummary;
