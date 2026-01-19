import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useQuiz } from "../hooks/useQuiz";
import { useQuizProgress } from "../hooks/useQuizProgress";
import { useLearning } from "../hooks/useLearning";
import { useProgress } from "../context/ProgressContext";
import Button from "../components/common/Button";
import Loading from "../components/common/Loading";
import { Alert } from "../components/common";
import LayoutWrapper from "../components/Layout/LayoutWrapper";
import ModuleSidebar from "../components/Layout/ModuleSidebar";
import BottomBarTwoActions from "../components/Layout/BottomBarTwoActions";
import { buildSidebarItems, buildChain } from "../utils/navigationChain";
import { quizDone } from "../utils/accessControl";
import { getUserKey } from "../utils/storage";

const QuizIntroPage = () => {
  const navigate = useNavigate();
  const { tutorialId } = useParams();
  const [searchParams] = useSearchParams();
  const embed = searchParams.get("embed") === "1";

  // ====== Embed user handling (unchanged) ======
  const embedUserId = searchParams.get("user");
  useEffect(() => {
    if (embed && embedUserId) {
      try {
        sessionStorage.setItem("embed_user_id", embedUserId);
        sessionStorage.setItem("embed_mode", "true");
        sessionStorage.setItem("embed_tutorial_id", tutorialId || "");
      } catch (e) {}
    }
    return () => {
      if (embed) {
        try {
          sessionStorage.removeItem("embed_mode");
        } catch (e) {}
      }
    };
  }, [embed, embedUserId, tutorialId]);

  // Apply embed mode class to body (unchanged)
  useEffect(() => {
    if (embed) document.body.classList.add('embed-mode');
    else document.body.classList.remove('embed-mode');
    return () => document.body.classList.remove('embed-mode');
  }, [embed]);
  // ====== End embed user handling ======

  // HOOKS - tambahan reset/fetch
  const { fetchQuestions, questions, loading: quizLoading, error } = useQuiz();
  const { resetQuiz } = useQuizProgress();
  const { tutorials, currentTutorial, selectTutorial, fetchTutorials, loading: learningLoading } = useLearning();
  const { getTutorialProgress } = useProgress();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tutorialsFetched, setTutorialsFetched] = useState(false);
  const selectedRef = useRef(null);
  const userKey = getUserKey();
  const storageKey = tutorialId ? `${userKey}:quiz-progress-${tutorialId}` : null;
  const loading = quizLoading || learningLoading;
  const totalQuestions = questions.length || 3;
  const timePerQuestion = 30;
  
  const sidebarItems = useMemo(() => buildSidebarItems(tutorials, getTutorialProgress), [tutorials, getTutorialProgress]);
  const chain = useMemo(() => buildChain(tutorials, currentTutorial?.id), [tutorials, currentTutorial?.id]);

  // ====== INI YANG WAJIB DITAMBAH: RESET STATE & FETCH SOAL ======
  useEffect(() => {
    // Reset state quiz/progress dan fetch soal baru setiap kali masuk ke halaman ini/param berubah
    if (tutorialId) {
      resetQuiz();
      fetchQuestions(tutorialId);
      try {
        if (storageKey) localStorage.removeItem(storageKey);
      } catch (e) {}
    }
  }, [tutorialId]);
  // ================================================================

  useEffect(() => {
    if (!tutorialsFetched && tutorialId) {
      fetchTutorials(1).finally(() => setTutorialsFetched(true));
    }
  }, [tutorialId, tutorialsFetched, fetchTutorials]);

  useEffect(() => {
    if (!tutorialId || tutorials.length === 0) return;
    const parsedId = parseInt(tutorialId, 10);
    if (isNaN(parsedId)) return;
    if (selectedRef.current === parsedId) return;
    selectedRef.current = parsedId;
    selectTutorial(parsedId).catch((err) => console.error("Error selecting tutorial:", err));
  }, [tutorialId, tutorials.length, selectTutorial]);

  // Handler start quiz (unchanged)
  const handleStartQuiz = () => {
    if (!tutorialId) return;
    // Param embed/user harus tetap dikirim
    if (embed) {
      const params = new URLSearchParams({ embed: "1" });
      if (embedUserId) params.append("user", embedUserId);
      navigate(`/quiz-player/${tutorialId}?${params.toString()}`);
    } else {
      navigate(`/quiz/${tutorialId}`);
    }
  };

  const handleSelectSidebar = (item) => {
    if (item.type === "tutorial") {
      navigate(`/learning/${item.id}`);
    } else if (item.type === "quiz-sub") {
      const target = getTutorialProgress(item.id) && quizDone(item.id)
        ? `/quiz-results-player/${item.id}`
        : `/quiz-intro/${item.id}`;
      navigate(target);
    } else if (item.type === "quiz-final") {
      navigate("/quiz-final-intro");
    } else if (item.type === "dashboard") {
      navigate("/dashboard-modul");
    }
  };

  if (loading) {
    return (
      <LayoutWrapper showNavbar={!embed} showFooter={false} embed={embed} fullHeight>
        <Loading fullScreen text="Mempersiapkan kuis..." />
      </LayoutWrapper>
    );
  }

  if (error) {
    return (
      <LayoutWrapper showNavbar={!embed} showFooter={false} embed={embed} fullHeight>
        <Alert type="error" message={error} />
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper
      showNavbar={!embed}
      showFooter={false}
      embed={embed}
      contentClassName={`pt-28 pb-25 ${!embed && sidebarOpen ? "pr-80" : ""} transition-all duration-300`}
      sidePanel={
        !embed ? (
          <ModuleSidebar
            items={sidebarItems}
            currentId={parseInt(tutorialId, 10)}
            currentType="quiz-sub"
            onSelect={handleSelectSidebar}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen((p) => !p)}
          />
        ) : null
      }
      bottomBar={
        !embed ? (
          <BottomBarTwoActions leftLabel="← Submodul" rightLabel="Mulai Kuis →" onLeft={() => navigate(-1)} onRight={handleStartQuiz} />
        ) : null
      }
    >
      <div className="w-full flex justify-center px-4">
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="h-12 bg-gradient-to-r from-[#1e7bff] to-[#0f5eff]" />
            <div className="py-6 px-6">
              <div className="flex justify-center mb-4">
                <span className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full shadow">Quiz Submodul</span>
              </div>
              <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-2">LearnCheck!</h1>
              <p className="text-center text-gray-600 italic mb-6">"Let's have some fun and test your understanding!"</p>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
                <h2 className="text-xl font-semibold text-center text-gray-900 mb-4">{currentTutorial?.title || "Quiz Submodul"}</h2>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <div className="flex itemsCenter gap-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-600 text-lg font-semibold">≡</span>
                    <div>
                      <p className="text-sm text-gray-600">Jumlah Soal</p>
                      <p className="text-lg font-bold text-gray-900">{totalQuestions} Soal</p>
                    </div>
                  </div>
                  <div className="flex itemsCenter gap-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-600 text-lg font-semibold">⏱</span>
                    <div>
                      <p className="text-sm text-gray-600">Durasi</p>
                      <p className="text-lg font-bold text-gray-900">{timePerQuestion} detik/soal</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button onClick={handleStartQuiz} variant="primary" className="px-10 py-3 text-base cursor-pointer">
                  Mulai Kuis
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default QuizIntroPage;