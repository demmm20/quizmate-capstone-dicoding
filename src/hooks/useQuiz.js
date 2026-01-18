import { useState, useCallback } from 'react';
import quizService from '../services/quizService';

export const useQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [assessmentId, setAssessmentId] = useState(null);


  const fetchQuestions = useCallback(async (tutorialId) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching questions for tutorial:', tutorialId);
      const response = await quizService.getQuestions(tutorialId);
      console.log('Questions response:', response);

      // ✅ Map backend response to frontend format
      const rawQuestions = response.data || [];
      
      // ✅ Transform: 'assessment' field → 'question' field
      const questionsData = rawQuestions.slice(0, 3).map(q => ({
        ...q,
        question: q.assessment || q.question, // Support both formats
      }));
      
      const assmtId = response.assessment_id || null;

      console.log('Mapped questions:', questionsData);

      setQuestions(questionsData);
      setAssessmentId(assmtId);

      return response;
    } catch (err) {
      console.error("Error fetching questions:", err);
      const friendly =
        err?.details ||
        err?.error ||
        err?.message ||
        "Pertanyaan belum tersedia untuk submodul ini.";
      setError(friendly);
      setQuestions([]);
      setAssessmentId(null);
      return null; 
    } finally {
      setLoading(false);
    }
  }, []);


  const setMockQuestions = useCallback((mockQs = [], mockAssessmentId = 'mock') => {
    setQuestions(mockQs);
    setAssessmentId(mockAssessmentId);
    setError(null);
  }, []);


  const submitAnswers = useCallback(async (tutorialId, assmtId, answers) => {
    setSubmitLoading(true);
    setError(null);
    try {
      console.log('Submitting answers:', { tutorialId, assessmentId: assmtId, answers });
      const response = await quizService.submitAnswers(tutorialId, assmtId, answers);
      console.log('Submit response:', response);

      
      return response;
    } catch (err) {
      console.error('Error submitting answers:', err);
      setError(err.message || 'Failed to submit answers');
      throw err;
    } finally {
      setSubmitLoading(false);
    }
  }, []);


  const resetProgress = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Resetting progress...');
      const response = await quizService.resetProgress();
      console.log('Reset response:', response);
      return response;
    } catch (err) {
      console.error('Error resetting progress:', err);
      setError(err.message || 'Failed to reset progress');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    questions,
    loading,
    error,
    submitLoading,
    assessmentId,
    fetchQuestions,
    submitAnswers,
    resetProgress,
    setMockQuestions, 
  };
};

export default useQuiz;