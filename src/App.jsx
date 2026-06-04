import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './pages/user/Dashboard';
import ModulePage from './pages/user/ModulePage';
import LessonPage from './pages/user/LessonPage';
import Playground from './pages/user/Playground';
import Assessments from './pages/user/Assessments';
import Achievements from './pages/user/Achievements';
import AdminDashboard from './pages/admin/AdminDashboard';
import DebuggingAcademy from './pages/user/DebuggingAcademy';
import Projects from './pages/user/Projects';
import InterviewPrep from './pages/user/InterviewPrep';
import CareerRoadmap from './pages/user/CareerRoadmap';
import DailyPlan from './pages/user/DailyPlan';

// Placeholder pages for routes that aren't fully built yet
function ComingSoon({ title }) {
  return (
    <div className="slide-up" style={{ textAlign: 'center', padding: 'var(--space-20)' }}>
      <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>🚧</div>
      <h2>{title}</h2>
      <p style={{ marginTop: 'var(--space-2)', color: 'var(--text-tertiary)' }}>
        This section is coming in the next phase. Stay tuned!
      </p>
    </div>
  );
}

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" style={{ width: 48, height: 48 }} />
        <h2>EmbedMaster</h2>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
      } />
      <Route path="/register" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />
      } />

      {/* Protected Routes */}
      <Route element={
        <ProtectedRoute>
          <AppProvider>
            <Layout />
          </AppProvider>
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/module/:moduleId" element={<ModulePage />} />
        <Route path="/lesson/:moduleId/:lessonId" element={<LessonPage />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/assessments" element={<Assessments />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/debugging" element={<DebuggingAcademy />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/interview-prep" element={<InterviewPrep />} />
        <Route path="/career-roadmap" element={<CareerRoadmap />} />
        <Route path="/daily-plan" element={<DailyPlan />} />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute requireAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <HashRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </HashRouter>
  );
}
