import React from 'react';
import PropTypes from 'prop-types';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/outline';
import './Pagination.css';

/**
 * Pagination component for navigating between pages of data
 */
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLastButtons = true,
  showPageNumbers = true,
  maxVisiblePages = 5,
  size = 'md',
  className = '',
  disabled = false,
  showPageSizeSelector = false,
  pageSize = 10,
  pageSizeOptions = [5, 10, 25, 50, 100],
  onPageSizeChange,
  totalItems,
  siblingCount = 1,
}) => {
  // Size classes for buttons
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  const buttonSize = sizeClasses[size] || sizeClasses.md;

  // Create array of visible page numbers
  const getPageNumbers = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Calculate range with dots
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    if (!showLeftDots && showRightDots) {
      // Show pages at the start with dots at end
      const leftItemCount = 3 + 2 * siblingCount;
      return [
        ...Array.from({ length: leftItemCount }, (_, i) => i + 1),
        'dots',
        totalPages,
      ];
    }

    if (showLeftDots && !showRightDots) {
      // Show pages at the end with dots at start
      const rightItemCount = 3 + 2 * siblingCount;
      return [
        1,
        'dots',
        ...Array.from(
          { length: rightItemCount },
          (_, i) => totalPages - rightItemCount + i + 1
        ),
      ];
    }

    if (showLeftDots && showRightDots) {
      // Show pages in the middle with dots on both sides
      return [
        1,
        'dots',
        ...Array.from(
          { length: rightSiblingIndex - leftSiblingIndex + 1 },
          (_, i) => leftSiblingIndex + i
        ),
        'dots',
        totalPages,
      ];
    }
  };

  // Render a single page button
  const renderPageButton = (pageNum, label, isActive = false, isDisabled = false) => {
    const isCurrentPage = isActive || pageNum === currentPage;
    
    return (
      <button
        key={pageNum === 'dots' ? `dots-${label}` : pageNum}
        onClick={() => pageNum !== 'dots' && onPageChange(pageNum)}
        disabled={isDisabled || pageNum === 'dots' || disabled}
        aria-current={isCurrentPage ? 'page' : undefined}
        className={`relative ${buttonSize} flex items-center justify-center rounded-md text-sm font-medium
          ${isCurrentPage
            ? 'bg-primary-600 text-white hover:bg-primary-700'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }
          ${(isDisabled || disabled) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${pageNum === 'dots' ? 'cursor-default hover:bg-transparent' : ''}
        `}
        aria-label={typeof label === 'string' ? label : `Page ${pageNum}`}
      >
        {pageNum === 'dots' ? '...' : label || pageNum}
      </button>
    );
  };

  // Pagination info text displaying range and total
  const renderPaginationInfo = () => {
    if (!totalItems) return null;
    
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);
    
    return (
      <div className="text-sm text-gray-700 dark:text-gray-300">
        <span className="font-medium">{start}</span> - <span className="font-medium">{end}</span> of{' '}
        <span className="font-medium">{totalItems}</span> items
      </div>
    );
  };

  // Page size selector
  const renderPageSizeSelector = () => {
    if (!showPageSizeSelector) return null;
    
    return (
      <div className="flex items-center">
        <label htmlFor="page-size" className="text-sm text-gray-700 dark:text-gray-300 mr-2">
          Show
        </label>
        <select
          id="page-size"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          disabled={disabled}
          className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600"
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 ${className}`}>
      {/* Page size selector and pagination info */}
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
        {renderPageSizeSelector()}
        {renderPaginationInfo()}
      </div>
      
      {/* Pagination controls */}
      <nav className="flex items-center justify-center space-x-1" aria-label="Pagination">
        {/* First page button */}
        {showFirstLastButtons && (
          renderPageButton(
            1,
            <ChevronDoubleLeftIcon className="h-4 w-4" />,
            false,
            currentPage === 1 || disabled
          )
        )}
        
        {/* Previous page button */}
        {renderPageButton(
          currentPage - 1,
          <ChevronLeftIcon className="h-4 w-4" />,
          false,
          currentPage === 1 || disabled
        )}
        
        {/* Page numbers */}
        {showPageNumbers && getPageNumbers().map((pageNum) => 
          renderPageButton(pageNum, null, pageNum === currentPage)
        )}
        
        {/* Next page button */}
        {renderPageButton(
          currentPage + 1,
          <ChevronRightIcon className="h-4 w-4" />,
          false,
          currentPage === totalPages || disabled
        )}
        
        {/* Last page button */}
        {showFirstLastButtons && (
          renderPageButton(
            totalPages,
            <ChevronDoubleRightIcon className="h-4 w-4" />,
            false,
            currentPage === totalPages || disabled
          )
        )}
      </nav>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  showFirstLastButtons: PropTypes.bool,
  showPageNumbers: PropTypes.bool,
  maxVisiblePages: PropTypes.number,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  showPageSizeSelector: PropTypes.bool,
  pageSize: PropTypes.number,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
  onPageSizeChange: PropTypes.func,
  totalItems: PropTypes.number,
  siblingCount: PropTypes.number,
};

export default Pagination;