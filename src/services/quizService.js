import api from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

// ✅ Helper to check embed mode
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

// ✅ Helper to strip HTML tags
const stripHtml = (html) => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

// ✅ Helper to generate questions using Gemini AI
const generateQuestionsFromContent = async (content, tutorialId) => {
  try {
    console.log("[quizService] Generating questions from tutorial content using Gemini AI...");
    
    // Strip HTML and get plain text
    const plainText = stripHtml(content);
    
    // Truncate if too long (Gemini has token limits)
    const maxLength = 10000;
    const truncatedText = plainText.length > maxLength 
      ? plainText.substring(0, maxLength) + "..." 
      : plainText;
    
    // Call Gemini API to generate questions
    const GEMINI_API_KEY = "AIzaSyBvYS7tyLq0Dyq4IpPmgxDep6xfnA0ToV8";
    const GEMINI_MODEL = "gemini-2.0-flash-001";
    
    const prompt = `Berdasarkan materi pembelajaran berikut, buatkan 3 soal pilihan ganda dalam format JSON.

MATERI:
${truncatedText}

FORMAT JSON yang diinginkan:
{
  "questions": [
    {
      "id": "q1",
      "question": "Pertanyaan...",
      "multiple_choice": [
        {"option": "A. ...", "correct": false, "explanation": "..."},
        {"option": "B. ...", "correct": true, "explanation": "..."},
        {"option": "C. ...", "correct": false, "explanation": "..."},
        {"option": "D. ...", "correct": false, "explanation": "..."}
      ]
    }
  ]
}

PENTING:
- Buat HANYA 3 soal
- Setiap soal harus ada 4 pilihan (A, B, C, D)
- Hanya 1 jawaban benar per soal
- Berikan explanation singkat untuk setiap pilihan
- Return HANYA JSON, tanpa markdown atau text lain`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      }
    );

    const result = await response.json();
    const generatedText = result?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Extract JSON from response (might have markdown code blocks)
    let jsonText = generatedText.trim();
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/```\n?/g, "");
    }
    
    const parsed = JSON.parse(jsonText);
    const questions = parsed.questions || [];
    
    console.log("[quizService] Generated questions:", questions);
    
    return {
      data: questions,
      assessment_id: `assessment:${tutorialId}`,
      source: "gemini-generated"
    };
    
  } catch (error) {
    console.error("[quizService] Error generating questions:", error);
    throw new Error("Gagal generate questions dari content");
  }
};

export const quizService = {

  getQuestions: async (tutorialId) => {
    try {
      const embed = isEmbedMode();
      
      if (embed) {
        // ✅ EMBED MODE: Get tutorial content, then generate questions using AI
        console.log(`[quizService] Embed mode: Fetching tutorial content for ${tutorialId}`);
        
        const url = API_ENDPOINTS.IFRAME_TUTORIAL(tutorialId);
        const response = await api.get(url);
        
        console.log("[quizService] Tutorial response:", response.data);
        
        // Extract tutorial content
        const tutorialContent = response.data?.tutorial?.data?.content;
        
        if (!tutorialContent) {
          throw new Error("Tutorial content not found");
        }
        
        // Generate questions from content using Gemini AI
        const generatedQuestions = await generateQuestionsFromContent(tutorialContent, tutorialId);
        
        return generatedQuestions;
        
      } else {
        // ✅ NORMAL MODE: Use assessment endpoint (requires auth)
        console.log(`[quizService] Normal mode: Fetching from assessment endpoint`);
        
        const url = API_ENDPOINTS.ASSESSMENT(tutorialId);
        const response = await api.get(url);
        
        return response.data;
      }
      
    } catch (error) {
      console.error("[quizService] Error fetching questions:", error);
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