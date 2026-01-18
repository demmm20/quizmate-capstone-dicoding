
import React, { createContext, useState, useCallback } from 'react';
import tutorialService from '../services/tutorialService';

export const LearningContext = createContext();

export const LearningProvider = ({ children }) => {
  const [tutorials, setTutorials] = useState([]);
  const [currentTutorial, setCurrentTutorial] = useState(null);
  const [currentTutorialIndex, setCurrentTutorialIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [completedTutorials, setCompletedTutorials] = useState([]);


  const fetchTutorials = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await tutorialService. getTutorials();
      const tutorialList = response.data?. tutorials || [];
      setTutorials(tutorialList);

      if (tutorialList.length > 0) {
        setCurrentTutorial(tutorialList[0]);
      }
    } catch (err) {
      setError(err. message || 'Failed to fetch tutorials');
    } finally {
      setLoading(false);
    }
  }, []);


  const selectTutorial = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await tutorialService. getTutorialDetail(id);
      const tutorial = tutorials.find((t) => t.id === id);
      
      setCurrentTutorial({
        ...tutorial,
        ... response. data,
      });

      const index = tutorials.findIndex((t) => t.id === id);
      setCurrentTutorialIndex(index);
    } catch (err) {
      setError(err.message || 'Failed to fetch tutorial');
    } finally {
      setLoading(false);
    }
  }, [tutorials]);


  const markTutorialCompleted = useCallback((tutorialId) => {
    setCompletedTutorials((prev) => {
      if (! prev.includes(tutorialId)) {
        return [...prev, tutorialId];
      }
      return prev;
    });
  }, []);


  const goToNextTutorial = useCallback(() => {
    if (currentTutorialIndex < tutorials.length - 1) {
      const nextTutorial = tutorials[currentTutorialIndex + 1];
      selectTutorial(nextTutorial.id);
    }
  }, [currentTutorialIndex, tutorials, selectTutorial]);


  const goToPreviousTutorial = useCallback(() => {
    if (currentTutorialIndex > 0) {
      const prevTutorial = tutorials[currentTutorialIndex - 1];
      selectTutorial(prevTutorial. id);
    }
  }, [currentTutorialIndex, tutorials, selectTutorial]);

  const value = {
    tutorials,
    currentTutorial,
    currentTutorialIndex,
    loading,
    error,
    completedTutorials,
    fetchTutorials,
    selectTutorial,
    markTutorialCompleted,
    goToNextTutorial,
    goToPreviousTutorial,
  };

  return (
    <LearningContext.Provider value={value}>
      {children}
    </LearningContext.Provider>
  );
};

export default LearningContext;