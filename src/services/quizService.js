import api from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

// Helper untuk cek mode embed
const isEmbedMode = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("embed") === "1") return true;
    if (sessionStorage.getItem("embed_mode") === "true") return true;
    if (window.location.pathname.startsWith("/embed/")) return true;
    return false;
  } catch {
    return false;
  }
};

export const quizService = {
  getQuestions: async (tutorialId) => {
    try {
      const embed = isEmbedMode();
      let url;
      if (embed) {
        url = API_ENDPOINTS.IFRAME_SOAL(tutorialId); // GET public soal saat embed
      } else {
        url = API_ENDPOINTS.ASSESSMENT(tutorialId);
      }
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getQuestionsIframe: async function (tutorialId) {
    // Untuk kompatibilitas hooks yang memanggil getQuestionsIframe()
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
      const embed = isEmbedMode();
      const cleanAssessmentId = assessmentId.includes(":")
        ? assessmentId.split(":")[1]
        : assessmentId;
      let url;
      if (embed) {
        // Saat embed --> SUBMIT ke endpoint public!
        url = API_ENDPOINTS.IFRAME_SUBMIT_ASSESSMENT(tutorialId, cleanAssessmentId);
      } else {
        url = API_ENDPOINTS.SUBMIT_ASSESSMENT(tutorialId, cleanAssessmentId);
      }
      const payload = { answers }; // sama dengan backend
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