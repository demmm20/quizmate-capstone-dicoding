import { useState, useCallback } from 'react';
import quizService from '../services/quizService';

// Helper untuk cek embed mode
function isEmbedMode() {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get("embed") === "1" || sessionStorage.getItem("embed_mode") === "true";
  } catch {
    return false;
  }
}

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
      const embed = isEmbedMode();
      let response;
      if (embed) {
        // PANGGIL endpoint PUBLIC untuk soal saat embed mode
        response = await quizService.getQuestionsIframe(tutorialId);
      } else {
        response = await quizService.getQuestions(tutorialId);
      }

      const rawQuestions = response.data || [];
      const questionsData = rawQuestions.slice(0, 3).map(q => ({
        ...q,
        question: q.assessment || q.question,
      }));
      const assmtId = response.assessment_id || null;

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

  /**
   * submitAnswers sekarang menerima 'answers' sebagai OBJECT (index=>jawaban),
   * dan akan mengubah-nya menjadi ARRAY OF OBJECTS sesuai kebutuhan backend.
   * answers: { 0: {soal_id: ..., correct: ... }, 1: {...}, ... }
   */
  const submitAnswers = useCallback(async (tutorialId, assmtId, answersObj) => {
    setSubmitLoading(true);
    setError(null);
    try {
      // Ubah object ke array agar sesuai ekspektasi backend
      let answers = [];
      if (Array.isArray(answersObj)) {
        answers = answersObj;
      } else if (typeof answersObj === 'object') {
        answers = Object.values(answersObj);
      }
      const response = await quizService.submitAnswers(tutorialId, assmtId, answers);
      return response;
    } catch (err) {
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
      const response = await quizService.resetProgress();
      return response;
    } catch (err) {
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