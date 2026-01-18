/**
 * Type Definitions menggunakan JSDoc
 * Untuk autocomplete & type checking di IDE
 */

/**
 * @typedef {Object} User
 * @property {string} id - User ID
 * @property {string} name - Full name
 * @property {string} username - Username
 * @property {string} [token] - Auth token (JWT)
 * @property {number} [iat] - Token issued at time
 * @property {number} [exp] - Token expiration time
 * @property {string} created_at - Created timestamp
 */

/**
 * @typedef {Object} UserPreference
 * @property {string} id - Preference ID
 * @property {string} user_id - User ID
 * @property {string} theme - Theme: 'light' | 'dark'
 * @property {string} layout_width - Layout width: 'fluid' | 'fixed'
 * @property {string} font - Font family: 'sans' | 'serif' | 'mono'
 * @property {string} font_size - Font size: 'sm' | 'md' | 'lg' | 'xl'
 */

/**
 * @typedef {Object} UserProgress
 * @property {string} id - Progress ID
 * @property {string} user_id - User ID
 * @property {Object<string, boolean>} [tutorialProgress] - Tutorial completion status
 */

/**
 * @typedef {Object} Tutorial
 * @property {number} id - Tutorial ID
 * @property {string} title - Tutorial title
 * @property {string} content - Tutorial content (HTML)
 */

/**
 * @typedef {Object} TutorialDetail
 * @property {number} id - Tutorial ID
 * @property {string} title - Tutorial title
 * @property {string} content - Tutorial content (HTML)
 */

/**
 * @typedef {Object} Question
 * @property {string} id - Question ID
 * @property {string} user_id - User ID
 * @property {string} tutorial_id - Tutorial ID
 * @property {string} assessment - Question text
 * @property {string} option_1 - Option A
 * @property {string} option_2 - Option B
 * @property {string} option_3 - Option C
 * @property {string} option_4 - Option D
 */

/**
 * @typedef {Object} Answer
 * @property {string} soal_id - Question ID
 * @property {boolean} correct - Is correct
 */

/**
 * @typedef {Object} SubmitAssessmentRequest
 * @property {Array<Answer>} answers - Array of answers
 */

/**
 * @typedef {Object} QuestionFeedbackDetail
 * @property {string} summary - Summary feedback
 * @property {string} analysis - Detailed analysis
 * @property {string} advice - Improvement advice
 * @property {string} recommendation - Recommendations
 */

/**
 * @typedef {Object} SubmitAssessmentResponse
 * @property {boolean} success - Success status
 * @property {string} message - Response message
 * @property {string} assessment_key - Assessment key
 * @property {string} tutorial_key - Tutorial key
 * @property {number} score - Quiz score (0-100)
 * @property {number} benar - Correct answers count
 * @property {number} total - Total questions
 * @property {string} lama_mengerjakan - Duration (e.g., "67 detik")
 * @property {QuestionFeedbackDetail} feedback - Feedback details
 */

/**
 * @typedef {Object} AuthResponse
 * @property {boolean} success - Success status
 * @property {string} message - Response message
 * @property {User} user - User data
 * @property {UserPreference} [preference] - User preference
 * @property {UserProgress} [progress] - User progress
 */

/**
 * @typedef {Object} RegisterRequest
 * @property {string} name - Full name
 * @property {string} username - Username
 * @property {string} password - Password
 */

/**
 * @typedef {Object} LoginRequest
 * @property {string} username - Username
 * @property {string} password - Password
 */

/**
 * @typedef {Object} UpdatePreferenceRequest
 * @property {string} [theme] - Theme
 * @property {string} [layout_width] - Layout width
 * @property {string} [font] - Font
 * @property {string} [font_size] - Font size
 */

/**
 * @typedef {Object} APIError
 * @property {number} [status] - HTTP status code
 * @property {string} message - Error message
 * @property {Object} [data] - Additional error data
 */

/**
 * @typedef {Object} QuizState
 * @property {number} currentQuestionIndex - Current question index
 * @property {Object<number, string>} answers - User answers
 * @property {number} score - Quiz score
 * @property {Date} [startTime] - Quiz start time
 * @property {boolean} isSubmitted - Is quiz submitted
 * @property {string} [selectedAnswer] - Currently selected answer
 * @property {boolean} showFeedback - Show feedback
 */

/**
 * @typedef {Object} LearningState
 * @property {Array<Tutorial>} tutorials - List of tutorials
 * @property {Tutorial} [currentTutorial] - Current tutorial
 * @property {number} currentTutorialIndex - Current tutorial index
 * @property {boolean} loading - Loading state
 * @property {string} [error] - Error message
 * @property {Array<number>} completedTutorials - Completed tutorial IDs
 */

export default {
  // User types
  User: {},
  UserPreference: {},
  UserProgress: {},

  // Tutorial types
  Tutorial: {},
  TutorialDetail: {},

  // Quiz types
  Question: {},
  Answer: {},
  SubmitAssessmentRequest: {},
  SubmitAssessmentResponse: {},

  // Auth types
  AuthResponse: {},
  RegisterRequest: {},
  LoginRequest: {},
  UpdatePreferenceRequest: {},

  // Error type
  APIError: {},

  // State types
  QuizState: {},
  LearningState: {},
};