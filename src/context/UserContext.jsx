
import React, { createContext, useState, useCallback, useRef } from "react";
import userService from "../services/userService";
import { STORAGE_KEYS } from "../constants/config";
import { nsKey } from "../utils/storage";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [preferences, setPreferences] = useState(
    JSON.parse(sessionStorage.getItem(nsKey(STORAGE_KEYS.preferences))) || {
      theme: "light",
      font_size: "md",
      font: "sans",
      layout_width: "fluid",
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const updatingRef = useRef(false);

  const fetchPreferences = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getPreferences();
      setPreferences(response.preference);
      sessionStorage.setItem(nsKey(STORAGE_KEYS.preferences), JSON.stringify(response.preference));
    } catch (err) {
      setError(err.message || "Failed to fetch preferences");
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePreferences = useCallback(
    async (newPreferences) => {
      if (updatingRef.current) return;
      if (JSON.stringify(newPreferences) === JSON.stringify(preferences))
        return;

      updatingRef.current = true;
      setLoading(true);
      setError(null);
      try {
        const response = await userService.updatePreferences(newPreferences);
        setPreferences(response.preference);
        sessionStorage.setItem(nsKey(STORAGE_KEYS.preferences), JSON.stringify(response.preference));
        return response;
      } catch (err) {
        setError(err.message || "Failed to update preferences");
        throw err;
      } finally {
        updatingRef.current = false;
        setLoading(false);
      }
    },
    [preferences]
  );

  const changeTheme = useCallback(
    async (theme) => updatePreferences({ ...preferences, theme }),
    [preferences, updatePreferences]
  );

  const changeFontSize = useCallback(
    async (fontSize) =>
      updatePreferences({ ...preferences, font_size: fontSize }),
    [preferences, updatePreferences]
  );

  const changeFont = useCallback(
    async (font) => updatePreferences({ ...preferences, font }),
    [preferences, updatePreferences]
  );

  const changeLayoutWidth = useCallback(
    async (width) => updatePreferences({ ...preferences, layout_width: width }),
    [preferences, updatePreferences]
  );

  const value = {
    preferences,
    loading,
    error,
    fetchPreferences,
    updatePreferences,
    changeTheme,
    changeFontSize,
    changeFont,
    changeLayoutWidth,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
