/**
 * EmbedMaster — Achievements Registry
 *
 * Each achievement object contains:
 *   id          – unique string identifier
 *   title       – display name
 *   description – one-liner explanation
 *   icon        – emoji for quick visual identification
 *   category    – 'learning' | 'streak' | 'challenge' | 'mastery' | 'special'
 *   xpReward    – XP awarded when unlocked
 *   condition   – (state) => boolean; evaluates whether the condition is met
 */

const achievements = [
  // ═══════════════════════════════════════
  //  LEARNING — Core lesson milestones
  // ═══════════════════════════════════════
  {
    id: 'first-program',
    title: 'First Steps',
    description: 'Complete your very first lesson.',
    icon: '🎯',
    category: 'learning',
    xpReward: 10,
    condition: (s) => s.completedLessons.length >= 1,
  },
  {
    id: 'hello-world',
    title: 'Hello, World!',
    description: 'Write your first Hello World program.',
    icon: '👋',
    category: 'learning',
    xpReward: 15,
    condition: (s) => s.completedLessons.includes('hello-world'),
  },
  {
    id: 'five-lessons',
    title: 'Getting Started',
    description: 'Complete 5 lessons.',
    icon: '📖',
    category: 'learning',
    xpReward: 25,
    condition: (s) => s.completedLessons.length >= 5,
  },
  {
    id: 'ten-lessons',
    title: 'Dedicated Learner',
    description: 'Complete 10 lessons.',
    icon: '📚',
    category: 'learning',
    xpReward: 50,
    condition: (s) => s.completedLessons.length >= 10,
  },
  {
    id: 'twenty-five-lessons',
    title: 'Knowledge Seeker',
    description: 'Complete 25 lessons.',
    icon: '🧠',
    category: 'learning',
    xpReward: 100,
    condition: (s) => s.completedLessons.length >= 25,
  },
  {
    id: 'fifty-lessons',
    title: 'Half Century',
    description: 'Complete 50 lessons.',
    icon: '🏆',
    category: 'learning',
    xpReward: 200,
    condition: (s) => s.completedLessons.length >= 50,
  },
  {
    id: 'hundred-lessons',
    title: 'Centurion',
    description: 'Complete 100 lessons.',
    icon: '💯',
    category: 'learning',
    xpReward: 500,
    condition: (s) => s.completedLessons.length >= 100,
  },
  {
    id: 'first-module',
    title: 'Module Complete',
    description: 'Finish an entire module.',
    icon: '✅',
    category: 'learning',
    xpReward: 50,
    condition: (s) => s.completedModules.length >= 1,
  },
  {
    id: 'five-modules',
    title: 'Curriculum Crusher',
    description: 'Complete 5 modules.',
    icon: '🗂️',
    category: 'learning',
    xpReward: 150,
    condition: (s) => s.completedModules.length >= 5,
  },

  // ═══════════════════════════════════════
  //  STREAK — Consistency achievements
  // ═══════════════════════════════════════
  {
    id: 'three-day-streak',
    title: 'On a Roll',
    description: 'Maintain a 3-day learning streak.',
    icon: '🔥',
    category: 'streak',
    xpReward: 15,
    condition: (s) => s.streak.best >= 3,
  },
  {
    id: 'week-warrior',
    title: 'Week Warrior',
    description: 'Maintain a 7-day learning streak.',
    icon: '⚡',
    category: 'streak',
    xpReward: 50,
    condition: (s) => s.streak.best >= 7,
  },
  {
    id: 'fortnight-focus',
    title: 'Fortnight Focus',
    description: 'Maintain a 14-day learning streak.',
    icon: '💪',
    category: 'streak',
    xpReward: 100,
    condition: (s) => s.streak.best >= 14,
  },
  {
    id: 'month-master',
    title: 'Month Master',
    description: 'Maintain a 30-day learning streak.',
    icon: '🌟',
    category: 'streak',
    xpReward: 250,
    condition: (s) => s.streak.best >= 30,
  },
  {
    id: 'quarter-champion',
    title: 'Quarter Champion',
    description: 'Maintain a 90-day learning streak.',
    icon: '👑',
    category: 'streak',
    xpReward: 500,
    condition: (s) => s.streak.best >= 90,
  },

  // ═══════════════════════════════════════
  //  CHALLENGE — Quiz & exercise milestones
  // ═══════════════════════════════════════
  {
    id: 'first-quiz',
    title: 'Quiz Taker',
    description: 'Complete your first quiz.',
    icon: '📝',
    category: 'challenge',
    xpReward: 15,
    condition: (s) => Object.keys(s.quizScores).length >= 1,
  },
  {
    id: 'quiz-ace',
    title: 'Quiz Ace',
    description: 'Score 100% on any quiz.',
    icon: '🎯',
    category: 'challenge',
    xpReward: 75,
    condition: (s) => Object.values(s.quizScores).some((score) => score === 100),
  },
  {
    id: 'five-quizzes',
    title: 'Quiz Enthusiast',
    description: 'Complete 5 quizzes.',
    icon: '🧪',
    category: 'challenge',
    xpReward: 50,
    condition: (s) => Object.keys(s.quizScores).length >= 5,
  },
  {
    id: 'ten-perfect-quizzes',
    title: 'Perfectionist',
    description: 'Score 100% on 10 different quizzes.',
    icon: '💎',
    category: 'challenge',
    xpReward: 300,
    condition: (s) =>
      Object.values(s.quizScores).filter((score) => score === 100).length >= 10,
  },
  {
    id: 'bug-hunter',
    title: 'Bug Hunter',
    description: 'Solve 10 debugging challenges.',
    icon: '🐛',
    category: 'challenge',
    xpReward: 100,
    condition: (s) =>
      s.completedLessons.filter((id) => id.startsWith('debug-')).length >= 10,
  },
  {
    id: 'speed-demon',
    title: 'Speed Demon',
    description: 'Complete a quiz in under 2 minutes.',
    icon: '⏱️',
    category: 'challenge',
    xpReward: 50,
    condition: (s) => s.achievements.includes('speed-demon'), // manually awarded
  },

  // ═══════════════════════════════════════
  //  MASTERY — Topic-specific mastery
  // ═══════════════════════════════════════
  {
    id: 'binary-master',
    title: 'Binary Master',
    description: 'Complete all binary conversion exercises.',
    icon: '0️⃣',
    category: 'mastery',
    xpReward: 75,
    condition: (s) =>
      s.completedModules.includes('binary-numbers') ||
      s.completedLessons.filter((id) => id.startsWith('binary-')).length >= 5,
  },
  {
    id: 'bit-wizard',
    title: 'Bit Wizard',
    description: 'Master bitwise operations.',
    icon: '🧙',
    category: 'mastery',
    xpReward: 100,
    condition: (s) => s.completedModules.includes('bitwise-operations'),
  },
  {
    id: 'pointer-pioneer',
    title: 'Pointer Pioneer',
    description: 'Complete the pointers module.',
    icon: '📍',
    category: 'mastery',
    xpReward: 100,
    condition: (s) => s.completedModules.includes('pointers'),
  },
  {
    id: 'memory-maestro',
    title: 'Memory Maestro',
    description: 'Master memory management concepts.',
    icon: '💾',
    category: 'mastery',
    xpReward: 100,
    condition: (s) => s.completedModules.includes('memory-management'),
  },
  {
    id: 'struct-savant',
    title: 'Struct Savant',
    description: 'Complete the structs & unions module.',
    icon: '🏗️',
    category: 'mastery',
    xpReward: 75,
    condition: (s) => s.completedModules.includes('structs-unions'),
  },
  {
    id: 'interrupt-expert',
    title: 'Interrupt Expert',
    description: 'Master interrupts and ISRs.',
    icon: '⚡',
    category: 'mastery',
    xpReward: 125,
    condition: (s) => s.completedModules.includes('interrupts'),
  },
  {
    id: 'rtos-ranger',
    title: 'RTOS Ranger',
    description: 'Complete the RTOS fundamentals module.',
    icon: '🔄',
    category: 'mastery',
    xpReward: 150,
    condition: (s) => s.completedModules.includes('rtos-fundamentals'),
  },
  {
    id: 'peripheral-pro',
    title: 'Peripheral Pro',
    description: 'Master GPIO, UART, SPI, and I2C.',
    icon: '🔌',
    category: 'mastery',
    xpReward: 150,
    condition: (s) =>
      ['gpio', 'uart', 'spi', 'i2c'].every((m) =>
        s.completedModules.includes(m)
      ),
  },
  {
    id: 'register-ruler',
    title: 'Register Ruler',
    description: 'Complete the registers & hardware abstraction module.',
    icon: '🔧',
    category: 'mastery',
    xpReward: 100,
    condition: (s) => s.completedModules.includes('registers'),
  },

  // ═══════════════════════════════════════
  //  SPECIAL — Unique & hidden achievements
  // ═══════════════════════════════════════
  {
    id: 'night-owl',
    title: 'Night Owl',
    description: 'Complete a lesson between midnight and 5 AM.',
    icon: '🦉',
    category: 'special',
    xpReward: 25,
    condition: (s) => s.achievements.includes('night-owl'), // awarded by time check
  },
  {
    id: 'early-bird',
    title: 'Early Bird',
    description: 'Complete a lesson between 5 AM and 7 AM.',
    icon: '🐦',
    category: 'special',
    xpReward: 25,
    condition: (s) => s.achievements.includes('early-bird'), // awarded by time check
  },
  {
    id: 'bookworm',
    title: 'Bookworm',
    description: 'Bookmark 10 lessons for later.',
    icon: '🔖',
    category: 'special',
    xpReward: 20,
    condition: (s) => s.bookmarks.length >= 10,
  },
  {
    id: 'xp-hunter',
    title: 'XP Hunter',
    description: 'Earn 1,000 XP total.',
    icon: '⭐',
    category: 'special',
    xpReward: 50,
    condition: (s) => s.xp >= 1000,
  },
  {
    id: 'xp-legend',
    title: 'XP Legend',
    description: 'Earn 10,000 XP total.',
    icon: '🌠',
    category: 'special',
    xpReward: 200,
    condition: (s) => s.xp >= 10000,
  },
  {
    id: 'completionist',
    title: 'Completionist',
    description: 'Unlock 25 other achievements.',
    icon: '🏅',
    category: 'special',
    xpReward: 500,
    condition: (s) => s.achievements.length >= 25,
  },
];

/** Quick lookup map: id → achievement */
export const achievementsMap = Object.fromEntries(
  achievements.map((a) => [a.id, a])
);

/** All distinct categories */
export const achievementCategories = [
  ...new Set(achievements.map((a) => a.category)),
];

/** Get achievements filtered by category */
export function getAchievementsByCategory(category) {
  return achievements.filter((a) => a.category === category);
}

/**
 * Evaluate which achievements should be newly unlocked.
 * Returns array of achievement objects that are met but not yet in state.achievements.
 */
export function checkNewAchievements(state) {
  return achievements.filter(
    (a) => !state.achievements.includes(a.id) && a.condition(state)
  );
}

export default achievements;
