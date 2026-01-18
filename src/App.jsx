import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

// Providers/Contexts
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { LearningProvider } from "./context/LearningContext";
import { QuizProvider } from "./context/QuizContext";
import { ProgressProvider } from "./context/ProgressContext";

// Pages - Auth
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// Pages - Main
import ClassDetailPage from "./pages/HomePage";
import LearningPage from "./pages/LearningPage";
import QuizIntroPage from "./pages/QuizIntroPage";
import QuizPage from "./pages/QuizPage";           // PLAYER (iframe-capable)
import ResultsPage from "./pages/ResultsPage";     // RESULT (iframe-capable)
import NotFoundPage from "./pages/NotFoundPage";

// Pages - Final Quiz & Dashboard Modul
import FinalQuizIntroPage from "./pages/FinalQuizIntroPage";
import FinalQuizPage from "./pages/FinalQuizPage";
import FinalQuizResultPage from "./pages/FinalQuizResultPage";
import DashboardModulPage from "./pages/DashboardModulPage";

// Shell pages (opsional)
import QuizShellPage from "./pages/QuizShellPage";
import QuizResultsShellPage from "./pages/QuizResultsShellPage";

// TAMBAHAN BARU: Embed redirect page
import EmbedRedirectPage from "./pages/Embedredirectpage";

// Routes
import { ROUTES } from "./constants/routes";

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <ProgressProvider>
          <LearningProvider>
            <QuizProvider>
              <Routes>
                {/* Auth */}
                <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />

                {/* Redirect root */}
                <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />

                {/* TAMBAHAN BARU: Embed route untuk Dicoding LMS */}
                {/* Harus di atas routes lain untuk prioritas matching */}
                <Route path={ROUTES.EMBED_SOAL} element={<EmbedRedirectPage />} />

                {/* Main */}
                <Route path={ROUTES.HOME} element={<ClassDetailPage />} />
                <Route path={ROUTES.LEARNING} element={<LearningPage />} />
                <Route path={ROUTES.QUIZ_INTRO} element={<QuizIntroPage />} />

                {/* Shell (opsional) */}
                <Route path={ROUTES.QUIZ} element={<QuizShellPage />} />
                <Route path={ROUTES.QUIZ_RESULTS} element={<QuizResultsShellPage />} />

                {/* Alias player langsung (iframe) */}
                <Route path={ROUTES.QUIZ_PLAYER} element={<QuizPage />} />
                <Route path={ROUTES.QUIZ_RESULTS_PLAYER} element={<ResultsPage />} />

                {/* Final Quiz */}
                <Route path={ROUTES.QUIZ_FINAL_INTRO} element={<FinalQuizIntroPage />} />
                <Route path={ROUTES.QUIZ_FINAL} element={<FinalQuizPage />} />
                <Route path={ROUTES.QUIZ_FINAL_RESULT} element={<FinalQuizResultPage />} />

                {/* Dashboard */}
                <Route path={ROUTES.DASHBOARD_MODUL} element={<DashboardModulPage />} />

                {/* 404 */}
                <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
              </Routes>
            </QuizProvider>
          </LearningProvider>
        </ProgressProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;