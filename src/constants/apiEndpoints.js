export const API_ENDPOINTS = {
  REGISTER: "/register",
  LOGIN: "/login",
  LOGOUT: "/logout",

  USERS: "/users",
  USER_PROFILE: "/users",
  USER_PREFERENCES: "/users/preference",

  TUTORIALS: "/tutorials",
  TUTORIAL_DETAIL: (id) => `/tutorials/${id}`,
  ASSESSMENT: (id) => `/assessment/tutorial/${id}`,
  ASSESSMENT_BY_ID: (assessmentId) => `/assessment/${assessmentId}`,
  
  // ✅ NEW: Iframe/embed endpoint
  IFRAME_TUTORIAL: (id) => `/iframe/tutorial/${id}`,

  // ✅ NEW: PUBLIC/EMBED QUIZ endpoint (TAMBAHKAN BARIS INI)
  PUBLIC_ASSESSMENT: (id) => `/public/assessment/${id}`,

  SUBMIT_ASSESSMENT: (tutorialId, assessmentId) =>
    `/submit/tutorial/${tutorialId}/assessment/${assessmentId}`,
  PROGRESS_RESET: "/progress-reset",

  QUESTIONS_FINAL: "/questions-final",
  SUBMIT_FINAL_ANSWERS: "/submit-answers",
};