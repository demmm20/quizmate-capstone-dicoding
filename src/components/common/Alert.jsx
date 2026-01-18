import React, { useEffect } from "react";
import Swal from "sweetalert2"; // Impor SweetAlert2
import {
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";

const Alert = ({
  type = "info", // success, error, warning, info
  title,
  message,
  onClose,
  dismissible = true,
  className = "",
}) => {
  const types = {
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      icon: "text-green-600",
      title: "text-green-900",
      message: "text-green-800",
      Icon: CheckCircleIcon,
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: "text-red-600",
      title: "text-red-900",
      message: "text-red-800",
      Icon: ExclamationTriangleIcon,
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      icon: "text-yellow-600",
      title: "text-yellow-900",
      message: "text-yellow-800",
      Icon: ExclamationTriangleIcon,
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: "text-blue-600",
      title: "text-blue-900",
      message: "text-blue-800",
      Icon: InformationCircleIcon,
    },
  };

  const config = types[type] || types.info;
  const {
    bg,
    border,
    icon,
    title: titleClass,
    message: messageClass,
    Icon,
  } = config;

  // Trigger SweetAlert2 when the component is rendered
  useEffect(() => {
    if (message) {
      Swal.fire({
        icon: type,
        title: title || "Alert",
        text: message,
        confirmButtonText: "OK",
      });
    }
  }, [message, type, title]);

  return (
    <div
      className={`${bg} border ${border} rounded-lg p-4 flex gap-4 ${className}`}
    >
      <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${icon}`} />

      <div className="flex-1">
        {title && <h3 className={`font-medium ${titleClass}`}>{title}</h3>}
        {message && <p className={`text-sm mt-1 ${messageClass}`}>{message}</p>}
      </div>

      {dismissible && onClose && (
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 shrink-0"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default Alert;
