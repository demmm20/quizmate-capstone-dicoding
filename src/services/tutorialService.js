
import api from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { MODULES_DATA } from "../constants/modulesData";


const BASE_SUBMODULES = MODULES_DATA[0]?.submodules ?? [];

const MOCK_TUTORIALS = BASE_SUBMODULES.map((t) => ({
  id: t.id,
  title: t.title,
  content: "<p>Konten mock.</p>",
}));

const getMock = (id) => MOCK_TUTORIALS.find((t) => t.id === id) || null;

export const tutorialService = {
  getModules: async () => MODULES_DATA,
  getModule: async (id) => MODULES_DATA.find((m) => m.id == id) || null,
  getMockTutorialTitle: (id) => getMock(id)?.title || `Tutorial ${id}`,
  getMockTutorials: () => MOCK_TUTORIALS,

  getTutorialDetail: async (id) => {
    try {
      const res = await api.get(API_ENDPOINTS.TUTORIAL_DETAIL(id));

      const envelope = res.data?.tutorial;
      const raw =
        envelope?.data ??
        res.data?.data ??
        res.data ??
        null;

      const extracted =
        raw?.content ??
        raw?.material ??
        raw?.materi ??
        raw?.body ??
        raw?.text ??
        raw?.html;

      const content =
        extracted !== undefined && extracted !== null
          ? extracted
          : typeof raw === "string"
          ? raw
          : Array.isArray(raw)
          ? JSON.stringify(raw, null, 2)
          : null;

      if (content === null) {
        const mock = getMock(id);
        return mock
          ? { id, title: mock.title, data: { content: mock.content }, progress: null }
          : null;
      }

      return {
        id,
        title: raw?.title || envelope?.title || tutorialService.getMockTutorialTitle(id),
        data: { content },
        progress: res.data?.progress || envelope?.progress || null,
      };
    } catch (err) {
      if (err.response?.status === 404) {
        const mock = getMock(id);
        return mock
          ? { id, title: mock.title, data: { content: mock.content }, progress: null }
          : null;
      }
      throw err;
    }
  },

  getAssessment: async (tutorialId) => {
    const res = await api.get(API_ENDPOINTS.ASSESSMENT(tutorialId));
    return res.data;
  },

  submitAnswers: async (tutorialId, assessmentId, answers) => {
    const res = await api.post(API_ENDPOINTS.SUBMIT_ASSESSMENT(tutorialId, assessmentId), { answers });
    return res.data;
  },
};

export default tutorialService;