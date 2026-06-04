import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, TrendingUp, Award, Clock, Search, ChevronRight,
  BarChart3, Flame, Star, BookOpen, Eye
} from 'lucide-react';

const STORAGE_KEY = 'embedmaster-users';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUsers(JSON.parse(stored));
      } catch (e) { /* empty */ }
    }
  }, []);

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Aggregate stats
  const totalUsers = users.length;
  const activeToday = users.filter(u => {
    const progress = getProgress(u.id);
    return progress?.streak?.lastDate === new Date().toISOString().split('T')[0];
  }).length;
  const avgXP = totalUsers > 0
    ? Math.round(users.reduce((sum, u) => sum + (getProgress(u.id)?.xp || 0), 0) / totalUsers)
    : 0;

  function getProgress(userId) {
    try {
      const stored = localStorage.getItem(`embedmaster-progress-${userId}`);
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  }

  const levelNames = ['Novice', 'Apprentice', 'Developer', 'Engineer', 'Architect', 'Master', 'Legend'];
  const levelThresholds = [0, 100, 500, 1500, 4000, 8000, 15000];

  function getLevel(xp) {
    for (let i = levelThresholds.length - 1; i >= 0; i--) {
      if (xp >= levelThresholds[i]) return { index: i, name: levelNames[i] };
    }
    return { index: 0, name: 'Novice' };
  }

  // User detail view
  if (selectedUser) {
    const progress = getProgress(selectedUser.id);
    const level = getLevel(progress?.xp || 0);
    return (
      <div className="slide-up">
        <button className="btn btn-ghost" onClick={() => setSelectedUser(null)} style={{ marginBottom: 'var(--space-4)' }}>
          ← Back to Users
        </button>
        <div className="glass-card no-hover" style={{
          marginBottom: 'var(--space-6)',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.04))'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div className="user-avatar" style={{ width: 64, height: 64, fontSize: 'var(--text-xl)' }}>
              {selectedUser.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <h2>{selectedUser.name}</h2>
              <p style={{ fontSize: 'var(--text-sm)' }}>{selectedUser.email}</p>
              <span className="badge badge-primary" style={{ marginTop: 'var(--space-1)' }}>
                {level.name} · Level {level.index + 1}
              </span>
            </div>
          </div>
        </div>

        <div className="stats-row" style={{ marginBottom: 'var(--space-6)' }}>
          <div className="stat-card">
            <div className="stat-icon-wrapper amber"><Star size={24} /></div>
            <div className="stat-info">
              <div className="stat-label">XP Points</div>
              <div className="stat-value">{(progress?.xp || 0).toLocaleString()}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper red"><Flame size={24} /></div>
            <div className="stat-info">
              <div className="stat-label">Current Streak</div>
              <div className="stat-value">{progress?.streak?.current || 0} days</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper green"><BookOpen size={24} /></div>
            <div className="stat-info">
              <div className="stat-label">Lessons Completed</div>
              <div className="stat-value">{progress?.completedLessons?.length || 0}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper violet"><Award size={24} /></div>
            <div className="stat-info">
              <div className="stat-label">Achievements</div>
              <div className="stat-value">{progress?.achievements?.length || 0}</div>
            </div>
          </div>
        </div>

        {/* Quiz Scores */}
        <div className="glass-card no-hover">
          <h3 className="section-title"><Award size={20} /> Quiz Scores</h3>
          {progress?.quizScores && Object.keys(progress.quizScores).length > 0 ? (
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr><th>Module</th><th>Score</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {Object.entries(progress.quizScores).map(([mod, score]) => (
                    <tr key={mod}>
                      <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{mod}</td>
                      <td>{score}%</td>
                      <td>
                        <span className={`badge ${score >= 70 ? 'badge-success' : 'badge-warning'}`}>
                          {score >= 70 ? 'Passed' : 'Needs Review'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>No quizzes taken yet.</p>
          )}
        </div>
      </div>
    );
  }

  // Main admin view
  return (
    <div className="slide-up">
      <div className="page-header">
        <h1>
          <BarChart3 size={28} style={{ verticalAlign: 'middle', marginRight: 'var(--space-2)' }} />
          Admin Dashboard
        </h1>
        <p>Monitor learner progress and platform analytics</p>
      </div>

      {/* Overview Stats */}
      <div className="stats-row" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="stat-card">
          <div className="stat-icon-wrapper cyan"><Users size={24} /></div>
          <div className="stat-info">
            <div className="stat-label">Total Users</div>
            <div className="stat-value">{totalUsers}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper green"><TrendingUp size={24} /></div>
          <div className="stat-info">
            <div className="stat-label">Active Today</div>
            <div className="stat-value">{activeToday}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper amber"><Star size={24} /></div>
          <div className="stat-info">
            <div className="stat-label">Average XP</div>
            <div className="stat-value">{avgXP.toLocaleString()}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper violet"><Award size={24} /></div>
          <div className="stat-info">
            <div className="stat-label">Quizzes Completed</div>
            <div className="stat-value">
              {users.reduce((sum, u) => {
                const p = getProgress(u.id);
                return sum + (p?.quizScores ? Object.keys(p.quizScores).length : 0);
              }, 0)}
            </div>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="glass-card no-hover">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <h3 className="section-title" style={{ margin: 0 }}>
            <Users size={20} /> All Users
          </h3>
          <div className="header-search" style={{ minWidth: 220 }}>
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-10)', color: 'var(--text-tertiary)' }}>
            <Users size={48} style={{ opacity: 0.2, marginBottom: 'var(--space-4)' }} />
            <p>{totalUsers === 0 ? 'No users registered yet.' : 'No matching users found.'}</p>
          </div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Level</th>
                  <th>XP</th>
                  <th>Streak</th>
                  <th>Lessons</th>
                  <th>Role</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => {
                  const progress = getProgress(user.id);
                  const level = getLevel(progress?.xp || 0);
                  return (
                    <tr key={user.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                          <div className="user-avatar" style={{ width: 28, height: 28, fontSize: 'var(--text-xs)' }}>
                            {user.name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }}>{user.name}</div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge badge-primary">{level.name}</span></td>
                      <td style={{ fontWeight: 600, color: 'var(--accent-amber)' }}>{(progress?.xp || 0).toLocaleString()}</td>
                      <td>
                        <span style={{ color: 'var(--accent-red)' }}>🔥 {progress?.streak?.current || 0}</span>
                      </td>
                      <td>{progress?.completedLessons?.length || 0}</td>
                      <td>
                        <span className={`badge ${user.role === 'admin' ? 'badge-danger' : 'badge-info'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-ghost btn-sm" onClick={() => setSelectedUser(user)}>
                          <Eye size={14} /> View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
