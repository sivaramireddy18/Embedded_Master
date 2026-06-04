import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

const AppContext = createContext(null);

const STORAGE_KEY = 'embedmaster-progress';

/** Level thresholds — sorted ascending by minXP. */
const LEVEL_THRESHOLDS = [
  { minXP: 0, name: 'Novice' },
  { minXP: 100, name: 'Apprentice' },
  { minXP: 500, name: 'Developer' },
  { minXP: 1500, name: 'Engineer' },
  { minXP: 4000, name: 'Architect' },
  { minXP: 8000, name: 'Master' },
  { minXP: 15000, name: 'Legend' },
];

const DEFAULT_STATE = {
  xp: 0,
  streak: { current: 0, best: 0, lastDate: null },
  completedLessons: [],
  completedModules: [],
  quizScores: {},
  achievements: [],
  bookmarks: [],
  currentModule: null,
};

/**
 * Calculate the current level object from XP.
 * Returns { name, minXP, index, nextLevel, xpToNext, progress }
 */
function calculateLevel(xp) {
  let levelIndex = 0;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i].minXP) {
      levelIndex = i;
      break;
    }
  }

  const current = LEVEL_THRESHOLDS[levelIndex];
  const next = LEVEL_THRESHOLDS[levelIndex + 1] || null;

  const xpIntoLevel = xp - current.minXP;
  const xpNeeded = next ? next.minXP - current.minXP : 0;
  const progress = next ? Math.min((xpIntoLevel / xpNeeded) * 100, 100) : 100;

  return {
    name: current.name,
    minXP: current.minXP,
    index: levelIndex,
    nextLevel: next?.name || null,
    xpToNext: next ? next.minXP - xp : 0,
    progress,
  };
}

/**
 * Load persisted state from localStorage, merging with defaults
 * so newly added keys are always present.
 */
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_STATE, ...parsed };
    }
  } catch {
    // Corrupt or unavailable — start fresh
  }
  return { ...DEFAULT_STATE };
}

/**
 * Persist state to localStorage.
 */
function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    console.error('Failed to persist app state to localStorage');
  }
}

/**
 * Check if today's date (YYYY-MM-DD) matches the given dateString.
 */
function isToday(dateString) {
  if (!dateString) return false;
  const today = new Date().toISOString().split('T')[0];
  return dateString === today;
}

/**
 * Check if the given dateString was yesterday.
 */
function isYesterday(dateString) {
  if (!dateString) return false;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateString === yesterday.toISOString().split('T')[0];
}

function todayString() {
  return new Date().toISOString().split('T')[0];
}

export function AppProvider({ children }) {
  const [state, setState] = useState(loadState);

  // Persist to localStorage whenever state changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  /**
   * Update the streak based on activity today.
   */
  const updateStreak = useCallback(() => {
    setState((prev) => {
      const { streak } = prev;
      const today = todayString();

      // Already recorded today
      if (streak.lastDate === today) return prev;

      let newCurrent;
      if (isYesterday(streak.lastDate)) {
        // Consecutive day
        newCurrent = streak.current + 1;
      } else if (streak.lastDate === null || !isToday(streak.lastDate)) {
        // Streak broken or first time
        newCurrent = 1;
      } else {
        newCurrent = streak.current;
      }

      const newBest = Math.max(streak.best, newCurrent);

      return {
        ...prev,
        streak: { current: newCurrent, best: newBest, lastDate: today },
      };
    });
  }, []);

  /**
   * Complete a lesson and earn XP.
   */
  const completeLesson = useCallback(
    (lessonId, xpReward = 25) => {
      setState((prev) => {
        if (prev.completedLessons.includes(lessonId)) return prev;

        return {
          ...prev,
          xp: prev.xp + xpReward,
          completedLessons: [...prev.completedLessons, lessonId],
        };
      });
      updateStreak();
    },
    [updateStreak]
  );

  /**
   * Complete a module.
   */
  const completeModule = useCallback((moduleId) => {
    setState((prev) => {
      if (prev.completedModules.includes(moduleId)) return prev;
      return {
        ...prev,
        completedModules: [...prev.completedModules, moduleId],
      };
    });
  }, []);

  /**
   * Record a quiz score for a module and earn XP based on score.
   */
  const completeQuiz = useCallback(
    (moduleId, score) => {
      const normalizedScore = Math.max(0, Math.min(100, score));
      const xpEarned = Math.round(normalizedScore * 0.5); // up to 50 XP per quiz

      setState((prev) => {
        const existingScore = prev.quizScores[moduleId] || 0;
        // Only award XP if this is a new high score
        const xpDelta = normalizedScore > existingScore ? xpEarned : 0;

        return {
          ...prev,
          xp: prev.xp + xpDelta,
          quizScores: {
            ...prev.quizScores,
            [moduleId]: Math.max(existingScore, normalizedScore),
          },
        };
      });
      updateStreak();
    },
    [updateStreak]
  );

  /**
   * Unlock an achievement.
   */
  const unlockAchievement = useCallback((achievementId, xpReward = 0) => {
    setState((prev) => {
      if (prev.achievements.includes(achievementId)) return prev;
      return {
        ...prev,
        xp: prev.xp + xpReward,
        achievements: [...prev.achievements, achievementId],
      };
    });
  }, []);

  /**
   * Add a bookmark.
   */
  const addBookmark = useCallback((id) => {
    setState((prev) => {
      if (prev.bookmarks.includes(id)) return prev;
      return {
        ...prev,
        bookmarks: [...prev.bookmarks, id],
      };
    });
  }, []);

  /**
   * Remove a bookmark.
   */
  const removeBookmark = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      bookmarks: prev.bookmarks.filter((b) => b !== id),
    }));
  }, []);

  /**
   * Toggle a bookmark on/off.
   */
  const toggleBookmark = useCallback((id) => {
    setState((prev) => {
      const exists = prev.bookmarks.includes(id);
      return {
        ...prev,
        bookmarks: exists
          ? prev.bookmarks.filter((b) => b !== id)
          : [...prev.bookmarks, id],
      };
    });
  }, []);

  /**
   * Set the currently active module.
   */
  const setCurrentModule = useCallback((moduleId) => {
    setState((prev) => ({
      ...prev,
      currentModule: moduleId,
    }));
  }, []);

  /**
   * Reset all progress (useful for testing / settings page).
   */
  const resetProgress = useCallback(() => {
    setState({ ...DEFAULT_STATE });
  }, []);

  // Derived values
  const level = useMemo(() => calculateLevel(state.xp), [state.xp]);

  const value = useMemo(
    () => ({
      // State
      xp: state.xp,
      level,
      streak: state.streak,
      completedLessons: state.completedLessons,
      completedModules: state.completedModules,
      quizScores: state.quizScores,
      achievements: state.achievements,
      bookmarks: state.bookmarks,
      currentModule: state.currentModule,

      // Actions
      completeLesson,
      completeModule,
      completeQuiz,
      unlockAchievement,
      addBookmark,
      removeBookmark,
      toggleBookmark,
      setCurrentModule,
      resetProgress,
      calculateLevel,

      // Utilities
      isLessonCompleted: (id) => state.completedLessons.includes(id),
      isModuleCompleted: (id) => state.completedModules.includes(id),
      isBookmarked: (id) => state.bookmarks.includes(id),
      hasAchievement: (id) => state.achievements.includes(id),
      getQuizScore: (id) => state.quizScores[id] || null,
    }),
    [
      state,
      level,
      completeLesson,
      completeModule,
      completeQuiz,
      unlockAchievement,
      addBookmark,
      removeBookmark,
      toggleBookmark,
      setCurrentModule,
      resetProgress,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export { LEVEL_THRESHOLDS, calculateLevel };
export default AppContext;
