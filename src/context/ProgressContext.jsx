
import React, { createContext, useState, useCallback, useContext, useEffect, useRef } from 'react';
import { STORAGE_KEYS } from '../constants/config';
import { nsKey, getUserKey } from '../utils/storage';
import userService from '../services/userService';
import authService from '../services/authService';

export const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
  const userKey = getUserKey();
  const prevUserKeyRef = useRef(userKey);

  const loadProgressLocal = (ukey) => {
    try {
      return JSON.parse(sessionStorage.getItem(nsKey(STORAGE_KEYS.progress, ukey))) || {};
    } catch {
      return {};
    }
  };

  const [progress, setProgress] = useState(() => loadProgressLocal(userKey));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const prevKey = prevUserKeyRef.current;
    if (prevKey !== userKey) {
      setProgress({});
      prevUserKeyRef.current = userKey;
    }

    let cancelled = false;
    const fetchProgress = async () => {
      setLoading(true);
      setError(null);

      const token = authService.getToken();
      if (!token) {
        setProgress(loadProgressLocal(userKey));
        setLoading(false);
        return;
      }

      try {
        const res = await userService.getProfile(); // backend kembalikan progress map
        const backendProgress = res?.progress || {};
        if (!cancelled) {
          setProgress(backendProgress);
          sessionStorage.setItem(nsKey(STORAGE_KEYS.progress, userKey), JSON.stringify(backendProgress));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || 'Gagal memuat progres');
          setProgress(loadProgressLocal(userKey));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProgress();
    return () => {
      cancelled = true;
    };
  }, [userKey]);


  const updateTutorialProgress = useCallback((tutorialId, status = true) => {
    try {
      setProgress((prev) => {
        const updated = { ...prev, [tutorialId]: status };
        sessionStorage.setItem(nsKey(STORAGE_KEYS.progress, userKey), JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      setError(err.message);
    }
  }, [userKey]);

  const getTutorialProgress = useCallback((tutorialId) => progress[tutorialId] || false, [progress]);
  const getCompletedCount = useCallback(() => Object.values(progress).filter((status) => status === true).length, [progress]);
  const getTotalCount = useCallback(() => Object.keys(progress).length, [progress]);
  const getCompletionPercentage = useCallback(() => {
    const total = getTotalCount();
    if (total === 0) return 0;
    const completed = getCompletedCount();
    return Math.round((completed / total) * 100);
  }, [getTotalCount, getCompletedCount]);

  const resetProgress = useCallback(() => {
    try {
      const resetData = {};
      Object.keys(progress).forEach((key) => {
        resetData[key] = false;
      });
      setProgress(resetData);
      sessionStorage.setItem(nsKey(STORAGE_KEYS.progress, userKey), JSON.stringify(resetData));
    } catch (err) {
      setError(err.message);
    }
  }, [progress, userKey]);

  const value = {
    progress,
    loading,
    error,
    updateTutorialProgress,
    getTutorialProgress,
    getCompletedCount,
    getTotalCount,
    getCompletionPercentage,
    resetProgress,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};


export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return context;
};

export default ProgressContext;