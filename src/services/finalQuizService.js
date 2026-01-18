import api from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import authService from "./authService";


const mapFinalQuestions = (raw = []) =>
  raw.map((q) => ({
    id: q.id,
    assessment: q.assessment,
    multiple_choice: [
      { id: 1, option: q.option_1 },
      { id: 2, option: q.option_2 },
      { id: 3, option: q.option_3 },
      { id: 4, option: q.option_4 },
    ],
    tutorial_id: q.tutorial_id,
  }));

const finalQuizService = {
  getFinalQuestions: async () => {
    const token = authService.getToken();
    if (!token) throw new Error("Silakan login terlebih dahulu");

    const res = await api.get(API_ENDPOINTS.QUESTIONS_FINAL);
    const raw = res.data?.data || res.data || [];
    return mapFinalQuestions(raw);
  },

  submitFinalAnswers: async (answers) => {
    const token = authService.getToken();
    if (!token) throw new Error("Silakan login terlebih dahulu");

    const res = await api.post(API_ENDPOINTS.SUBMIT_FINAL_ANSWERS, { answers });
    return res.data;
  },
};

export default finalQuizService;