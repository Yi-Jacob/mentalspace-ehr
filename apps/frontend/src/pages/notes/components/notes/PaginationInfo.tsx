
import React from 'react';

interface PaginationInfoProps {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

const PaginationInfo: React.FC<PaginationInfoProps> = ({
  currentPage,
  pageSize,
  totalCount,
  totalPages,
}) => {
  if (totalCount === 0) return null;

  const startItem = ((currentPage - 1) * pageSize) + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="flex justify-between items-center text-sm text-gray-600">
      <span>
        Showing {startItem}-{endItem} of {totalCount} notes
      </span>
      <span>Page {currentPage} of {totalPages}</span>
    </div>
  );
};

export default PaginationInfo;
