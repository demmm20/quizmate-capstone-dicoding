import React from "react";

const Card = ({
  children,
  className = "",
  title,
  description,
  bordered = false,
  shadow = "lg",
  padding = "md",
  ...props
}) => {
  const shadowClasses = {
    none: "shadow-none",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  };

  const paddingClasses = {
    sm: "p-3",
    md: "p-6",
    lg: "p-8",
  };

  const borderClass = bordered ? "border border-gray-200" : "";

  const combinedClassName = `
    ${shadowClasses[shadow] || shadowClasses.lg}
    ${paddingClasses[padding] || paddingClasses.md}
    ${borderClass}
    ${className}
  `.trim();

  return (
    <div className={combinedClassName} {...props}>
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
