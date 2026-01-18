/**
 * API Service
 * Axios instance dengan interceptor
 */
import axios from "axios";
import { APP_CONFIG } from "../constants/config";
import authService from "./authService";

const api = axios.create({
  baseURL: APP_CONFIG.api.baseURL,
  timeout: 30000, // 30 detik
  headers: {
    "Content-Type": "application/json",
  },
});

// ========== HELPER: Check if endpoint is public (no auth needed) ==========
const isPublicEndpoint = (url) => {
  const publicPaths = [
    '/iframe/',
    '/public/',
  ];
  return publicPaths.some(path => url.includes(path));
};

// ========== HELPER: Check if in embed mode ==========
const isEmbedMode = () => {
  try {
    // Check URL parameter
    const params = new URLSearchParams(window.location.search);
    if (params.get("embed") === "1") return true;
    
    // Check sessionStorage
    if (sessionStorage.getItem("embed_mode") === "true") return true;
    
    // Check if path starts with /embed/
    if (window.location.pathname.startsWith("/embed/")) return true;
    
    return false;
  } catch (e) {
    return false;
  }
};

// Request interceptor - add token to headers
// ✅ UPDATED: Skip auth header for public endpoints
api.interceptors.request.use(
  (config) => {
    // ✅ NEW: Check if endpoint is public (e.g., /iframe/*)
    if (isPublicEndpoint(config.url)) {
      console.log("[API] Public endpoint detected - skipping auth header:", config.url);
      return config;
    }
    
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("[API] Added auth token to request headers");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401 and logout
// UPDATED: Skip redirect untuk embed mode
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // ✅ NEW: Check if in embed mode
      const embed = isEmbedMode();
      
      if (embed) {
        // ✅ Embed mode: Don't redirect, just log warning
        console.warn("[API] 401 in embed mode - skipping auth redirect");
        console.warn("[API] User should be able to use mock/fallback data");
        // Let the error propagate so components can handle fallback
        return Promise.reject(error);
      } else {
        // Normal mode: Logout and redirect to login
        authService.logout();
        if (window.location.pathname !== "/login") {
          console.log("[API] 401 detected - redirecting to login");
          window.location.replace("/login");
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;