import { useState, useCallback, useEffect } from 'react';
import { DEFAULT_PAGE_SIZE } from '../config/constants';

/**
 * Custom hook for handling pagination functionality
 * 
 * @param {Object} options - Configuration options
 * @param {number} options.initialPage - Initial page number (default: 1)
 * @param {number} options.initialPageSize - Initial page size (default: from constants)
 * @param {number} options.totalItems - Total number of items (optional)
 * @param {Function} options.onPageChange - Callback when page changes (optional)
 * @param {Function} options.onPageSizeChange - Callback when page size changes (optional)
 * @returns {Object} - Pagination state and functions
 */
const usePagination = ({
  initialPage = 1,
  initialPageSize = DEFAULT_PAGE_SIZE,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
} = {}) => {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalPages, setTotalPages] = useState(
    totalItems ? Math.max(1, Math.ceil(totalItems / initialPageSize)) : 1
  );
  
  // Update total pages when page size or total items change
  useEffect(() => {
    if (totalItems) {
      setTotalPages(Math.max(1, Math.ceil(totalItems / pageSize)));
    }
  }, [totalItems, pageSize]);
  
  // Go to a specific page
  const goToPage = useCallback((newPage) => {
    const validPage = Math.max(1, Math.min(newPage, totalPages));
    
    if (validPage !== page) {
      setPage(validPage);
      
      if (onPageChange) {
        onPageChange(validPage, pageSize);
      }
    }
  }, [page, pageSize, totalPages, onPageChange]);
  
  // Go to next page
  const nextPage = useCallback(() => {
    if (page < totalPages) {
      goToPage(page + 1);
    }
  }, [page, totalPages, goToPage]);
  
  // Go to previous page
  const prevPage = useCallback(() => {
    if (page > 1) {
      goToPage(page - 1);
    }
  }, [page, goToPage]);
  
  // Go to first page
  const firstPage = useCallback(() => {
    goToPage(1);
  }, [goToPage]);
  
  // Go to last page
  const lastPage = useCallback(() => {
    goToPage(totalPages);
  }, [totalPages, goToPage]);
  
  // Change page size
  const changePageSize = useCallback((newSize) => {
    const currentFirstItemIndex = (page - 1) * pageSize + 1;
    const newPage = Math.max(1, Math.ceil(currentFirstItemIndex / newSize));
    
    setPageSize(newSize);
    setPage(newPage);
    
    if (onPageSizeChange) {
      onPageSizeChange(newSize);
    }
    
    if (onPageChange) {
      onPageChange(newPage, newSize);
    }
  }, [page, pageSize, onPageChange, onPageSizeChange]);
  
  // Get pagination metadata for API requests
  const getPaginationParams = useCallback(() => {
    return {
      page,
      size: pageSize,
    };
  }, [page, pageSize]);
  
  // Get current page items from a full array
  const getCurrentItems = useCallback((items) => {
    if (!items || !items.length) return [];
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, items.length);
    
    return items.slice(startIndex, endIndex);
  }, [page, pageSize]);
  
  // Calculate pagination info for display
  const getPaginationInfo = useCallback(() => {
    if (!totalItems) return { start: 0, end: 0, total: 0 };
    
    const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
    const end = Math.min(start + pageSize - 1, totalItems);
    
    return {
      start,
      end,
      total: totalItems,
      currentPage: page,
      totalPages,
      pageSize,
    };
  }, [page, pageSize, totalItems, totalPages]);
  
  // Reset pagination to initial state
  const reset = useCallback(() => {
    setPage(initialPage);
    setPageSize(initialPageSize);
  }, [initialPage, initialPageSize]);
  
  return {
    page,
    pageSize,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    changePageSize,
    getPaginationParams,
    getCurrentItems,
    getPaginationInfo,
    reset,
  };
};

export default usePagination;