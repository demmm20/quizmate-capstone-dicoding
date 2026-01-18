import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LayoutWrapper from "../components/Layout/LayoutWrapper";

const QuizShellPage = () => {
  const { tutorialId } = useParams();
  const navigate = useNavigate();
  const [iframeSrc, setIframeSrc] = useState(`/quiz-player/${tutorialId}?embed=1`);

  useEffect(() => {
    window.history.replaceState({}, "", `/quiz/${tutorialId}`);

    const handler = (event) => {
      const data = event.data;
      if (!data) return;

      if (data.type === "quiz-submitted" && data.tutorialId?.toString() === tutorialId?.toString()) {
        if (data.result) {
          localStorage.setItem(`quiz-result-${tutorialId}`, JSON.stringify(data.result));
        }
        window.location.href = `/quiz-results-player/${tutorialId}`; // langsung buka player (sidebar/bottom muncul)
        return;
      }

      if (data.type === "nav-parent" && data.route) {
        navigate(data.route, { replace: true });
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [tutorialId, navigate]);

  const iframeStyles = useMemo(() => ({ width: "100%", height: "100vh", border: "none" }), []);

  return (
    <LayoutWrapper showNavbar showFooter={false} sidePanel={null} bottomBar={null} fullHeight embed={false}>
      <div className="w-full" style={{ minHeight: "100vh" }}>
        <iframe title="Quiz Player" src={iframeSrc} style={iframeStyles} />
      </div>
    </LayoutWrapper>
  );
};

export default QuizShellPage;