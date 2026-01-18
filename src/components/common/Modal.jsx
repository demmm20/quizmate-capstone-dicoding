import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

const Modal = ({
  isOpen = false,
  onClose,
  title,
  children,
  size = 'md', 
  showCloseButton = true,
  ... props
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?. ();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      {...props}
    >
      <div className={`bg-white rounded-lg shadow-xl ${sizes[size] || sizes.md} w-full`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          )}
        </div>

        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;