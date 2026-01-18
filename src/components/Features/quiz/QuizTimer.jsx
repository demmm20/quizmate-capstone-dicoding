import React, { useState, useEffect } from 'react';
import { ClockIcon } from '@heroicons/react/24/solid';

const QuizTimer = ({ duration = 30, onTimeUp, isActive = true, variant = 'dark', resetKey }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration, resetKey]);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(timer);
          setTimeout(() => onTimeUp?.(), 0);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, onTimeUp, resetKey, duration]);

  const isWarning = timeLeft <= 10;
  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const color =
    variant === 'light'
      ? isWarning
        ? 'text-yellow-200'
        : 'text-white'
      : isWarning
        ? 'text-red-600'
        : 'text-gray-900';

  return (
    <div className={`flex items-center gap-2 text-lg font-semibold ${color}`}>
      <ClockIcon className={`w-5 h-5 ${isWarning ? 'animate-pulse' : ''}`} />
      <span>{formatTime(timeLeft)}</span>
    </div>
  );
};

export default QuizTimer;