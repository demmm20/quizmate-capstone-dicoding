
import api from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { STORAGE_KEYS } from "../constants/config";

export const userService = {

  getProfile: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.USER_PROFILE);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },


  getPreferences: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.USER_PREFERENCES);

      sessionStorage.setItem(
        STORAGE_KEYS.preferences,
        JSON.stringify(response.data.preference)
      );

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },


  updatePreferences: async (preferences) => {
    try {
      const response = await api.patch(
        API_ENDPOINTS.USER_PREFERENCES,
        preferences
      );


      sessionStorage.setItem(
        STORAGE_KEYS.preferences,
        JSON.stringify(response.data.preference)
      );

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default userService;
