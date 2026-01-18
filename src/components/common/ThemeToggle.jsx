import React from "react";

const ThemeToggle = ({ isDark, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`
        w-16 h-8 rounded-full flex items-center px-1 transition-all duration-300
        ${isDark ? "bg-gray-700" : "bg-blue-300"}
      `}
    >
      <div
        className={`
          w-6 h-6 rounded-full bg-white shadow-md transform transition-all duration-300
          flex items-center justify-center cursor-pointer
          ${isDark ? "translate-x-8" : "translate-x-0"}
        `}
      >
        {isDark ? (
          <span className="text-yellow-300 text-base">🌙</span>
        ) : (
          <span className="text-yellow-500 text-base">☀️</span>
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
