
import React from 'react';

const ClinicalLoadingState: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading clinical reports...</span>
      </div>
    </div>
  );
};

export default ClinicalLoadingState;
