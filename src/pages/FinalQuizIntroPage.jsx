import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/common/Button";
import Loading from "../components/common/Loading";
import { Alert } from "../components/common";
import LayoutWrapper from "../components/Layout/LayoutWrapper";
import ModuleSidebar from "../components/Layout/ModuleSidebar";
import BottomBarTwoActions from "../components/Layout/BottomBarTwoActions";
import { useLearning } from "../hooks/useLearning";
import { useProgress } from "../context/ProgressContext";
import { buildSidebarItems, buildChain } from "../utils/navigationChain";
import { finalQuizDone } from "../utils/accessControl";

const FinalQuizIntroPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const embed = searchParams.get("embed") === "1";

  const { tutorials, currentTutorial, selectTutorial, fetchTutorials, loading: learningLoading } = useLearning();
  const { getTutorialProgress } = useProgress();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tutorialsFetched, setTutorialsFetched] = useState(false);
  const selectedRef = useRef(null);

  const loading = learningLoading;
  const totalQuestions = 10;
  const totalDuration = "10 menit";

  const sidebarItems = useMemo(() => buildSidebarItems(tutorials, getTutorialProgress), [tutorials, getTutorialProgress]);
  const chain = useMemo(() => buildChain(tutorials, currentTutorial?.id), [tutorials, currentTutorial?.id]);

  useEffect(() => {
    if (finalQuizDone()) {
      navigate("/quiz-final-result", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (!tutorialsFetched) {
      fetchTutorials(1).finally(() => setTutorialsFetched(true));
    }
  }, [tutorialsFetched, fetchTutorials]);

  useEffect(() => {
    if (tutorials.length === 0) return;
    const firstId = tutorials[0]?.id;
    if (!firstId) return;
    if (selectedRef.current === firstId) return;
    selectedRef.current = firstId;
    selectTutorial(firstId).catch((err) => console.error("Error selecting tutorial:", err));
  }, [tutorials, selectTutorial]);

  const handleStartQuiz = () => {
    if (finalQuizDone()) {
      navigate("/quiz-final-result");
      return;
    }
    navigate("/quiz-final");
  };

  const handleSelectSidebar = (item) => {
    if (item.type === "tutorial") navigate(`/learning/${item.id}`);
    else if (item.type === "quiz-sub") navigate(`/quiz-intro/${item.id}`);
    else if (item.type === "quiz-final") {
      const target = finalQuizDone() ? "/quiz-final-result" : "/quiz-final-intro";
      navigate(target);
    } else if (item.type === "dashboard") navigate("/dashboard-modul");
  };

  const handleBack = () => {
    if (finalQuizDone()) {
      navigate("/quiz-final-result");
      return;
    }
    try {
      navigate(-1);
    } catch {
      navigate("/home");
    }
  };

  if (loading) {
    return (
      <LayoutWrapper showNavbar={!embed} showFooter={false} embed={embed} fullHeight>
        <Loading fullScreen text="Mempersiapkan kuis akhir..." />
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
            currentId={currentTutorial?.id}
            currentType="quiz-final"
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
            rightLabel="Mulai Kuis →"
            onLeft={handleBack}
            onRight={handleStartQuiz}
          />
        ) : null
      }
    >
      <div className="w-full flex justify-center px-4">
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="h-12 bg-gradient-to-r from-[#1e7bff] to-[#0f5eff]" />
            <div className="py-6 px-6">
              <div className="flex justify-center mb-4">
                <span className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full shadow">
                  Quiz Akhir Modul
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
                LearnCheck Final!
              </h1>
              <p className="text-center text-gray-600 italic mb-6">
                “Let’s have some fun and test your understanding!”
              </p>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
                <h2 className="text-xl font-semibold text-center text-gray-900 mb-4">Evaluasi Akhir Modul</h2>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-600 text-lg font-semibold">≡</span>
                    <div>
                      <p className="text-sm text-gray-600">Jumlah Soal</p>
                      <p className="text-lg font-bold text-gray-900">{totalQuestions} Soal</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-600 text-lg font-semibold">⏱</span>
                    <div>
                      <p className="text-sm text-gray-600">Durasi</p>
                      <p className="text-lg font-bold text-gray-900">{totalDuration}</p>
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

          {!currentTutorial && (
            <div className="mt-6">
              <Alert
                type="info"
                title="Info"
                message="Tidak ada submodul aktif. Sidebar tetap dapat digunakan untuk navigasi modul."
              />
            </div>
          )}
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default FinalQuizIntroPage;