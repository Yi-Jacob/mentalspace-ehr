
import { useState, useMemo } from 'react';

interface PaginationConfig {
  initialPage?: number;
  pageSize?: number;
}

interface PaginationResult<T> {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  paginatedData: T[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  startIndex: number;
  endIndex: number;
}

export const usePagination = <T>(
  data: T[],
  config: PaginationConfig = {}
): PaginationResult<T> => {
  const { initialPage = 1, pageSize = 10 } = config;
  const [currentPage, setCurrentPage] = useState(initialPage);

  const paginationData = useMemo(() => {
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    const paginatedData = data.slice(startIndex, endIndex);

    return {
      totalItems,
      totalPages,
      startIndex,
      endIndex,
      paginatedData,
    };
  }, [data, currentPage, pageSize]);

  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, paginationData.totalPages));
    setCurrentPage(validPage);
  };

  const nextPage = () => {
    if (currentPage < paginationData.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return {
    currentPage,
    pageSize,
    totalPages: paginationData.totalPages,
    totalItems: paginationData.totalItems,
    paginatedData: paginationData.paginatedData,
    goToPage,
    nextPage,
    previousPage,
    canGoNext: currentPage < paginationData.totalPages,
    canGoPrevious: currentPage > 1,
    startIndex: paginationData.startIndex,
    endIndex: paginationData.endIndex,
  };
};
