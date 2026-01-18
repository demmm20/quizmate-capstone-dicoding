import axios from "axios";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { API_BASE_URL } from "../constants/config";
import { saveAuth, clearAuth, loadAuth } from "../utils/authStorage";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const { token } = loadAuth();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: async (username, password, name) => {
    clearAuth(); 
    const response = await api.post(API_ENDPOINTS.REGISTER, { name, username, password });
    if (response.data.user?.token) {
      saveAuth(response.data.user, response.data.user.token);
    }
    return response.data;
  },

  login: async (username, password) => {
    clearAuth(); 
    const response = await api.post(API_ENDPOINTS.LOGIN, { username, password });
    if (response.data.user?.token) {
      saveAuth(response.data.user, response.data.user.token);
    }
    return response.data;
  },

  logout: () => {
    clearAuth();
    window.location.replace("/login"); 
  },

  getToken: () => loadAuth().token,
  getUser: () => loadAuth().user,
  isAuthenticated: () => !!loadAuth().token,
};

export default authService;