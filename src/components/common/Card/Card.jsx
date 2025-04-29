import React from 'react';

/**
 * Card Component
 * A flexible container component with optional header and footer
 * 
 * @param {Object} props - Component props
 * @param {string} [props.title] - Card title
 * @param {React.ReactNode} [props.headerAction] - Action element in header (button, link, etc.)
 * @param {React.ReactNode} props.children - Card content
 * @param {React.ReactNode} [props.footer] - Footer content
 * @param {string} [props.className] - Additional CSS classes for the card
 * @param {string} [props.bodyClassName] - Additional CSS classes for the card body
 * @returns {JSX.Element} Card component
 */
const Card = ({
  title,
  headerAction,
  children,
  footer,
  className = '',
  bodyClassName = '',
}) => {
  const hasHeader = title || headerAction;
  
  return (
    <div className={`bg-white overflow-hidden shadow-card rounded-card ${className}`}>
      {hasHeader && (
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
          {title && (
            <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
          )}
          {headerAction && (
            <div className="ml-2">{headerAction}</div>
          )}
        </div>
      )}
      
      <div className={`px-4 py-5 sm:p-6 ${bodyClassName}`}>
        {children}
      </div>
      
      {footer && (
        <div className="px-4 py-4 sm:px-6 border-t border-gray-200 bg-gray-50">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;