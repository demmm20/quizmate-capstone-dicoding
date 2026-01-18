import React from 'react';

const Badge = ({
  children,
  variant = 'primary', 
  size = 'md', 
  className = '',
}) => {
  const variants = {
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-cyan-100 text-cyan-800',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const combinedClassName = `
    inline-flex items-center rounded-full font-medium
    ${variants[variant] || variants.primary}
    ${sizes[size] || sizes. md}
    ${className}
  `.trim();

  return <span className={combinedClassName}>{children}</span>;
};

export default Badge;