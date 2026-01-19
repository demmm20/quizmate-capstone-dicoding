import { useState, useCallback } from 'react';

export const useQuizProgress = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // STATE answers: obj dengan index sebagai key
  // Contoh: {0: {soal_id, correct}, 1: {soal_id, correct}, ...}
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // RECORD/jawab soal
  const recordAnswer = useCallback((questionIndex, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  }, []);

  const getCurrentAnswer = useCallback(() => answers[currentQuestionIndex], [answers, currentQuestionIndex]);

  const nextQuestion = useCallback((totalQuestions) => {
    setCurrentQuestionIndex((prev) => {
      const maxIdx = Math.max(0, (totalQuestions || 1) - 1);
      return Math.min(prev + 1, maxIdx);
    });
  }, []);

  const previousQuestion = useCallback(() => {
    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const resetQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setScore(0);
    setStartTime(null);
    setIsSubmitted(false);
    setShowFeedback(false);
  }, []);

  const initializeQuiz = useCallback(() => {
    const now = new Date();
    setStartTime(now);
    resetQuiz();
  }, [resetQuiz]);

  return {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    recordAnswer,
    getCurrentAnswer,
    score,
    setScore,
    startTime,
    setStartTime,
    isSubmitted,
    setIsSubmitted,
    showFeedback,
    setShowFeedback,
    nextQuestion,
    previousQuestion,
    resetQuiz,
    initializeQuiz,
  };
};

export default useQuizProgress;