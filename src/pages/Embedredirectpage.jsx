import React, { useEffect } from "react";
import { useSearchParams, Navigate } from "react-router-dom";
import Loading from "../components/common/Loading";

/**
 * EmbedRedirectPage
 * 
 * Komponen ini menangani redirect dari format embed Dicoding LMS
 * Format: /embed/soal?tutorial={tutorial_id}&user={user_id}&start={intro|quiz}
 * 
 * Redirect options:
 * - start=intro → /quiz-intro/{tutorial_id}?embed=1&user={user_id}
 * - start=quiz (default) → /quiz-player/{tutorial_id}?embed=1&user={user_id}
 */
const EmbedRedirectPage = () => {
  const [searchParams] = useSearchParams();
  
  // Ambil parameter dari URL Dicoding
  const tutorial = searchParams.get("tutorial");
  const user = searchParams.get("user");
  const startFrom = searchParams.get("start"); // NEW: 'intro' or 'quiz' (default)

  // Log untuk debugging (bisa dihapus di production)
  useEffect(() => {
    console.log("[EmbedRedirect] Received params:", { tutorial, user, startFrom });
  }, [tutorial, user, startFrom]);

  // Validasi: Jika tidak ada tutorial ID, redirect ke home
  if (!tutorial) {
    console.error("[EmbedRedirect] Missing tutorial parameter");
    return <Navigate to="/home" replace />;
  }

  // Validasi: Pastikan tutorial ID adalah angka
  const tutorialId = parseInt(tutorial, 10);
  if (isNaN(tutorialId)) {
    console.error("[EmbedRedirect] Invalid tutorial ID:", tutorial);
    return <Navigate to="/home" replace />;
  }

  // Konstruksi URL target berdasarkan startFrom parameter
  let targetUrl;
  
  if (startFrom === "intro") {
    // Start from quiz intro page
    targetUrl = `/quiz-intro/${tutorialId}?embed=1${user ? `&user=${user}` : ""}`;
    console.log("[EmbedRedirect] Starting from INTRO");
  } else {
    // Default: start directly from quiz
    targetUrl = `/quiz-player/${tutorialId}?embed=1${user ? `&user=${user}` : ""}`;
    console.log("[EmbedRedirect] Starting from QUIZ");
  }
  
  console.log("[EmbedRedirect] Redirecting to:", targetUrl);

  // Redirect dengan replace untuk menghindari back button issue
  return <Navigate to={targetUrl} replace />;
};

export default EmbedRedirectPage;