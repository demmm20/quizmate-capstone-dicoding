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

  // Untuk EMBED (public, tanpa auth)
  IFRAME_TUTORIAL: (id) => `/iframe/tutorial/${id}`,
  IFRAME_SOAL: (id) => `/iframe/soal/${id}`,
  IFRAME_SUBMIT_ASSESSMENT: (tutorialId, assessmentId) =>
    `/iframe/submit/tutorial/${tutorialId}/assessment/${assessmentId}`,

  SUBMIT_ASSESSMENT: (tutorialId, assessmentId) =>
    `/submit/tutorial/${tutorialId}/assessment/${assessmentId}`,
  PROGRESS_RESET: "/progress-reset",

  QUESTIONS_FINAL: "/questions-final",
  SUBMIT_FINAL_ANSWERS: "/submit-answers",
};

export default API_ENDPOINTS;