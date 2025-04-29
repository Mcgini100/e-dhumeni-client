import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import './Modal.css';

/**
 * Modal component for displaying content in an overlay
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true,
  className = '',
  contentClassName = '',
  disableEscapeKey = false,
  disableOverflow = false,
  testId = 'modal',
}) => {
  const modalRef = useRef(null);

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (!disableEscapeKey && e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      if (isOpen) {
        document.body.style.overflow = '';
      }
    };
  }, [isOpen, onClose, disableEscapeKey]);

  // Close modal when clicking outside
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  // Determine modal size classes
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  if (!isOpen) return null;

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity"
      onClick={handleOverlayClick}
      data-testid={testId}
    >
      <div
        className={`bg-white rounded-lg shadow-xl transform transition-all ${
          sizeClasses[size] || sizeClasses.md
        } w-full ${className}`}
        ref={modalRef}
      >
        {/* Modal header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          {showCloseButton && (
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
              aria-label="Close"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Modal content */}
        <div 
          className={`px-6 py-4 ${disableOverflow ? '' : 'overflow-y-auto'} ${contentClassName}`}
          style={{ maxHeight: disableOverflow ? 'none' : 'calc(80vh - 10rem)' }}
        >
          {children}
        </div>

        {/* Modal footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.node,
  children: PropTypes.node,
  footer: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  closeOnOverlayClick: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  disableEscapeKey: PropTypes.bool,
  disableOverflow: PropTypes.bool,
  testId: PropTypes.string,
};

export default Modal;