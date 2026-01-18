import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import LayoutWrapper from "../components/Layout/LayoutWrapper";
import ModuleSidebar from "../components/Layout/ModuleSidebar";
import BottomBarTwoActions from "../components/Layout/BottomBarTwoActions";
import { useLearning } from "../hooks/useLearning";
import { useProgress } from "../context/ProgressContext";
import { buildSidebarItems } from "../utils/navigationChain";
import ResultCard from "../components/Features/Feedback/ResultCard";
import AnswerReview from "../components/Features/Feedback/AnswerReview";
import { getUserKey } from "../utils/storage";
import { finalQuizDone, quizDone } from "../utils/accessControl";

const FINAL_RESULT_KEY = (userKey) => `${userKey}:quiz-final-result`;

const FinalQuizResultPage = () => {
  const { state } = useLocation();
  const [searchParams] = useSearchParams();
  const embed = searchParams.get("embed") === "1";
  const navigate = useNavigate();
  const { tutorials } = useLearning();
  const { getTutorialProgress } = useProgress();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showReview, setShowReview] = useState(false);

  const userKey = getUserKey();

  const localResult = useMemo(() => {
    try {
      const raw = localStorage.getItem(FINAL_RESULT_KEY(userKey));
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [userKey]);

  const data = state || localResult || null;

  useEffect(() => {
    if (!data) {
      navigate("/quiz-final-intro", { replace: true });
    }
  }, [data, navigate]);

  if (!data) return null;

  const score = data?.score ?? 0;
  const correct = data?.correct ?? 0;
  const total = data?.total ?? 0;
  const duration = data?.lama_mengerjakan || data?.duration || "";
  const answers = data?.answers || data?.detail || [];
  const questions = data?.questions || [];

  const sidebarItems = useMemo(
    () => buildSidebarItems(tutorials, getTutorialProgress),
    [tutorials, getTutorialProgress]
  );

  const handleSelectSidebar = (item) => {
    if (item.type === "tutorial") navigate(`/learning/${item.id}`);
    else if (item.type === "quiz-sub") navigate(`/quiz-intro/${item.id}`);
    else if (item.type === "quiz-final") {
      const target = finalQuizDone() ? "/quiz-final-result" : "/quiz-final-intro";
      navigate(target);
    } else if (item.type === "dashboard") navigate("/dashboard-modul");
  };

  const handleRetry = () => {
    try {
      localStorage.removeItem(FINAL_RESULT_KEY(userKey));
    } catch (e) {
      console.warn("Failed to clear final result", e);
    }
    navigate("/quiz-final-intro");
  };

  const handleBack = () => {
    const lastDone = [...tutorials].reverse().find((t) => quizDone(t.id));
    if (lastDone) {
      navigate(`/quiz-results-player/${lastDone.id}`);
      return;
    }
    navigate("/quiz-final-intro");
  };

  const handleFinish = () => {
    navigate("/dashboard-modul", { state: { analytics: { finalScore: score } } });
  };

  return (
    <LayoutWrapper
      embed={embed}
      showFooter={false} 
      contentClassName={`pt-20 pb-24 ${sidebarOpen ? "pr-80" : ""} transition-all duration-300`}
      sidePanel={
        !embed ? (
          <ModuleSidebar
            items={sidebarItems}
            currentId={null}
            onSelect={handleSelectSidebar}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen((p) => !p)}
          />
        ) : null
      }
      bottomBar={
        !embed ? (
          <BottomBarTwoActions
            leftLabel="← Kembali"
            rightLabel="Dashboard →"
            onLeft={handleBack}
            onRight={handleFinish}
          />
        ) : null
      }
    >
      <div className="max-w-3xl mx-auto py-10 space-y-8">
        <ResultCard
          title="Quiz Akhir Modul"
          subtitle="Berkenalan dengan AI"
          score={score}
          correct={correct}
          total={total}
          duration={duration}
          isPass={score >= 70}
          onRetry={handleRetry}
          onReview={() => setShowReview((v) => !v)}
          reviewLabel={showReview ? "Tutup Review" : "Review Soal"}
        />

        {showReview && <AnswerReview answers={answers} questions={questions} />}
      </div>
    </LayoutWrapper>
  );
};

export default FinalQuizResultPage;