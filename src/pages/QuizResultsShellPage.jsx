import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import LayoutWrapper from "../components/Layout/LayoutWrapper";

const QuizResultsShellPage = () => {
  const { tutorialId } = useParams();

  const iframeStyles = useMemo(
    () => ({ width: "100%", height: "100vh", border: "none" }),
    []
  );

  return (
    <LayoutWrapper showNavbar showFooter={false} sidePanel={null} bottomBar={null} fullHeight embed={false}>
      <div className="w-full" style={{ minHeight: "100vh" }}>
        <iframe
          title="Quiz Results Player"
          src={`/quiz-results-player/${tutorialId}?embed=1`}
          style={iframeStyles}
        />
      </div>
    </LayoutWrapper>
  );
};

export default QuizResultsShellPage;