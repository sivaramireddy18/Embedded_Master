import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Code2, Trophy, GraduationCap,
  Cpu, Network, Shield, Terminal, Briefcase, ChevronLeft,
  ChevronRight, Zap, Target, Bug, Calendar, Award, Settings,
  Users, BarChart3
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navSections = [
  {
    title: 'Overview',
    items: [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/playground', icon: Code2, label: 'Code Playground' },
      { path: '/achievements', icon: Trophy, label: 'Achievements' },
    ]
  },
  {
    title: 'C Programming',
    items: [
      { path: '/module/module-01', icon: Cpu, label: 'Computer Fundamentals', badge: 'M1' },
      { path: '/module/module-02', icon: BookOpen, label: 'Introduction to C', badge: 'M2' },
      { path: '/module/module-03', icon: BookOpen, label: 'Variables & Data Types', badge: 'M3' },
      { path: '/module/module-04', icon: BookOpen, label: 'Operators', badge: 'M4' },
      { path: '/module/module-05', icon: BookOpen, label: 'Control Statements', badge: 'M5' },
    ]
  },
  {
    title: 'Practice & Assess',
    items: [
      { path: '/assessments', icon: Target, label: 'Assessments' },
      { path: '/debugging', icon: Bug, label: 'Debugging Academy' },
      { path: '/projects', icon: Zap, label: 'Projects' },
    ]
  },
  {
    title: 'Career',
    items: [
      { path: '/interview-prep', icon: GraduationCap, label: 'Interview Prep' },
      { path: '/career-roadmap', icon: Briefcase, label: 'Career Roadmap' },
      { path: '/daily-plan', icon: Calendar, label: 'Daily Plan' },
    ]
  },
];

const adminSection = {
  title: 'Admin',
  items: [
    { path: '/admin', icon: BarChart3, label: 'Admin Dashboard' },
    { path: '/admin/users', icon: Users, label: 'User Management' },
  ]
};

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const allSections = isAdmin ? [...navSections, adminSection] : navSections;

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-logo">
        <span className="logo-icon">⚡</span>
        <h1>EmbedMaster</h1>
      </div>

      <nav className="sidebar-nav">
        {allSections.map((section) => (
          <div key={section.title} className="nav-section">
            <div className="nav-section-title">{section.title}</div>
            {section.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''}`
                }
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="nav-icon" size={20} />
                <span className="nav-label">{item.label}</span>
                {item.badge && !collapsed && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span className="sidebar-footer-text">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
