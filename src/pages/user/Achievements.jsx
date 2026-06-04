import React from 'react';
import { Trophy } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const allAchievements = [
  { id: 'first-login', title: 'Welcome Aboard', description: 'Log in for the first time', icon: '🚀', category: 'learning' },
  { id: 'first-lesson', title: 'First Steps', description: 'Complete your first lesson', icon: '📖', category: 'learning' },
  { id: 'hello-world', title: 'Hello World', description: 'Write your first C program', icon: '👋', category: 'learning' },
  { id: 'five-lessons', title: 'Getting Started', description: 'Complete 5 lessons', icon: '📚', category: 'learning' },
  { id: 'ten-lessons', title: 'Knowledge Seeker', description: 'Complete 10 lessons', icon: '🎯', category: 'learning' },
  { id: 'module-complete', title: 'Module Master', description: 'Complete an entire module', icon: '🏅', category: 'learning' },
  { id: 'binary-master', title: 'Binary Master', description: 'Master binary conversions', icon: '🔢', category: 'mastery' },
  { id: 'bit-wizard', title: 'Bit Wizard', description: 'Master bitwise operations', icon: '⚡', category: 'mastery' },
  { id: 'pointer-pioneer', title: 'Pointer Pioneer', description: 'Complete the Pointers module', icon: '👉', category: 'mastery' },
  { id: 'quiz-ace', title: 'Quiz Ace', description: 'Score 100% on any quiz', icon: '💯', category: 'challenge' },
  { id: 'quiz-streak', title: 'Quiz Streak', description: 'Pass 5 quizzes in a row', icon: '🔥', category: 'challenge' },
  { id: 'bug-hunter', title: 'Bug Hunter', description: 'Solve 10 debugging challenges', icon: '🐛', category: 'challenge' },
  { id: 'week-warrior', title: 'Week Warrior', description: '7-day learning streak', icon: '💪', category: 'streak' },
  { id: 'month-master', title: 'Month Master', description: '30-day learning streak', icon: '🌟', category: 'streak' },
  { id: 'century', title: 'Century', description: '100-day learning streak', icon: '🏆', category: 'streak' },
  { id: 'code-ninja', title: 'Code Ninja', description: 'Write 50 programs in playground', icon: '🥷', category: 'mastery' },
  { id: 'early-bird', title: 'Early Bird', description: 'Study before 7 AM', icon: '🌅', category: 'special' },
  { id: 'night-owl', title: 'Night Owl', description: 'Study after 11 PM', icon: '🦉', category: 'special' },
  { id: 'all-modules', title: 'All-Star', description: 'Complete all modules', icon: '⭐', category: 'special' },
  { id: 'interview-ready', title: 'Interview Ready', description: 'Reach 80% interview readiness', icon: '🎓', category: 'special' },
];

const categories = [
  { id: 'all', label: 'All', icon: '🏆' },
  { id: 'learning', label: 'Learning', icon: '📖' },
  { id: 'mastery', label: 'Mastery', icon: '⚡' },
  { id: 'challenge', label: 'Challenge', icon: '🎯' },
  { id: 'streak', label: 'Streak', icon: '🔥' },
  { id: 'special', label: 'Special', icon: '✨' },
];

export default function Achievements() {
  const state = useApp();
  const [filter, setFilter] = React.useState('all');

  const filtered = filter === 'all'
    ? allAchievements
    : allAchievements.filter(a => a.category === filter);

  const earned = state.achievements || [];
  const earnedCount = allAchievements.filter(a => earned.includes(a.id)).length;

  return (
    <div className="slide-up">
      <div className="page-header">
        <h1>
          <Trophy size={28} style={{ verticalAlign: 'middle', marginRight: 'var(--space-2)' }} />
          Achievements
        </h1>
        <p>{earnedCount}/{allAchievements.length} achievements unlocked</p>
      </div>

      <div className="progress-bar" style={{ marginBottom: 'var(--space-6)', maxWidth: 400 }}>
        <div className="progress-fill" style={{ width: `${(earnedCount / allAchievements.length) * 100}%` }} />
      </div>

      {/* Category Filter */}
      <div className="tabs" style={{ marginBottom: 'var(--space-6)', display: 'inline-flex' }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`tab ${filter === cat.id ? 'active' : ''}`}
            onClick={() => setFilter(cat.id)}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Achievement Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
        {filtered.map(achievement => {
          const isEarned = earned.includes(achievement.id);
          return (
            <div key={achievement.id} className="achievement-card">
              <div className={`achievement-icon ${isEarned ? 'earned' : 'locked'}`}>
                {achievement.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 'var(--text-sm)', fontWeight: 600,
                  color: isEarned ? 'var(--text-primary)' : 'var(--text-muted)',
                }}>
                  {achievement.title}
                </div>
                <div style={{
                  fontSize: 'var(--text-xs)',
                  color: isEarned ? 'var(--text-tertiary)' : 'var(--text-muted)',
                }}>
                  {achievement.description}
                </div>
              </div>
              {isEarned && (
                <span className="badge badge-success">✓ Earned</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
