import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff, Cpu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { login, loginWithGoogle, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const GoogleIcon = () => (
    <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.59c-.28 1.5-.12 3.01-.97 4.29l3.41 2.64c2-1.84 3.16-4.56 3.16-7.78z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.41-2.64c-.95.64-2.17 1.01-3.55 1.01-2.73 0-5.04-1.84-5.87-4.31l-3.52 2.72C5.64 21.52 8.57 24 12 24z" />
      <path fill="#FBBC05" d="M6.13 15.15A7.17 7.17 0 0 1 5.7 12c0-1.1.2-2.15.57-3.15L2.75 6.13A11.94 11.94 0 0 0 0 12c0 2.27.64 4.38 1.75 6.18l4.38-3.03z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 8.57 0 5.64 2.48 4.63 5.82l3.52 2.72c.83-2.47 3.14-4.31 5.87-4.31z" />
    </svg>
  );

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Google Sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Background decoration */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background:
            'radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(6,182,212,0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(236,72,153,0.05) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />

      <div className="auth-card slide-up">
        {/* Logo */}
        <div className="auth-logo">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-2)',
              marginBottom: 'var(--space-2)',
            }}
          >
            <Cpu size={32} style={{ color: 'var(--accent-cyan)' }} />
            <h1>EmbedMaster</h1>
          </div>
          <p>Welcome back! Sign in to continue learning.</p>
        </div>

        {/* Error message */}
        {error && (
          <div
            className="fade-in"
            style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-3) var(--space-4)',
              marginBottom: 'var(--space-5)',
              color: 'var(--accent-red)',
              fontSize: 'var(--text-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
            }}
            role="alert"
          >
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={16}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  pointerEvents: 'none',
                }}
              />
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
                disabled={isLoading}
                style={{ paddingLeft: '40px', width: '100%' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={16}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  pointerEvents: 'none',
                }}
              />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={isLoading}
                style={{ paddingLeft: '40px', paddingRight: '40px', width: '100%' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={isLoading}
            style={{ width: '100%', marginTop: 'var(--space-2)' }}
          >
            {isLoading ? (
              <>
                <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                Signing in…
              </>
            ) : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </button>
        </form>

        <button
          type="button"
          className="btn btn-outline"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          style={{ width: '100%', marginTop: 'var(--space-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)', padding: 'var(--space-3)', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <div className="auth-divider">or</div>

        {/* Demo account hint */}
        <div
          style={{
            background: 'rgba(99, 102, 241, 0.06)',
            border: '1px solid rgba(99, 102, 241, 0.12)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-3) var(--space-4)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-tertiary)',
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          <strong style={{ color: 'var(--text-secondary)' }}>First time?</strong>{' '}
          Create a free account to start learning embedded systems.
        </div>

        {/* Footer link */}
        <div className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
}
