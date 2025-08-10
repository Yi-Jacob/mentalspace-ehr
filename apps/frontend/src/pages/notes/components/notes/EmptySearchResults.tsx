
import React from 'react';

interface EmptySearchResultsProps {
  searchQuery: string;
}

const EmptySearchResults: React.FC<EmptySearchResultsProps> = ({ searchQuery }) => {
  return (
    <div className="text-center py-8">
      <p className="text-gray-500">No notes match your search criteria.</p>
      <p className="text-sm text-gray-400 mt-2">
        Try adjusting your filters or search term.
      </p>
      {searchQuery && (
        <p className="text-xs text-gray-400 mt-1">
          Search term: "{searchQuery}"
        </p>
      )}
    </div>
  );
};

export default EmptySearchResults;
