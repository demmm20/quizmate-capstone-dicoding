

import React from 'react';

const AnswerOption = ({
  option,
  index,
  isSelected = false,
  isCorrect,
  isSubmitted = false,
  onClick,
}) => {
  const getStateClass = () => {
    if (! isSubmitted) {
      return isSelected
        ? 'border-blue-500 bg-blue-50'
        : 'border-gray-200 hover:border-gray-300 bg-white';
    }

    if (isCorrect) {
      return 'border-green-500 bg-green-50';
    }
    if (isSelected && !isCorrect) {
      return 'border-red-500 bg-red-50';
    }
    return 'border-gray-200 bg-white';
  };

  const getIndicatorClass = () => {
    if (!isSubmitted) {
      return isSelected
        ? 'border-blue-500 bg-blue-500'
        : 'border-gray-300 bg-white';
    }

    if (isCorrect) {
      return 'border-green-500 bg-green-500';
    }
    if (isSelected && !isCorrect) {
      return 'border-red-500 bg-red-500';
    }
    return 'border-gray-300 bg-white';
  };

  return (
    <button
      onClick={onClick}
      disabled={isSubmitted}
      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${getStateClass()}`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${getIndicatorClass()}`}>
          {isSubmitted && isCorrect && <span className="text-white text-sm font-bold">✓</span>}
          {isSubmitted && isSelected && !isCorrect && <span className="text-white text-sm font-bold">✕</span>}
          {!isSubmitted && isSelected && <span className="text-white text-sm font-bold">✓</span>}
        </div>
        <span className="text-gray-900">{option}</span>
      </div>
    </button>
  );
};

export default AnswerOption;