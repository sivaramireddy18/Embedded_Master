import React, { useState } from 'react';
import { Trophy, Award, Download, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

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
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [showCert, setShowCert] = useState(false);

  // Check if all 15 modules are complete
  const allModulesComplete = state.completedModules && state.completedModules.length >= 15;

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

      {allModulesComplete && (
        <div className="glass-card interactive" onClick={() => setShowCert(true)} style={{ marginBottom: 'var(--space-6)', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.02))', borderColor: 'rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Award size={20} /> Firmware Architect Certification Unlocked!
            </h3>
            <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 'var(--space-1)' }}>
              You have completed all 15 modules. Click to view your certificate.
            </p>
          </div>
          <button className="btn btn-primary" style={{ padding: 'var(--space-2) var(--space-4)' }}>View</button>
        </div>
      )}

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

      {/* Certificate Modal */}
      {showCert && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.8)', padding: 'var(--space-4)' }}>
          <div style={{ background: '#111827', border: '2px solid #D4AF37', borderRadius: '12px', padding: 'var(--space-10)', maxWidth: '800px', width: '100%', position: 'relative', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <button onClick={() => setShowCert(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}>
              <X size={24} />
            </button>
            <div style={{ border: '1px solid rgba(212, 175, 55, 0.3)', padding: 'var(--space-8)', borderRadius: '8px' }}>
              <Trophy size={64} style={{ color: '#D4AF37', margin: '0 auto var(--space-6)' }} />
              <h2 style={{ fontFamily: 'serif', fontSize: '2.5rem', color: '#F3F4F6', marginBottom: 'var(--space-2)' }}>Certificate of Completion</h2>
              <p style={{ color: '#9CA3AF', marginBottom: 'var(--space-6)' }}>This certifies that</p>
              <h3 style={{ fontSize: '2rem', color: '#D4AF37', borderBottom: '1px solid #374151', display: 'inline-block', paddingBottom: 'var(--space-2)', minWidth: '300px', marginBottom: 'var(--space-6)' }}>
                {user?.name || 'Student'}
              </h3>
              <p style={{ color: '#9CA3AF', maxWidth: '500px', margin: '0 auto var(--space-8)', lineHeight: 1.6 }}>
                has successfully completed the comprehensive EmbedMaster Firmware Engineering curriculum, mastering C Programming, Memory Architecture, Bit Manipulation, and Embedded Systems.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'var(--space-10)' }}>
                <div style={{ textAlign: 'center', borderTop: '1px solid #374151', paddingTop: 'var(--space-2)', minWidth: '150px' }}>
                  <div style={{ color: '#F3F4F6', fontWeight: 'bold' }}>EmbedMaster AI</div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>Lead Instructor</div>
                </div>
                <div style={{ width: 80, height: 80, border: '2px dashed #D4AF37', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37', fontSize: '12px', fontWeight: 'bold', transform: 'rotate(-15deg)' }}>
                  VERIFIED
                </div>
                <div style={{ textAlign: 'center', borderTop: '1px solid #374151', paddingTop: 'var(--space-2)', minWidth: '150px' }}>
                  <div style={{ color: '#F3F4F6' }}>{new Date().toLocaleDateString()}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>Date of Issue</div>
                </div>
              </div>
            </div>
            <button className="btn btn-outline" style={{ marginTop: 'var(--space-6)' }} onClick={() => window.print()}>
              <Download size={16} style={{ marginRight: 'var(--space-2)' }}/> Save as PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
