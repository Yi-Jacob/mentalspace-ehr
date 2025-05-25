
import React from 'react';

const DiagnosisGuidelines: React.FC = () => {
  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      <h4 className="font-medium text-blue-800 mb-2">Diagnosis Guidelines</h4>
      <p className="text-blue-700 text-sm">
        Search and select appropriate ICD-10/DSM-5 diagnoses based on your clinical assessment. 
        You can search by code or description. Select one primary diagnosis and add additional 
        secondary diagnoses as needed.
      </p>
    </div>
  );
};

export default DiagnosisGuidelines;
