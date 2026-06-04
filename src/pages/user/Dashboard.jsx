import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap, Flame, Trophy, BookOpen, Target, Code2,
  ChevronRight, Star, TrendingUp, Clock, Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import RadarChart from '../../components/charts/RadarChart';
import ProgressRing from '../../components/charts/ProgressRing';

const modules = [
  { id: 'module-01', title: 'Computer Fundamentals', icon: '🖥️', lessons: 6 },
  { id: 'module-02', title: 'Introduction to C', icon: '📝', lessons: 5 },
  { id: 'module-03', title: 'Variables & Data Types', icon: '📦', lessons: 5 },
  { id: 'module-04', title: 'Operators', icon: '⚙️', lessons: 5 },
  { id: 'module-05', title: 'Control Statements', icon: '🔀', lessons: 4 },
  { id: 'module-06', title: 'Control Flow: Loops', icon: '🔁', lessons: 4 },
  { id: 'module-07', title: 'Functions & Scope', icon: '📦', lessons: 4 },
  { id: 'module-08', title: 'Arrays & Contiguous Memory', icon: '📚', lessons: 3 },
  { id: 'module-09', title: 'Strings & Character Arrays', icon: '🔤', lessons: 3 },
  { id: 'module-10', title: 'Pointers & Memory Addresses', icon: '👉', lessons: 4 },
  { id: 'module-11', title: 'Structs & Unions', icon: '🧱', lessons: 5 },
  { id: 'module-12', title: 'Advanced Bit Manipulation', icon: '⚡', lessons: 4 },
  { id: 'module-13', title: 'Dynamic Memory', icon: '🧠', lessons: 4 },
  { id: 'module-14', title: 'The Preprocessor', icon: '🏗️', lessons: 4 },
  { id: 'module-15', title: 'Embedded Specifics', icon: '💻', lessons: 5 },
];

const levelNames = [
  'Novice', 'Apprentice', 'Developer', 'Engineer',
  'Architect', 'Master', 'Legend'
];

const levelThresholds = [0, 100, 500, 1500, 4000, 8000, 15000];

export default function Dashboard() {
  const { user } = useAuth();
  const state = useApp();

  const levelIndex = useMemo(() => {
    for (let i = levelThresholds.length - 1; i >= 0; i--) {
      if (state.xp >= levelThresholds[i]) return i;
    }
    return 0;
  }, [state.xp]);

  const currentLevel = levelNames[levelIndex];
  const nextLevel = levelNames[Math.min(levelIndex + 1, levelNames.length - 1)];
  const currentThreshold = levelThresholds[levelIndex];
  const nextThreshold = levelThresholds[Math.min(levelIndex + 1, levelThresholds.length - 1)] || state.xp;
  const levelProgress = nextThreshold > currentThreshold
    ? ((state.xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100
    : 100;

  const completedModulesCount = state.completedModules.length;
  const totalModules = modules.length;
  const overallProgress = totalModules > 0 ? Math.round((completedModulesCount / totalModules) * 100) : 0;

  const totalLessonsCompleted = state.completedLessons.length;
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons, 0);

  const quizAvg = useMemo(() => {
    const scores = Object.values(state.quizScores);
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, [state.quizScores]);

  const radarData = [
    { label: 'C Basics', value: Math.min(100, (totalLessonsCompleted / totalLessons) * 100 * 2) },
    { label: 'Pointers', value: 0 },
    { label: 'Embedded', value: 0 },
    { label: 'Protocols', value: 0 },
    { label: 'Linux', value: 0 },
    { label: 'Drivers', value: 0 },
    { label: 'Validation', value: 0 },
    { label: 'DSA', value: 0 },
  ];

  const recentAchievements = state.achievements.slice(-4);

  return (
    <div className="dashboard-grid slide-up">
      {/* Welcome Banner */}
      <div className="glass-card no-hover" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.05))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>
              Welcome back, <span className="gradient-text">{user?.name || 'Engineer'}</span>! 👋
            </h1>
            <p style={{ fontSize: 'var(--text-sm)' }}>
              Level: <strong style={{ color: 'var(--accent-violet)' }}>{currentLevel}</strong>
              {levelIndex < levelNames.length - 1 && (
                <span> · {nextThreshold - state.xp} XP to {nextLevel}</span>
              )}
            </p>
            <div className="progress-bar sm" style={{ maxWidth: '300px', marginTop: 'var(--space-3)' }}>
              <div className="progress-fill" style={{ width: `${levelProgress}%` }} />
            </div>
          </div>
          <Link to="/playground" className="btn btn-primary btn-lg">
            <Code2 size={18} />
            Open Playground
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon-wrapper cyan">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Overall Progress</div>
            <div className="stat-value">{overallProgress}%</div>
            <div className="stat-change">{completedModulesCount}/{totalModules} modules</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper amber">
            <Star size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Experience Points</div>
            <div className="stat-value">{state.xp.toLocaleString()}</div>
            <div className="stat-change">Level {levelIndex + 1} · {currentLevel}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper red">
            <Flame size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Learning Streak</div>
            <div className="stat-value">{state.streak.current} days</div>
            <div className="stat-change">Best: {state.streak.best} days</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <Target size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Quiz Average</div>
            <div className="stat-value">{quizAvg}%</div>
            <div className="stat-change">{Object.keys(state.quizScores).length} quizzes taken</div>
          </div>
        </div>
      </div>

      {/* Main Content: Radar + Modules */}
      <div className="dashboard-main">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Current Learning Path */}
          <div>
            <h3 className="section-title">
              <BookOpen size={20} />
              Learning Modules
            </h3>
            <div className="module-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
              {modules.map((mod) => {
                const isCompleted = state.completedModules.includes(mod.id);
                const lessonsInModule = state.completedLessons.filter(l => l.startsWith(mod.id.replace('module-', 'lesson-'))).length;
                const progress = Math.round((lessonsInModule / mod.lessons) * 100);

                return (
                  <Link key={mod.id} to={`/module/${mod.id}`} className="module-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <div className="module-icon">{mod.icon}</div>
                      <div>
                        <div className="module-title">{mod.title}</div>
                        <div className="module-meta">
                          <Clock size={12} />
                          <span>{mod.lessons} lessons</span>
                          {isCompleted && (
                            <span className="badge badge-success">✓ Complete</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="progress-bar sm">
                      <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="section-title">
              <Zap size={20} />
              Quick Actions
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)' }}>
              <Link to="/playground" className="glass-card interactive" style={{ padding: 'var(--space-4)', textAlign: 'center', textDecoration: 'none' }}>
                <Code2 size={24} style={{ color: 'var(--accent-cyan)', marginBottom: 'var(--space-2)' }} />
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
                  Code Playground
                </div>
              </Link>
              <Link to="/assessments" className="glass-card interactive" style={{ padding: 'var(--space-4)', textAlign: 'center', textDecoration: 'none' }}>
                <Target size={24} style={{ color: 'var(--accent-violet)', marginBottom: 'var(--space-2)' }} />
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
                  Take Quiz
                </div>
              </Link>
              <Link to="/interview-prep" className="glass-card interactive" style={{ padding: 'var(--space-4)', textAlign: 'center', textDecoration: 'none' }}>
                <Award size={24} style={{ color: 'var(--accent-pink)', marginBottom: 'var(--space-2)' }} />
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
                  Interview Prep
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Radar + Achievements */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Skill Radar */}
          <div className="glass-card no-hover">
            <h3 className="section-title" style={{ fontSize: 'var(--text-base)' }}>
              <TrendingUp size={18} />
              Skill Radar
            </h3>
            <RadarChart data={radarData} size={250} />
          </div>

          {/* Achievements */}
          <div className="glass-card no-hover">
            <h3 className="section-title" style={{ fontSize: 'var(--text-base)' }}>
              <Trophy size={18} />
              Recent Achievements
            </h3>
            {recentAchievements.length === 0 ? (
              <p style={{ fontSize: 'var(--text-sm)', textAlign: 'center', padding: 'var(--space-4)' }}>
                Complete lessons to earn badges! 🏆
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {recentAchievements.map((ach) => (
                  <div key={ach} className="achievement-card" style={{ padding: 'var(--space-3)' }}>
                    <div className="achievement-icon earned">🏆</div>
                    <div>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
                        {ach.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Link to="/achievements" style={{
              display: 'block', textAlign: 'center', fontSize: 'var(--text-sm)',
              marginTop: 'var(--space-3)', color: 'var(--accent-indigo)'
            }}>
              View all achievements →
            </Link>
          </div>

          {/* Interview Readiness */}
          <div className="glass-card no-hover">
            <h3 className="section-title" style={{ fontSize: 'var(--text-base)' }}>
              <Award size={18} />
              Interview Readiness
            </h3>
            <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-4)' }}>
              <ProgressRing value={overallProgress} size={120} label="Ready" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
