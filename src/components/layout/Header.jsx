import React from 'react';
import { Search, Sun, Moon, Bell, Flame, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';

export default function Header() {
  const { user, logout } = useAuth();
  const state = useApp();
  const { theme, toggleTheme } = useTheme();

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <header className="header">
      <div className="header-left">
        <div className="header-search">
          <Search size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search modules, lessons, topics..."
            id="global-search"
          />
        </div>
      </div>

      <div className="header-right">
        <div className="header-stat xp" title="Experience Points">
          <span className="stat-icon">⭐</span>
          <span>{state.xp.toLocaleString()} XP</span>
        </div>

        <div className="header-stat streak" title="Daily Streak">
          <span className="stat-icon">🔥</span>
          <span>{state.streak.current} days</span>
        </div>

        <button
          className="header-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          id="theme-toggle"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="header-btn" title="Notifications" id="notifications-btn">
          <Bell size={18} />
        </button>

        <div className="user-avatar" title={user?.name || 'User'} onClick={logout}>
          {initials}
        </div>
      </div>
    </header>
  );
}
