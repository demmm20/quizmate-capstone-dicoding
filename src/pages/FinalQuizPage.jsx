import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LayoutWrapper from "../components/Layout/LayoutWrapper";
import { Alert } from "../components/common";
import Button from "../components/common/Button";
import Loading from "../components/common/Loading";
import { QuizTimer } from "../components/Features/quiz";
import finalQuizService from "../services/finalQuizService";
import { getUserKey } from "../utils/storage";

const FINAL_RESULT_KEY = (userKey) => `${userKey}:quiz-final-result`;

const QuizFinalPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const embed = searchParams.get("embed") === "1";
  const userKey = getUserKey();

  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(true);

  const durationSeconds = 10 * 60; 
  const startTimeRef = useRef(null);

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const qs = await finalQuizService.getFinalQuestions();
      setQuestions(qs);
      setCurrentQuestionIndex(0);
      setAnswers({});
      startTimeRef.current = Date.now();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Gagal memuat soal final.";
      setFetchError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const totalQuestions = questions.length || 10;
  const currentQuestion = questions[currentQuestionIndex] || null;
  const currentAnswer = answers[currentQuestionIndex];
  const isFirst = currentQuestionIndex === 0;
  const isLast = currentQuestionIndex >= totalQuestions - 1;
  const percent = totalQuestions
    ? Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)
    : 0;

  const handleSelectAnswer = (index) => {
    setAnswers((prev) => ({ ...prev, [currentQuestionIndex]: index }));
  };

  const goToQuestion = (idx) => {
    if (idx < 0 || idx >= totalQuestions) return;
    setCurrentQuestionIndex(idx);
  };

  const validateAnswers = () => {
    const firstUnanswered = questions.findIndex((_, idx) => answers[idx] === undefined);
    if (firstUnanswered >= 0) {
      console.log("answers state:", answers); 
      console.log("payload:", buildSubmissionPayload()); 
      setSubmitError(`Soal ${firstUnanswered + 1} belum dijawab. Silakan lengkapi semua soal.`);
      setCurrentQuestionIndex(firstUnanswered); 
      return false;
    }
    return true;
  };

  const buildSubmissionPayload = () =>
    questions.map((q, idx) => {
      const ansIdx = answers[idx];
      const optionKey = ansIdx === undefined || ansIdx === null ? "" : String(ansIdx + 1); 
      return {
        question_id: q.id,
        answer: optionKey,
      };
    });

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    if (!validateAnswers()) return; 

    setIsSubmitting(true);
    setIsTimerActive(false);
    setSubmitError(null);

    try {
      const payload = buildSubmissionPayload();
      console.log("Submitting final answers payload:", payload); 
      const res = await finalQuizService.submitFinalAnswers(payload);

      const results = res?.results || [];
      const correctCount = results.filter((r) => r.is_true).length;
      const total = results.length || totalQuestions;
      const score = Number(((correctCount / (total || 1)) * 100).toFixed(2));
      const durationSec = startTimeRef.current
        ? Math.max(0, Math.round((Date.now() - startTimeRef.current) / 1000))
        : 0;

      const tutorialByQuestion = new Map(questions.map((q) => [q.id, q.tutorial_id]));

      const enrichedQuestions = results.map((r) => {
        const opts = r.options || {};
        return {
          id: r.question_id,
          assessment: r.question,
          tutorial_id: tutorialByQuestion.get(r.question_id) || r.tutorial_id || null,
          multiple_choice: ["1", "2", "3", "4"].map((key) => ({
            id: Number(key),
            option: opts[key] || "",
            correct: r.correct_answer?.toString() === key,
          })),
        };
      });

      const answersArr = results.map((r) => {
        const opts = r.options || {};
        return {
          soal_id: r.question_id,
          tutorial_id: tutorialByQuestion.get(r.question_id) || r.tutorial_id || null,
          correct: !!r.is_true,
          user_answer: opts[r.user_answer] || r.user_answer || "",
          answer: opts[r.correct_answer] || r.correct_answer || "",
          explanation: r.explanation_user || "",
        };
      });

      const resultPayload = {
        success: true,
        score,
        correct: correctCount,
        total,
        duration: durationSec,
        lama_mengerjakan: `${durationSec} detik`,
        answers: answersArr,
        detail: answersArr,
        questions: enrichedQuestions,
        rawResults: results,
        rawQuestions: questions, 
      };

      localStorage.setItem(FINAL_RESULT_KEY(userKey), JSON.stringify(resultPayload));

      navigate("/quiz-final-result", { state: resultPayload });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Gagal mengirim jawaban. Silakan coba lagi.";
      setSubmitError(msg);
      setIsTimerActive(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, questions, totalQuestions, navigate, userKey, answers]);

  const handleTimeUp = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  if (loading) {
    return (
      <LayoutWrapper showNavbar={!embed} showFooter={false} embed={embed} contentClassName="pb-16">
        <Loading fullScreen text="Memuat quiz final..." />
      </LayoutWrapper>
    );
  }

  if (fetchError) {
    return (
      <LayoutWrapper showNavbar={!embed} showFooter={false} embed={embed} contentClassName="pb-16">
        <div className="max-w-xl mx-auto pt-20">
          <Alert type="error" title="Gagal memuat soal" message={fetchError} dismissible={false} />
          <div className="mt-4 flex gap-3">
            <Button variant="secondary" className="cursor-pointer" onClick={() => navigate("/quiz-final-intro")}>
              Kembali
            </Button>
            <Button variant="primary" className="cursor-pointer" onClick={loadQuestions}>
              Coba Lagi
            </Button>
          </div>
        </div>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper
      showNavbar={!embed}
      showFooter={false}
      embed={embed}
      sidePanel={null}
      bottomBar={null}
      contentClassName="pb-16"
    >
      <div
        className="min-h-screen pt-20 pb-10 px-4 flex justify-center"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(15,94,255,0.06) 0, transparent 35%), radial-gradient(circle at 80% 30%, rgba(15,94,255,0.06) 0, transparent 35%), radial-gradient(circle at 30% 70%, rgba(15,94,255,0.06) 0, transparent 35%), radial-gradient(circle at 75% 75%, rgba(15,94,255,0.06) 0, transparent 35%)",
        }}
      >
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4 lg:gap-6">
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-md border border-gray-100 p-4 h-fit">
            <p className="text-sm font-semibold text-gray-800 mb-3">Pilih Soal</p>
            <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-4 gap-2">
              {Array.from({ length: totalQuestions }).map((_, idx) => {
                const answered = answers[idx] !== undefined;
                const active = idx === currentQuestionIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => goToQuestion(idx)}
                    className={`w-11 h-11 rounded-full text-sm font-semibold border transition
                      ${active ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200"}
                      ${answered && !active ? "ring-2 ring-offset-1 ring-green-200" : ""}
                    `}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-gradient-to-r from-[#1e7bff] to-[#0a5bff] text-white rounded-2xl shadow-lg px-6 py-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide opacity-90">Quiz Final</p>
                  <p className="text-lg font-bold">
                    Soal {currentQuestionIndex + 1} dari {totalQuestions}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-base font-semibold">
                  <span className="opacity-90">Sisa Waktu</span>
                  <QuizTimer
                    duration={durationSeconds}
                    isActive={isTimerActive && !isSubmitting}
                    onTimeUp={handleTimeUp}
                    variant="light"
                    resetKey={0}
                  />
                </div>
              </div>
              <div className="mt-4 h-3 w-full bg-white/25 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>

            <div className="bg-white/95 backdrop-blur rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8">
              <div className="flex items-start justify-between mb-4">
                <p className="text-sm font-semibold text-blue-700">
                  SOAL {currentQuestionIndex + 1} / {totalQuestions}
                </p>
                <p className="text-sm text-gray-500">{percent}% Selesai</p>
              </div>

              {currentQuestion ? (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-gray-900 leading-relaxed">
                    {currentQuestion.assessment}
                  </h2>
                  <div className="space-y-3">
                    {(currentQuestion.multiple_choice || []).map((opt, idx) => {
                      const isSelected = currentAnswer === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectAnswer(idx)}
                          className={`w-full text-left rounded-2xl border px-4 py-3 transition
                            ${isSelected ? "border-blue-500 bg-blue-50 text-blue-800" : "border-gray-200 bg-white text-gray-900"}
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-5 h-5 rounded-full border ${
                                isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300"
                              } flex items-center justify-center`}
                            >
                              {isSelected && <span className="w-2 h-2 bg-white rounded-full" />}
                            </span>
                            <span className="text-base">{opt.option || opt.answer}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <Alert type="info" title="Soal tidak ditemukan" message="Silakan kembali ke dashboard." />
              )}

              <div className="mt-8 flex flex-wrap justify-between items-center gap-3">
                <Button
                  variant="secondary"
                  className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2.5 text-sm rounded-xl"
                  onClick={() => goToQuestion(currentQuestionIndex - 1)}
                  disabled={isFirst}
                >
                  ← Sebelumnya
                </Button>

                {!isLast ? (
                  <Button
                    variant="primary"
                    className="cursor-pointer bg-[#1061ff] hover:bg-[#0d52db] px-6 py-2.5 text-sm rounded-xl"
                    onClick={() => goToQuestion(currentQuestionIndex + 1)}
                  >
                    Lanjut →
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    className="cursor-pointer bg-[#1061ff] hover:bg-[#0d52db] px-6 py-2.5 text-sm rounded-xl"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Mengirim..." : "Selesai & Kirim"}
                  </Button>
                )}
              </div>
            </div>

            {submitError && (
              <Alert
                type="error"
                title="Error"
                message={submitError}
                dismissible
                onClose={() => setSubmitError(null)}
              />
            )}
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default QuizFinalPage;