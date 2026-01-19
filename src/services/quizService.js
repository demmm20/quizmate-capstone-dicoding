import api from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

// Cek mode embed dari URL/sessionStorage
const isEmbedMode = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("embed") === "1") return true;
    if (sessionStorage.getItem("embed_mode") === "true") return true;
    if (window.location.pathname.startsWith("/embed/")) return true;
    return false;
  } catch (e) {
    return false;
  }
};

export const quizService = {
  getQuestions: async (tutorialId) => {
    try {
      const embed = isEmbedMode();
      let url;
      if (embed) {
        url = API_ENDPOINTS.IFRAME_SOAL(tutorialId);    // PAKAI ENDPOINT /iframe/soal/:id SAAT EMBED
      } else {
        url = API_ENDPOINTS.ASSESSMENT(tutorialId);     // PROTECTED SAAT MODE NORMAL
      }
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getQuestionsIframe: async function (tutorialId) {
    // Untuk kompatibilitas dengan useQuiz, forward ke getQuestions (auto-pilih endpoint)
    return this.getQuestions(tutorialId);
  },

  getAssessmentById: async (assessmentId) => {
    try {
      const url = API_ENDPOINTS.ASSESSMENT_BY_ID(assessmentId);
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  submitAnswers: async (tutorialId, assessmentId, answers) => {
    try {
      const cleanAssessmentId = assessmentId.includes(":")
        ? assessmentId.split(":")[1]
        : assessmentId;
      const url = API_ENDPOINTS.SUBMIT_ASSESSMENT(tutorialId, cleanAssessmentId);
      const payload = { answers };
      const response = await api.post(url, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  resetProgress: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.PROGRESS_RESET);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default quizService;