import {
  canAccessTutorial,
  canAccessQuiz,
  allQuizDone,
  quizDone,
  finalQuizDone,
} from "./accessControl";

export const buildSidebarItems = (tutorials, getProgress) => {
  const items = [];

  tutorials.forEach((t, idx) => {
    const tutorialAllowed = canAccessTutorial(tutorials, idx, getProgress);
    items.push({
      type: "tutorial",
      id: t.id,
      label: t.title,
      desc: "Materi submodul",
      progressAllowed: tutorialAllowed,
    });

    items.push({
      type: "quiz-sub",
      id: t.id,
      label: `Quiz Submodul ${idx + 1}`,
      desc: "Quiz submodul",
      progressAllowed: canAccessQuiz(t.id, getProgress) || quizDone(t.id),
      completed: quizDone(t.id),
    });
  });

  const allDone = allQuizDone(tutorials, getProgress);
  const finalDone = finalQuizDone();

  items.push({
    type: "quiz-final",
    id: "quiz-final",
    label: "Quiz Final",
    desc: "Ujian akhir",
    progressAllowed: allDone, // boleh diakses bila semua submodul selesai
    completed: finalDone, // penanda sudah punya hasil final
  });

  items.push({
    type: "dashboard",
    id: "dashboard",
    label: "Dashboard Analytic",
    progressAllowed: allDone,
  });

  return items;
};

export const buildChain = (tutorials, currentId) => {
  const idx = tutorials.findIndex((t) => t.id === currentId);
  return { idx, total: tutorials.length };
};
