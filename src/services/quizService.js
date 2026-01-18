

import api from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const quizService = {

  getQuestions: async (tutorialId) => {
    try {
      const url = API_ENDPOINTS.ASSESSMENT(tutorialId);
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
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
      const url = `/submit/tutorial/${tutorialId}/assessment/${cleanAssessmentId}`;
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