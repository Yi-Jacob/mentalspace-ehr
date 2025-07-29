
import React from 'react';

const EmptySearchResults: React.FC = () => {
  return (
    <div className="text-center py-8">
      <p className="text-gray-500">No notes match your search criteria.</p>
      <p className="text-sm text-gray-400 mt-2">
        Try adjusting your filters or search term.
      </p>
    </div>
  );
};

export default EmptySearchResults;
