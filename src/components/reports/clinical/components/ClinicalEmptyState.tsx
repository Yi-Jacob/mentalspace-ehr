
import React from 'react';

const ClinicalEmptyState: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-center items-center py-12">
        <p className="text-gray-500">No clinical data available</p>
      </div>
    </div>
  );
};

export default ClinicalEmptyState;
