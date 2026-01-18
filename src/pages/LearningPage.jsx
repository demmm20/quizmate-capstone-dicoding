import React, { useContext, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import LayoutWrapper from "../components/Layout/LayoutWrapper";
import ModuleSidebar from "../components/Layout/ModuleSidebar";
import BottomBarTwoActions from "../components/Layout/BottomBarTwoActions";
import { useLearning } from "../hooks/useLearning";
import { useProgress } from "../context/ProgressContext";
import { Alert } from "../components/common";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Loading from "../components/common/Loading";
import { MaterialContent } from "../components/Features/learning";
import { UserContext } from "../context/UserContext";
import { buildSidebarItems, buildChain } from "../utils/navigationChain";
import { quizDone } from "../utils/accessControl";

const LearningPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const embed = searchParams.get("embed") === "1";

  const { currentTutorial, loading, error, selectTutorial, tutorials } =
    useLearning();
  const { getTutorialProgress } = useProgress();
  const { preferences } = useContext(UserContext);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen((p) => !p);

  useEffect(() => {
    if (id) {
      const parsed = parseInt(id, 10);
      if (!isNaN(parsed)) {
        selectTutorial(parsed).catch((err) =>
          console.error("Error selecting tutorial:", err)
        );
      }
    }
  }, [id, selectTutorial]);

  // Selesai jika progres backend true dan ada hasil kuis lokal
  const isSubmoduleCompleted = (tid) =>
    !!getTutorialProgress(tid) && quizDone(tid);

  const sidebarItems = useMemo(
    () => buildSidebarItems(tutorials, getTutorialProgress),
    [tutorials, getTutorialProgress]
  );

  const chain = buildChain(tutorials, currentTutorial?.id);
  const currentTitle =
    tutorials.find((t) => t.id === currentTutorial?.id)?.title ||
    currentTutorial?.title ||
    "";

  const goBackChain = () => {
    if (chain.idx <= 0) {
      navigate("/home");
      return;
    }
    const prev = tutorials[chain.idx - 1];
    navigate(`/quiz-results-player/${prev.id}`);
  };

  const goNextChain = () => {
    if (!currentTutorial) return;
    const tid = currentTutorial.id;
    const target = isSubmoduleCompleted(tid)
      ? `/quiz-results-player/${tid}`
      : `/quiz-intro/${tid}`;
    navigate(target);
  };

  const handleSelectSidebar = (item) => {
    if (item.type === "tutorial") {
      navigate(`/learning/${item.id}`);
    } else if (item.type === "quiz-sub") {
      const target = isSubmoduleCompleted(item.id)
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
      <LayoutWrapper
        showNavbar={!embed}
        showFooter={false}
        embed={embed}
        fullHeight
      >
        <Loading fullScreen text="Mempersiapkan kuis..." />
      </LayoutWrapper>
    );
  }

  if (error) {
    return (
      <LayoutWrapper fullHeight embed={embed} showFooter={false}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="max-w-md text-center">
            <Alert type="error" title="Terjadi Kesalahan" message={error} />
            <Button
              onClick={() => navigate("/home")}
              variant="primary"
              className="mt-4 cursor-pointer"
            >
              Kembali ke Beranda
            </Button>
          </div>
        </div>
      </LayoutWrapper>
    );
  }

  if (!currentTutorial) {
    return (
      <LayoutWrapper fullHeight embed={embed} showFooter={false}>
        <div className="flex items-center justifyCenter min-h-screen"></div>
      </LayoutWrapper>
    );
  }

  const isDark = preferences?.theme === "dark";
  const LAYOUT_WIDTH_MAP = { fluid: "max-w-screen-xl", boxed: "max-w-4xl" };
  const layoutWidthClass =
    LAYOUT_WIDTH_MAP[preferences.layout_width] || "max-w-full";

  return (
    <LayoutWrapper
      fullHeight
      embed={embed}
      showFooter={false}
      contentClassName={`pt-25 pb-24 ${
        sidebarOpen ? "pr-80" : ""
      } transition-all duration-300`}
      sidePanel={
        !embed ? (
          <ModuleSidebar
            items={sidebarItems}
            currentId={currentTutorial?.id}
            currentType="tutorial"
            onSelect={handleSelectSidebar}
            isOpen={sidebarOpen}
            onToggle={toggleSidebar}
          />
        ) : null
      }
      bottomBar={
        !embed ? (
          <BottomBarTwoActions
            leftLabel="← Kembali"
            rightLabel="Lanjut →"
            onLeft={goBackChain}
            onRight={goNextChain}
          />
        ) : null
      }
    >
      <div
        className={`max-w-4xl mx-auto px-8 transition-all duration-500 ${layoutWidthClass}`}
      >
        <Card
          className={`mb-8 rounded-md ${
            isDark
              ? "bg-[#111b2a] border-[#1f2a3a]"
              : "bg-white border-gray-200"
          }`}
          shadow="md"
          padding="lg"
          bordered
        >
          <div className="mb-6">
            <h1 className="text-4xl font-extrabold text-blue-600 mb-2">
              Belajar Dasar AI
            </h1>
            <h2
              className={`text-2xl font-medium mb-4 ${
                isDark ? "text-gray-100" : "text-gray-900"
              }`}
            >
              {currentTitle}
            </h2>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Submodul {chain.idx + 1}/{chain.total}
              </span>
              <span className="text-sm font-semibold text-green-500">
                {Math.round(((chain.idx + 1) / chain.total) * 100)}%
              </span>
            </div>
            <div
              className={`w-full h-2 rounded-full overflow-hidden ${
                isDark ? "bg-[#243349]" : "bg-gray-200"
              }`}
            >
              <div
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${((chain.idx + 1) / chain.total) * 100}%` }}
              />
            </div>
          </div>
        </Card>

        <p
          className={`text-sm mb-6 ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Belajar / Modul / {currentTitle}
        </p>

        <MaterialContent
          title={currentTitle}
          content={currentTutorial?.data?.content}
          loading={loading}
        />
      </div>
    </LayoutWrapper>
  );
};

export default LearningPage;
