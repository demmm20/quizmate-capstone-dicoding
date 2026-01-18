

import React, { createContext, useState, useCallback } from 'react';
import quizService from '../services/quizService';

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);


  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await quizService.getQuestions();
      setQuestions(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  }, []);


  const recordAnswer = useCallback((questionIndex, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  }, []);


  const submitQuiz = useCallback(async (tutorialId, assessmentId, answersData) => {
    setSubmitLoading(true);
    setError(null);
    try {
      const response = await quizService.submitAnswers(
        tutorialId,
        assessmentId,
        answersData
      );
      
      setScore(response.score);
      setFeedback(response.feedback);
      setIsSubmitted(true);
      setSubmitLoading(false);
      
      return response;
    } catch (err) {
      setError(err.message || 'Failed to submit quiz');
      setSubmitLoading(false);
      throw err;
    }
  }, []);


  const resetQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setScore(0);
    setStartTime(null);
    setIsSubmitted(false);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setFeedback(null);
    setError(null);
  }, []);


  const initializeQuiz = useCallback(() => {
    setStartTime(new Date());
    resetQuiz();
  }, [resetQuiz]);


  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    }
  }, [currentQuestionIndex, questions.length]);


  const previousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setSelectedAnswer(null);
    }
  }, [currentQuestionIndex]);

  const value = {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    recordAnswer,
    score,
    setScore,
    startTime,
    setStartTime,
    isSubmitted,
    setIsSubmitted,
    selectedAnswer,
    setSelectedAnswer,
    showFeedback,
    setShowFeedback,
    questions,
    loading,
    submitLoading,
    error,
    feedback,
    fetchQuestions,
    submitQuiz,
    resetQuiz,
    initializeQuiz,
    nextQuestion,
    previousQuestion,
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};

export default QuizContext;