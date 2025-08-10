
import React from 'react';

interface PaginationInfoProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const PaginationInfo: React.FC<PaginationInfoProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
}) => {
  if (totalItems === 0) return null;

  const startItem = ((currentPage - 1) * itemsPerPage) + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex justify-between items-center text-sm text-gray-600">
      <span>
        Showing {startItem}-{endItem} of {totalItems} notes
      </span>
      <span>Page {currentPage} of {totalPages}</span>
    </div>
  );
};

export default PaginationInfo;
