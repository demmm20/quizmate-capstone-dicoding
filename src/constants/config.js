
export const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 'https://api.capstone.web.id';

export const STORAGE_KEYS = {
  authToken: 'learncheck_auth_token',
  user: 'learncheck_user',
  preferences: 'learncheck_preferences',
  progress: 'learncheck_progress',
};

export const APP_CONFIG = {
  api: {
    baseURL: API_BASE_URL,
    timeout: 10000,
  },
  storage: {
    authToken: 'learncheck_auth_token',
    user: 'learncheck_user',
    preferences: 'learncheck_preferences',
    progress: 'learncheck_progress',
  },
};

export default APP_CONFIG;