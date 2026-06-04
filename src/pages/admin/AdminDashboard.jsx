import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, TrendingUp, Award, Clock, Search, ChevronRight,
  BarChart3, Flame, Star, BookOpen, Eye, Database, Trash2
} from 'lucide-react';
import { collection, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db, isFirebaseEnabled } from '../../config/firebase';

const STORAGE_KEY = 'embedmaster-users';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const generateMockData = () => {
    if (!window.confirm("This will overwrite existing local storage users and progress with 50 fake users. Continue?")) return;
    
    const fakeUsers = [];
    for (let i = 1; i <= 50; i++) {
      const id = `mock-user-${i}`;
      fakeUsers.push({ id, name: `Student ${i}`, email: `student${i}@example.com`, role: 'user' });
      
      const xp = Math.floor(Math.random() * 10000);
      const fakeProgress = {
        xp,
        level: Math.floor(xp / 1000),
        streak: { current: Math.floor(Math.random() * 30), lastDate: new Date().toISOString().split('T')[0] },
        completedLessons: Array(Math.floor(Math.random() * 20)).fill('lesson'),
        completedModules: [],
        quizScores: { 'module-01': 80 + Math.floor(Math.random() * 20) },
        achievements: Array(Math.floor(Math.random() * 5)).fill('badge'),
        bookmarks: [],
        currentModule: 'module-01'
      };
      localStorage.setItem(`embedmaster-progress-${id}`, JSON.stringify(fakeProgress));
    }
    
    // Preserve existing admin
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]').filter(u => u.role === 'admin');
    const finalUsers = [...existing, ...fakeUsers];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(finalUsers));
    setUsers(finalUsers.map(u => ({ ...u, progress: getProgress(u.id) })));
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      if (isFirebaseEnabled) {
        try {
          const querySnapshot = await getDocs(collection(db, 'users'));
          const usersList = [];
          
          for (const userDoc of querySnapshot.docs) {
            const userData = userDoc.data();
            const uid = userDoc.id;
            
            // Fetch progress for this user
            let progressData = null;
            try {
              const progDoc = await getDoc(doc(db, 'users', uid, 'progress', 'data'));
              if (progDoc.exists()) progressData = progDoc.data();
            } catch (e) {
              console.error(`Error loading progress for user ${uid}:`, e);
            }
            
            usersList.push({
              id: uid,
              name: userData.name || 'Student',
              email: userData.email || '',
              role: userData.role || 'student',
              progress: progressData
            });
          }
          setUsers(usersList);
        } catch (error) {
          console.error("Error fetching global users from Firestore:", error);
        } finally {
          setLoading(false);
        }
      } else {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            const parsedUsers = JSON.parse(stored);
            const usersList = parsedUsers.map(u => ({
              ...u,
              progress: getProgress(u.id)
            }));
            setUsers(usersList);
          } catch (e) { /* empty */ }
        }
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user and all of their progress permanently?")) return;

    if (isFirebaseEnabled) {
      try {
        await deleteDoc(doc(db, 'users', userId, 'progress', 'data'));
        await deleteDoc(doc(db, 'users', userId));
        
        setUsers(prev => prev.filter(u => u.id !== userId));
        setSelectedUser(null);
        alert("User deleted successfully.");
      } catch (err) {
        alert("Failed to delete user: " + err.message);
      }
    } else {
      try {
        localStorage.removeItem(`embedmaster-progress-${userId}`);
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          const filtered = parsed.filter(u => u.id !== userId);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
          setUsers(filtered.map(u => ({ ...u, progress: getProgress(u.id) })));
        }
        setSelectedUser(null);
        alert("User deleted successfully.");
      } catch (e) {
        alert("Failed to delete user locally.");
      }
    }
  };

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
    const foundUser = users.find(u => u.id === userId);
    if (foundUser && foundUser.progress) return foundUser.progress;

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

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" style={{ width: 48, height: 48 }} />
        <h2>Syncing dashboard data...</h2>
      </div>
    );
  }

  // User detail view
  if (selectedUser) {
    const progress = getProgress(selectedUser.id);
    const level = getLevel(progress?.xp || 0);
    return (
      <div className="slide-up">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <button className="btn btn-ghost" onClick={() => setSelectedUser(null)}>
            ← Back to Users
          </button>
          {selectedUser.role !== 'admin' && (
            <button className="btn btn-outline" style={{ borderColor: 'var(--accent-red)', color: 'var(--accent-red)' }} onClick={() => handleDeleteUser(selectedUser.id)}>
              <Trash2 size={14} style={{ marginRight: 'var(--space-2)' }} /> Delete Student
            </button>
          )}
        </div>
        
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
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>
            <BarChart3 size={28} style={{ verticalAlign: 'middle', marginRight: 'var(--space-2)' }} />
            Admin Dashboard
          </h1>
          <p>Monitor learner progress and platform analytics</p>
        </div>
        {!isFirebaseEnabled && (
          <button className="btn btn-outline" onClick={generateMockData}>
            <Database size={16} style={{ marginRight: 'var(--space-2)' }} />
            Generate Mock Data
          </button>
        )}
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
                  <th>Actions</th>
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
                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => setSelectedUser(user)}>
                            <Eye size={14} style={{ marginRight: '4px' }} /> View
                          </button>
                          {user.role !== 'admin' && (
                            <button className="btn btn-ghost btn-sm text-red" onClick={() => handleDeleteUser(user.id)} style={{ color: 'var(--accent-red)' }}>
                              <Trash2 size={14} style={{ marginRight: '4px' }} /> Delete
                            </button>
                          )}
                        </div>
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
