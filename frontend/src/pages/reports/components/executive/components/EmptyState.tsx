
import React from 'react';

const EmptyState: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-center items-center py-12">
        <p className="text-gray-500">No dashboard data available</p>
      </div>
    </div>
  );
};

export default EmptyState;
