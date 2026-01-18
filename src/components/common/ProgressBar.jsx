import React from 'react';

const ProgressBar = ({
  value = 0, 
  showLabel = true,
  animated = true,
  variant = 'primary', 
  size = 'md', 
  label,
  className = '',
}) => {
  const variants = {
    primary: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600',
  };

  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const clampedValue = Math.min(Math.max(value, 0), 100);
  const animationClass = animated ? 'transition-all duration-300' : '';

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          <span className="text-sm font-medium text-gray-600">{clampedValue}%</span>
        </div>
      )}
      
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizes[size] || sizes.md}`}>
        <div
          className={`${variants[variant] || variants.primary} ${sizes[size] || sizes.md} rounded-full ${animationClass}`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;