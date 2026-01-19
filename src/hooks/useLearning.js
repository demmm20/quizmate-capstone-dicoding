import { useState, useCallback, useEffect } from 'react';
import tutorialService from '../services/tutorialService';
import { MODULES_DATA } from '../constants/modulesData';

// Helper untuk cek embed mode
function isEmbedMode() {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get("embed") === "1" || sessionStorage.getItem("embed_mode") === "true";
  } catch {
    return false;
  }
}

const BASE_SUBMODULES = MODULES_DATA[0]?.submodules ?? [];

export const useLearning = () => {
  const [modules, setModules] = useState([]);
  const [tutorials] = useState(BASE_SUBMODULES);
  const [currentTutorial, setCurrentTutorial] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchModules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await tutorialService.getModules();
      console.log('Modules response:', response);
      setModules(response || []);
    } catch (err) {
      console.error('Error fetching modules:', err);
      setError(err.message || 'Failed to fetch modules');
    } finally {
      setLoading(false);
    }
  }, []);

  // === PERBAIKAN FUNGSI: Tutorial detail ===
  const getTutorialDetail = useCallback(async (tutorialId) => {
    try {
      setLoading(true);
      setError(null);
      const embed = isEmbedMode();
      let tutorial;
      if (embed) {
        tutorial = await tutorialService.getTutorialDetailIframe(tutorialId);
      } else {
        tutorial = await tutorialService.getTutorialDetail(tutorialId);
      }
      if (!tutorial) {
        setCurrentTutorial(null);
        setError(`Materi untuk tutorial ${tutorialId} belum tersedia.`);
        return null;
      }
      setCurrentTutorial(tutorial);
      console.log(`✅ useLearning: Tutorial ${tutorialId} content loaded`);
      return tutorial;
    } catch (err) {
      console.error(`❌ Error fetching tutorial ${tutorialId}:`, err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const selectTutorial = useCallback(
    async (tutorialId) => {
      console.log(`📋 useLearning: Selecting tutorial ${tutorialId}...`);
      const tutorial = await getTutorialDetail(tutorialId);
      if (!tutorial) return null;
      setCurrentTutorial(tutorial);
      return tutorial;
    },
    [getTutorialDetail]
  );

  const fetchTutorials = useCallback(async () => {
    console.log('📋 useLearning: Using static tutorials list');
    return tutorials;
  }, [tutorials]);

  // === PERBAIKAN FUNGSI: Fetch detail tutorial ===
  const fetchTutorialDetail = useCallback(
    async (id) => {
      const tutorial = tutorials.find((t) => t.id === id);
      if (tutorial && tutorial.content) {
        setCurrentTutorial(tutorial);
        console.log('Found tutorial in array:', tutorial);
        return tutorial;
      }

      setLoading(true);
      setError(null);
      try {
        const embed = isEmbedMode();
        let response;
        if (embed) {
          response = await tutorialService.getTutorialDetailIframe(id);
        } else {
          response = await tutorialService.getTutorialDetail(id);
        }
        if (!response) {
          setError(`Materi untuk tutorial ${id} belum tersedia.`);
          setCurrentTutorial(null);
          return null;
        }
        setCurrentTutorial(response);
        return response;
      } catch (err) {
        console.error('Error fetching tutorial detail:', err);
        setError(err.message || 'Failed to fetch tutorial');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [tutorials]
  );

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  return {
    modules,
    tutorials,
    currentTutorial,
    loading,
    error,
    fetchModules,
    fetchTutorials,
    fetchTutorialDetail,
    selectTutorial,
    getTutorialDetail,
  };
};