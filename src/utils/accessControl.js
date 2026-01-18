import { getUserKey } from "./storage";

// Quiz unlock: gunakan progres backend saja di layer pemanggil
export const canAccessTutorial = (tutorials, idx, getProgress) => {
  if (idx === 0) return true;
  const prevId = tutorials[idx - 1]?.id;
  return prevId ? !!getProgress(prevId) : false;
};

export const canAccessQuiz = (tid, getProgress) => !!getProgress(tid);

export const allQuizDone = (tutorials, getProgress) =>
  tutorials.every((t) => !!getProgress(t.id));

export const quizDone = (tid, userKey = getUserKey()) => {
  if (typeof window === "undefined") return false;
  try {
    return !!localStorage.getItem(`${userKey}:quiz-result-${tid}`);
  } catch {
    return false;
  }
};

// Final quiz done di local (hasil tersimpan)
export const finalQuizDone = (userKey = getUserKey()) => {
  if (typeof window === "undefined") return false;
  try {
    return !!localStorage.getItem(`${userKey}:quiz-final-result`);
  } catch {
    return false;
  }
};