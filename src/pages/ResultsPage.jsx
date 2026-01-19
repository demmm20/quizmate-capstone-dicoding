import React, { useMemo, useRef, useState, useEffect } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import LayoutWrapper from "../components/Layout/LayoutWrapper";
import ModuleSidebar from "../components/Layout/ModuleSidebar";
import BottomBarTwoActions from "../components/Layout/BottomBarTwoActions";
import { useLearning } from "../hooks/useLearning";
import { useProgress } from "../context/ProgressContext";
import { buildSidebarItems, buildChain } from "../utils/navigationChain";
import Button from "../components/common/Button";
import ResultCard from "../components/Features/Feedback/ResultCard";
import AnswerReview from "../components/Features/Feedback/AnswerReview";
import { getUserKey } from "../utils/storage";
import { quizDone } from "../utils/accessControl";
import { useQuiz } from "../hooks/useQuiz"; // ⬅️ Tambahkan
import { useQuizProgress } from "../hooks/useQuizProgress"; // ⬅️ Tambahkan

const toText = (val) => {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (Array.isArray(val)) return val.filter(Boolean).join(" ");
  if (typeof val === "object") return Object.values(val || {}).filter(Boolean).join(" ");
  return String(val);
};

const ResultsPage = () => {
  const { tutorialId } = useParams();
  const [searchParams] = useSearchParams();
  const embed = searchParams.get("embed") === "1";
  const embedUserId = searchParams.get("user");

  // Tambahkan hooks quiz
  const { resetProgress } = useQuiz();
  const { resetQuiz } = useQuizProgress();

  useEffect(() => {
    if (embed && embedUserId) {
      try {
        sessionStorage.setItem("embed_user_id", embedUserId);
        sessionStorage.setItem("embed_mode", "true");
        sessionStorage.setItem("embed_tutorial_id", tutorialId || "");
      } catch (e) {}
    }
  }, [embed, embedUserId, tutorialId]);

  useEffect(() => {
    if (embed) document.body.classList.add('embed-mode');
    else document.body.classList.remove('embed-mode');
    return () => document.body.classList.remove('embed-mode');
  }, [embed]);

  const location = useLocation();
  const navigate = useNavigate();
  const { tutorials } = useLearning();
  const { getTutorialProgress } = useProgress();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showReview, setShowReview] = useState(false);
  const reviewRef = useRef(null);

  const userKey = getUserKey();
  const storageKey = tutorialId ? `${userKey}:quiz-progress-${tutorialId}` : null;

  const hasFinalResult = useMemo(() => {
    try {
      return !!localStorage.getItem(`${userKey}:quiz-final-result`);
    } catch {
      return false;
    }
  }, [userKey]);

  const clearProgress = () => {
    if (!storageKey) return;
    try {
      localStorage.removeItem(storageKey);
      localStorage.removeItem(`${userKey}:quiz-result-${tutorialId}`);
    } catch (e) {
      console.warn("Failed to clear quiz progress", e);
    }
  };

  const isIframe = typeof window !== "undefined" && window.self !== window.top;
  const postNavToParent = (route) => {
    try {
      window.parent.postMessage({ type: "nav-parent", route }, "*");
    } catch (e) {
      console.warn("postMessage nav-parent failed", e);
    }
  };

  const stateResult = location.state?.result;
  const localResult = (() => {
    try {
      const raw = localStorage.getItem(`${userKey}:quiz-result-${tutorialId}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const resultData = stateResult || localResult || {};
  const score = resultData?.score ?? 0;
  const correct = resultData?.benar ?? resultData?.correct_count ?? 0;
  const total = resultData?.total ?? resultData?.total_questions ?? 0;
  const duration = resultData?.lama_mengerjakan ?? resultData?.duration ?? "";
  const feedback = resultData?.feedback || {};
  const ringkasan = toText(feedback.summary);
  const analisis = toText(feedback.analysis);
  const saran = toText(feedback.advice);
  const rekomendasi = toText(feedback.recommendation);
  const answers = resultData?.detail || resultData?.answers || [];
  const questions = resultData?.questions || [];
  const currentId = parseInt(tutorialId, 10);
  const sidebarItems = useMemo(() => buildSidebarItems(tutorials, getTutorialProgress), [tutorials, getTutorialProgress]);
  const chain = buildChain(tutorials, currentId);

  const goBackChain = () => {
    const target = `/learning/${currentId}`;
    if (isIframe) postNavToParent(target);
    else navigate(target);
  };

  const goNextChain = () => {
    let target;
    if (chain.idx < chain.total - 1) {
      const next = tutorials[chain.idx + 1];
      target = `/learning/${next.id}`;
    } else {
      target = hasFinalResult ? "/quiz-final-result" : "/quiz-final-intro";
    }
    if (isIframe) postNavToParent(target);
    else navigate(target);
  };

  const isPass = total > 0 ? (correct / total) * 100 >= 60 : false;

  const handleReview = () => {
    setShowReview(true);
    setTimeout(() => {
      if (reviewRef.current) reviewRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  // VERSI PERBAIKAN: Reset SEMUA state & storage quiz, lalu navigate ke /quiz-intro/{id}
  const handleRetry = () => {
    resetProgress(); // reset state quiz
    resetQuiz();     // reset state progress answers/score/time
    clearProgress(); // reset localStorage

    // Build query param
    let url = `/quiz-intro/${tutorialId}`;
    if (embed) {
      const params = new URLSearchParams({ embed: "1" });
      if (embedUserId) params.append("user", embedUserId);
      url += `?${params.toString()}`;
    }

    if (isIframe) postNavToParent(url);
    else navigate(url, { replace: true }); // replace agar state lama tidak tumpuk
  };

  return (
    <LayoutWrapper
      embed={embed}
      showNavbar={!embed}
      showFooter={false}
      contentClassName={`pt-14 pb-24 ${!embed && sidebarOpen ? "pr-80" : ""}`}
      sidePanel={
        !embed ? (
          <ModuleSidebar
            items={sidebarItems}
            currentId={currentId}
            currentType="quiz-sub"
            onSelect={(item) => {
              if (item.type === "tutorial") {
                navigate(`/learning/${item.id}`);
              } else if (item.type === "quiz-sub") {
                const target =
                  getTutorialProgress(item.id) && quizDone(item.id)
                    ? `/quiz-results-player/${item.id}`
                    : `/quiz-intro/${item.id}`;
                navigate(target);
              } else if (item.type === "quiz-final") {
                const target = hasFinalResult ? "/quiz-final-result" : "/quiz-final-intro";
                navigate(target);
              } else if (item.type === "dashboard") {
                navigate("/dashboard-modul");
              }
            }}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen((p) => !p)}
          />
        ) : null
      }
      bottomBar={
        !embed ? (
          <BottomBarTwoActions
            leftLabel="← Kembali"
            rightLabel={chain.idx < chain.total - 1 ? "Lanjut →" : "Quiz Final →"}
            onLeft={goBackChain}
            onRight={goNextChain}
          />
        ) : null
      }
    >
      <div className="min-h-screen py-10 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <ResultCard
            score={score}
            correct={correct}
            total={total}
            duration={duration}
            isPass={isPass}
            onRetry={handleRetry}
            onReview={handleReview}
          />

          {(ringkasan || analisis || saran || rekomendasi) && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-red-700 mb-2">Perlu Belajar Lebih Lanjut</h3>
              {ringkasan && <p className="text-red-800 mb-3">{ringkasan}</p>}
              {analisis && (
                <p className="text-red-800 mb-3">
                  <span className="font-semibold">Analisis: </span>
                  {analisis}
                </p>
              )}
              {saran && (
                <p className="text-red-800 mb-3">
                  <span className="font-semibold">Saran: </span>
                  {saran}
                </p>
              )}
              {rekomendasi && (
                <p className="text-red-800">
                  <span className="font-semibold">Rekomendasi: </span>
                  {rekomendasi}
                </p>
              )}
            </div>
          )}

          {showReview && (
            <div ref={reviewRef} className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
              <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                <h3 className="text-2xl font-bold text-gray-900">Detail Jawaban</h3>
                <Button variant="secondary" className="cursor-pointer" onClick={() => setShowReview(false)}>
                  Tutup Review
                </Button>
              </div>
              <AnswerReview answers={answers} questions={questions} />
            </div>
          )}
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default ResultsPage;