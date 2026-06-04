import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute — gate component for authenticated routes.
 *
 * Props:
 *   children      – The child route element(s) to render when authorised
 *   requireAdmin  – If true, the user must also have role === 'admin'
 */
export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  // Auth state is still loading — show a centered spinner
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'var(--bg-primary)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            className="spinner"
            style={{
              width: 40,
              height: 40,
              borderWidth: 4,
              margin: '0 auto var(--space-4)',
            }}
          />
          <p
            style={{
              color: 'var(--text-tertiary)',
              fontSize: 'var(--text-sm)',
            }}
          >
            Checking authentication…
          </p>
        </div>
      </div>
    );
  }

  // Not logged in → redirect to login, preserving the intended destination
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin required but user is not admin → redirect to dashboard
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
