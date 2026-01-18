import React, { useEffect, useState, useRef, useCallback } from "react";
import Swal from "sweetalert2";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import LayoutWrapper from "../components/Layout/LayoutWrapper";
import { useQuizProgress } from "../hooks/useQuizProgress";
import { useQuiz } from "../hooks/useQuiz";
import Alert from "../components/common/Alert";
import Button from "../components/common/Button";
import Loading from "../components/common/Loading";
import { QuizCard, QuizTimer } from "../components/Features/quiz";
import {
  getMockQuestions,
  DEFAULT_MOCK_FEEDBACK,
} from "../constants/mockQuestions";
import { getUserKey } from "../utils/storage";
import { useProgress } from "../context/ProgressContext";

const submoduleResultKey = (uid) => `${uid}:submodule-results`;
const loadSubmoduleResults = (uid) => {
  try {
    const raw = localStorage.getItem(submoduleResultKey(uid));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};
const saveSubmoduleResult = (
  uid,
  tutorialId,
  name,
  score,
  correct,
  total,
  durationSec
) => {
  const existing = loadSubmoduleResults(uid);
  const idx = existing.findIndex((e) => String(e.id) === String(tutorialId));
  const attempts = idx >= 0 ? (existing[idx].attempts || 0) + 1 : 1;
  const entry = {
    id: tutorialId,
    name: name || `Submodul ${tutorialId}`,
    score,
    correct,
    total,
    durationSec,
    attempts,
  };
  if (idx >= 0) existing[idx] = entry;
  else existing.push(entry);
  localStorage.setItem(submoduleResultKey(uid), JSON.stringify(existing));
};

const toDurationSec = (result, startTime) => {
  const numDur = Number(result?.duration);
  if (Number.isFinite(numDur) && numDur > 0) return numDur;

  const parsedFromText = parseInt(
    String(result?.lama_mengerjakan || "")
      .replace(/[^0-9]/g, "")
      .trim(),
    10
  );
  if (Number.isFinite(parsedFromText) && parsedFromText > 0) return parsedFromText;

  if (startTime instanceof Date) {
    return Math.max(
      0,
      Math.round((Date.now() - startTime.getTime()) / 1000)
    );
  }
  return 0;
};

const QuizPage = () => {
  const navigate = useNavigate();
  const { tutorialId } = useParams();
  const [searchParams] = useSearchParams();
  const embed = searchParams.get("embed") === "1";
  const userKey = getUserKey();

  // ========== EMBED USER HANDLING (TAMBAHAN BARU) ==========
  const embedUserId = searchParams.get("user"); // User ID dari Dicoding LMS

  // Effect untuk handle embed user tracking
  useEffect(() => {
    if (embed && embedUserId) {
      console.log("[QuizPage] Loaded in embed mode for user:", embedUserId);
      console.log("[QuizPage] Tutorial ID:", tutorialId);
      
      // Store untuk analytics atau tracking (opsional)
      try {
        sessionStorage.setItem("embed_user_id", embedUserId);
        sessionStorage.setItem("embed_mode", "true");
        sessionStorage.setItem("embed_tutorial_id", tutorialId || "");
      } catch (e) {
        console.warn("[QuizPage] Cannot access sessionStorage in embed mode:", e);
      }
    }
    
    // Cleanup on unmount
    return () => {
      if (embed) {
        try {
          sessionStorage.removeItem("embed_mode");
        } catch (e) {
          // Silent fail untuk cross-origin restrictions
        }
      }
    };
  }, [embed, embedUserId, tutorialId]);

  // Apply embed mode class to body
  useEffect(() => {
    if (embed) {
      document.body.classList.add('embed-mode');
      console.log("[QuizPage] Embed mode activated - body class applied");
    } else {
      document.body.classList.remove('embed-mode');
    }
    
    return () => {
      document.body.classList.remove('embed-mode');
    };
  }, [embed]);
  // ========== END EMBED USER HANDLING ==========

  const storageKey = tutorialId
    ? `${userKey}:quiz-progress-${tutorialId}`
    : null;

  const {
    questions,
    loading,
    error,
    assessmentId,
    fetchQuestions,
    submitAnswers,
    setMockQuestions,
  } = useQuiz();
  const {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    recordAnswer,
    getCurrentAnswer,
    nextQuestion,
    initializeQuiz,
  } = useQuizProgress();
  const { updateTutorialProgress } = useProgress();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [lockedAnswers, setLockedAnswers] = useState({});
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [isMock, setIsMock] = useState(false);
  const [startTime, setStartTime] = useState(null);

  const fetchedRef = useRef(false);
  const timeUpHandledRef = useRef(null);

  const goToResults = useCallback(
    (result) => {
      const url = `/quiz-results-player/${tutorialId}`; 
      navigate(url, { state: { result } });
    },
    [navigate, tutorialId]
  );

  useEffect(() => {
    if (!storageKey) return;
    const saved = localStorage.getItem(storageKey);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      if (parsed?.tutorialId === tutorialId) {
        if (parsed.completed && parsed.result) {
          goToResults(parsed.result);
          return;
        }
        if (parsed.answers) {
          Object.entries(parsed.answers).forEach(([qIdx, ans]) => {
            recordAnswer(parseInt(qIdx, 10), ans);
          });
        }
        if (parsed.lockedAnswers) setLockedAnswers(parsed.lockedAnswers);
        if (typeof parsed.currentQuestionIndex === "number") {
          setCurrentQuestionIndex(parsed.currentQuestionIndex);
        }
      }
    } catch (e) {
      console.warn("Failed to parse saved quiz progress", e);
    }
  }, [
    storageKey,
    tutorialId,
    recordAnswer,
    setCurrentQuestionIndex,
    goToResults,
  ]);

  useEffect(() => {
    if (!tutorialId) {
      setSubmitError("Tutorial ID tidak ditemukan");
      return;
    }
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const id = parseInt(tutorialId, 10);
    (async () => {
      const res = await fetchQuestions(id);
      const hasQuestions = res?.data?.length > 0;
      if (!hasQuestions) {
        const mockQs = getMockQuestions(id);
        setIsMock(true);
        setMockQuestions(mockQs);
        initializeQuiz();
        setStartTime(new Date());
        setIsTimerActive(true);
        setSubmitError(null);
        return;
      }
      setIsMock(false);
      initializeQuiz();
      setStartTime(new Date());
    })();
  }, [tutorialId, fetchQuestions, initializeQuiz, setMockQuestions]);

  useEffect(() => {
    if (!storageKey || !tutorialId) return;
    const payload = {
      tutorialId,
      assessmentId,
      currentQuestionIndex,
      answers,
      lockedAnswers,
      completed: false,
    };
    localStorage.setItem(storageKey, JSON.stringify(payload));
  }, [
    storageKey,
    tutorialId,
    assessmentId,
    currentQuestionIndex,
    answers,
    lockedAnswers,
  ]);

  useEffect(() => {
    timeUpHandledRef.current = null;
  }, [currentQuestionIndex]);

  const handleSubmitMock = useCallback(() => {
    const durationSec = startTime
      ? Math.round((Date.now() - startTime.getTime()) / 1000)
      : 0;
    let correctCount = 0;
    const detail = questions.map((q, idx) => {
      const selectedIndex = answers[idx];
      const selected = q.multiple_choice?.[selectedIndex];
      const isCorrect = !!selected?.correct;
      if (isCorrect) correctCount += 1;
      return {
        soal_id: q.id,
        correct: isCorrect,
        user_answer: selected?.option || "",
        answer: selected?.option || "",
        explanation: selected?.explanation || "",
      };
    });

    const result = {
      success: true,
      message: "Mock assessment",
      assessment_id: "assessment:mock",
      tutorial_key: `tutorial:${tutorialId}`,
      score: Number(((correctCount / questions.length) * 100).toFixed(2)),
      benar: correctCount,
      total: questions.length,
      lama_mengerjakan: `${durationSec} detik`,
      duration: durationSec,
      detail,
      answers: detail,
      questions,
      feedback: DEFAULT_MOCK_FEEDBACK,
    };

    saveSubmoduleResult(
      userKey,
      tutorialId,
      result?.tutorial_key || `Submodul ${tutorialId}`,
      result.score,
      correctCount,
      questions.length,
      durationSec
    );

    if (storageKey) {
      const saved = {
        tutorialId,
        assessmentId: "mock",
        currentQuestionIndex,
        answers,
        lockedAnswers,
        completed: true,
        result,
      };
      localStorage.setItem(storageKey, JSON.stringify(saved));
      localStorage.setItem(
        `${userKey}:quiz-result-${tutorialId}`,
        JSON.stringify(result)
      );
    }
    updateTutorialProgress?.(tutorialId, true);

    try {
      window.parent.postMessage(
        { type: "quiz-submitted", tutorialId, result },
        "*"
      );
    } catch (e) {
      console.warn("postMessage failed", e);
    }

    goToResults(result);
  }, [
    answers,
    currentQuestionIndex,
    lockedAnswers,
    questions,
    startTime,
    storageKey,
    tutorialId,
    goToResults,
    userKey,
    updateTutorialProgress,
  ]);

  const handleSubmitQuiz = useCallback(async () => {
    if (isSubmitting) return;
    if (isMock) {
      handleSubmitMock();
      return;
    }
    setIsSubmitting(true);
    setIsTimerActive(false);
    setSubmitError(null);
    try {
      const answersData = questions.map((question, idx) => {
        const answerIndex = answers[idx];
        const selectedOption =
          answerIndex !== undefined
            ? question?.multiple_choice?.[answerIndex]
            : null;
        return {
          soal_id: question?.id,
          correct: selectedOption?.correct || false,
        };
      });

      const result = await submitAnswers(
        parseInt(tutorialId, 10),
        assessmentId,
        answersData
      );

      const detail =
        result?.detail ||
        result?.answers ||
        questions.map((q, idx) => {
          const selectedIndex = answers[idx];
          const selected = q?.multiple_choice?.[selectedIndex];
          const correctChoice = q?.multiple_choice?.find((o) => o.correct);
          return {
            soal_id: q?.id,
            correct: !!selected?.correct,
            user_answer: selected?.option || selected?.answer || "",
            answer: correctChoice?.option || correctChoice?.answer || "",
            explanation:
              selected?.explanation ||
              correctChoice?.explanation ||
              q?.explanation ||
              "",
          };
        });

      const durationSec = toDurationSec(result, startTime);

      const resultEnriched = {
        ...result,
        duration: durationSec,
        lama_mengerjakan: result?.lama_mengerjakan || `${durationSec} detik`,
        detail,
        answers: result.answers || detail,
        questions: result.questions || questions,
      };

      saveSubmoduleResult(
        userKey,
        tutorialId,
        resultEnriched?.tutorial_key || `Submodul ${tutorialId}`,
        resultEnriched?.score ?? 0,
        resultEnriched?.benar ?? 0,
        resultEnriched?.total ?? questions.length,
        durationSec 
      );

      if (storageKey) {
        const saved = {
          tutorialId,
          assessmentId,
          currentQuestionIndex,
          answers,
          lockedAnswers,
          completed: true,
          result: resultEnriched,
        };
        localStorage.setItem(storageKey, JSON.stringify(saved));
        localStorage.setItem(
          `${userKey}:quiz-result-${tutorialId}`,
          JSON.stringify(resultEnriched)
        );
      }
      updateTutorialProgress?.(tutorialId, true);

      try {
        window.parent.postMessage(
          { type: "quiz-submitted", tutorialId, result: resultEnriched },
          "*"
        );
      } catch (e) {
        console.warn("postMessage failed", e);
      }
      goToResults(resultEnriched);
    } catch (err) {
      const friendly =
        err?.raw?.details || err?.message || "Gagal mengirim jawaban";
      setSubmitError(friendly);
      setIsTimerActive(true);
      setIsSubmitting(false);
    }
  }, [
    answers,
    assessmentId,
    questions,
    submitAnswers,
    tutorialId,
    storageKey,
    lockedAnswers,
    currentQuestionIndex,
    isSubmitting,
    isMock,
    handleSubmitMock,
    goToResults,
    userKey,
    updateTutorialProgress,
    startTime, 
  ]);

  const handleTimeUp = useCallback(() => {
    if (timeUpHandledRef.current === currentQuestionIndex) return;
    timeUpHandledRef.current = currentQuestionIndex;

    if (currentQuestionIndex >= questions.length - 1) {
      handleSubmitQuiz();
    } else {
      nextQuestion(questions.length);
    }
  }, [currentQuestionIndex, questions.length, handleSubmitQuiz, nextQuestion]);

  const handleSelectAnswer = (index) => {
    if (lockedAnswers[currentQuestionIndex]) return;
    recordAnswer(currentQuestionIndex, index);
    setLockedAnswers((prev) => ({ ...prev, [currentQuestionIndex]: true }));
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = getCurrentAnswer();
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progressPercent = questions.length
    ? Math.round(((currentQuestionIndex + 1) / questions.length) * 100)
    : 0;

  const handleNextClick = () => {
    if (currentAnswer !== undefined) {
      nextQuestion(questions.length);
      return;
    }
    Swal.fire({
      title: "Belum menjawab",
      text: "Anda belum memilih jawaban untuk soal ini. Tetap lanjut?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Tetap Lanjut",
      cancelButtonText: "Batal",
      reverseButtons: true,
      allowOutsideClick: false,
    }).then((res) => {
      if (res.isConfirmed) {
        nextQuestion(questions.length);
      }
    });
  };

  if (loading) {
    return (
      <LayoutWrapper
        showNavbar={!embed}
        showFooter={false}
        sidePanel={null}
        bottomBar={null}
        embed={embed}
        contentClassName="pb-16"
      >
        <Loading fullScreen text="Memuat kuis..." useImage />
      </LayoutWrapper>
    );
  }

  if ((error || submitError) && !isMock) {
    const msg = submitError || error;
    return (
      <LayoutWrapper
        showNavbar={!embed}
        showFooter={false}
        sidePanel={null}
        bottomBar={null}
        embed={embed}
        contentClassName="pb-16"
      >
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-2xl mx-auto text-center">
            <Alert type="error" title="Error" message={msg} />
            <Button
              onClick={() => navigate(-1)}
              variant="primary"
              className="mt-4 cursor-pointer"
            >
              Kembali
            </Button>
          </div>
        </div>
      </LayoutWrapper>
    );
  }

  if (questions.length === 0) {
    return (
      <LayoutWrapper
        showNavbar={!embed}
        showFooter={false}
        sidePanel={null}
        bottomBar={null}
        embed={embed}
        contentClassName="pb-16"
      >
        <div className="min-h-screen flex itemsCenter justifyCenter">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-gray-600 mb-4">
              Pertanyaan belum tersedia untuk submodul ini.
            </p>
            <Button onClick={() => navigate(-1)} variant="primary">
              Kembali
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
      sidePanel={null}
      bottomBar={null}
      embed={embed}
      contentClassName="pb-16"
    >
      <div className="min-h-screen py-14 px-4">
        <div className="max-w-4xl mx-auto space-y-5 mt-10 sm:mt-12">
          {isMock && (
            <Alert
              type="info"
              title="Mode offline (mock)"
              message="Menampilkan soal mock karena backend bermasalah."
              dismissible={false}
            />
          )}

          <div className="rounded-2xl bg-gradient-to-r from-[#0f5eff] to-[#0a4ed6] text-white shadow-lg p-6 sm:p-7">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide opacity-90">
                  Quiz Submodul
                </p>
                <p className="text-base sm:text-lg font-medium opacity-90">
                  Soal {currentQuestionIndex + 1} dari {questions.length}
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm sm:text-base">
                <div className="font-semibold">Sisa Waktu</div>
                <QuizTimer
                  duration={30}
                  isActive={isTimerActive && !isSubmitting}
                  onTimeUp={handleTimeUp}
                  variant="light"
                  resetKey={currentQuestionIndex}
                />
              </div>
            </div>
            <div className="mt-4 h-2 w-full bg-white/25 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <QuizCard
              question={currentQuestion}
              selectedAnswer={currentAnswer}
              onSelectAnswer={handleSelectAnswer}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              locked={!!lockedAnswers[currentQuestionIndex]}
              showFeedback={true}
            />

            <div className="mt-6 flex justify-end">
              {isLastQuestion ? (
                <Button
                  onClick={handleSubmitQuiz}
                  variant="primary"
                  disabled={isSubmitting}
                  className="bg-[#0f5eff] hover:bg-[#0d52db] px-4 py-2 text-sm"
                >
                  {isSubmitting ? "Mengirim..." : "✓ Selesai & Kirim"}
                </Button>
              ) : (
                <Button
                  onClick={handleNextClick}
                  variant="primary"
                  disabled={false}
                  className="bg-[#0f5eff] hover:bg-[#0d52db] px-4 py-2 text-sm"
                >
                  Lanjut →
                </Button>
              )}
            </div>
          </div>

          {submitError && !isMock && (
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
    </LayoutWrapper>
  );
};

export default QuizPage;