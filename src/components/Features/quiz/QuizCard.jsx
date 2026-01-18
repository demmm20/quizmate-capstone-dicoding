import React, { useEffect, useRef } from 'react';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/solid';

const QuizCard = ({ question, selectedAnswer, onSelectAnswer, questionNumber, totalQuestions, locked }) => {
  if (!question) return null;

  const options = question.multiple_choice || [];
  const reveal = selectedAnswer !== undefined && selectedAnswer !== null;
  const selectedOption = reveal ? options[selectedAnswer] : null;
  const feedbackRef = useRef(null);

  useEffect(() => {
    if (reveal && feedbackRef.current) {
      const el = feedbackRef.current;
      const doScroll = () => {
        try {
          el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        } catch {
          const rect = el.getBoundingClientRect();
          const target = rect.top + window.scrollY - 120;
          window.scrollTo({ top: target, behavior: 'smooth' });
        }
      };
      requestAnimationFrame(doScroll);
    }
  }, [reveal, selectedAnswer]);

  const getOptionStyle = (option, isSelected) => {
    if (!reveal) {
      return {
        wrapper: 'border border-gray-200 hover:border-gray-300 bg-white text-gray-900',
        dot: 'border-gray-300',
        label: 'text-gray-900',
      };
    }

    if (option.correct) {
      return {
        wrapper: 'border border-green-500 bg-green-50 text-green-800',
        dot: 'border-green-500 bg-green-500',
        label: 'text-green-800 font-semibold',
      };
    }

    if (isSelected && !option.correct) {
      return {
        wrapper: 'border border-red-400 bg-red-50 text-red-700',
        dot: 'border-red-500 bg-red-500',
        label: 'text-red-700 font-semibold',
      };
    }

    return {
      wrapper: 'border border-gray-200 bg-white text-gray-900 opacity-70',
      dot: 'border-gray-300',
      label: 'text-gray-700',
    };
  };

  const renderFeedback = () => {
    if (!reveal || !selectedOption) return null;
    const isCorrect = selectedOption.correct;
    const title = isCorrect ? 'Jawaban Benar' : 'Jawaban Salah';
    const color = isCorrect ? 'text-green-700' : 'text-red-700';
    const border = isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50';
    const icon = isCorrect ? (
      <CheckIcon className="w-5 h-5 text-green-600" />
    ) : (
      <XMarkIcon className="w-5 h-5 text-red-600" />
    );

    return (
      <div
        ref={feedbackRef}
        className={`mt-4 border ${border} rounded-xl px-4 py-3 flex gap-3 items-start`}
      >
        <div className="mt-0.5">{icon}</div>
        <div>
          <p className={`font-semibold ${color}`}>{title}</p>
          {selectedOption.explanation && (
            <p className="text-sm text-gray-700 mt-1 leading-relaxed">{selectedOption.explanation}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div className="text-xs font-semibold tracking-wide text-[#0f5eff] uppercase">
          Soal {questionNumber} / {totalQuestions}
        </div>
        <div className="text-sm text-gray-500">
          {Math.round((questionNumber / totalQuestions) * 100)}% Selesai
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 leading-relaxed">{question.assessment}</h2>

      <div className="space-y-3">
        {options.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Tidak ada opsi tersedia</p>
        ) : (
          options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const style = getOptionStyle(option, isSelected);

            return (
              <button
                key={index}
                onClick={() => {
                  if (locked) return;
                  onSelectAnswer?.(index);
                }}
                disabled={locked}
                className={`w-full text-left rounded-xl px-4 py-3 transition-all duration-200 ${style.wrapper} ${
                  locked ? 'cursor-not-allowed opacity-90' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${style.dot}`}
                  >
                    {reveal && option.correct && <CheckIcon className="w-4 h-4 text-white" />}
                    {reveal && isSelected && !option.correct && <XMarkIcon className="w-4 h-4 text-white" />}
                  </div>
                  <span className={`text-base ${style.label}`}>{option.option}</span>
                </div>
              </button>
            );
          })
        )}
      </div>

      {renderFeedback()}
    </div>
  );
};

export default QuizCard;