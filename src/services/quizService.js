import api from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

// Helper cek embed mode
const isEmbedMode = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get("embed") === "1" || sessionStorage.getItem("embed_mode") === "true";
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
        url = API_ENDPOINTS.PUBLIC_ASSESSMENT(tutorialId); // Panggil endpoint backend public
      } else {
        url = API_ENDPOINTS.ASSESSMENT(tutorialId);        // Panggil endpoint auth backend
      }
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getQuestionsIframe: async function(tutorialId) {
    return this.getQuestions(tutorialId);
  },

  // ...method lain (submitAnswers, resetProgress, dst) TETAP SAMA...
};

export default quizService;