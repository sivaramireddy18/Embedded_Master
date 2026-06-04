import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, Eye, EyeOff, Cpu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const { register, loginWithGoogle, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const GoogleIcon = () => (
    <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.59c-.28 1.5-.12 3.01-.97 4.29l3.41 2.64c2-1.84 3.16-4.56 3.16-7.78z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.41-2.64c-.95.64-2.17 1.01-3.55 1.01-2.73 0-5.04-1.84-5.87-4.31l-3.52 2.72C5.64 21.52 8.57 24 12 24z" />
      <path fill="#FBBC05" d="M6.13 15.15A7.17 7.17 0 0 1 5.7 12c0-1.1.2-2.15.57-3.15L2.75 6.13A11.94 11.94 0 0 0 0 12c0 2.27.64 4.38 1.75 6.18l4.38-3.03z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 8.57 0 5.64 2.48 4.63 5.82l3.52 2.72c.83-2.47 3.14-4.31 5.87-4.31z" />
    </svg>
  );

  const handleGoogleSignIn = async () => {
    setGeneralError('');
    setIsLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setGeneralError(err.message || 'Google Sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  /**
   * Validate all form fields.
   * Returns an errors object (empty if valid).
   */
  function validate() {
    const errs = {};

    if (!name.trim()) {
      errs.name = 'Name is required.';
    } else if (name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters.';
    }

    if (!email.trim()) {
      errs.email = 'Email is required.';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    return errs;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length > 0) return;

    setIsLoading(true);

    try {
      await register(name.trim(), email.trim(), password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setGeneralError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Render a form field with icon, label, error state.
   */
  function renderField({
    id,
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    icon: Icon,
    errorKey,
    autoComplete,
    autoFocus = false,
    isPassword = false,
  }) {
    return (
      <div className="form-group">
        <label className="form-label" htmlFor={id}>
          {label}
        </label>
        <div style={{ position: 'relative' }}>
          <Icon
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
            id={id}
            type={isPassword ? (showPassword ? 'text' : 'password') : type}
            className="form-input"
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              // Clear field error on change
              if (errors[errorKey]) {
                setErrors((prev) => {
                  const copy = { ...prev };
                  delete copy[errorKey];
                  return copy;
                });
              }
            }}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            disabled={isLoading}
            aria-invalid={!!errors[errorKey]}
            aria-describedby={errors[errorKey] ? `${id}-error` : undefined}
            style={{
              paddingLeft: '40px',
              paddingRight: isPassword ? '40px' : undefined,
              width: '100%',
              borderColor: errors[errorKey]
                ? 'var(--accent-red)'
                : undefined,
            }}
          />
          {isPassword && (
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
          )}
        </div>
        {errors[errorKey] && (
          <span id={`${id}-error`} className="form-error" role="alert">
            {errors[errorKey]}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="auth-page">
      {/* Background decoration */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background:
            'radial-gradient(ellipse at 80% 50%, rgba(99,102,241,0.08) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(6,182,212,0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 20%, rgba(236,72,153,0.05) 0%, transparent 50%)',
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
          <p>Create your account and start mastering embedded systems.</p>
        </div>

        {/* General error */}
        {generalError && (
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
            <span>{generalError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          {renderField({
            id: 'register-name',
            label: 'Full Name',
            placeholder: 'John Doe',
            value: name,
            onChange: setName,
            icon: User,
            errorKey: 'name',
            autoComplete: 'name',
            autoFocus: true,
          })}

          {renderField({
            id: 'register-email',
            label: 'Email Address',
            type: 'email',
            placeholder: 'you@example.com',
            value: email,
            onChange: setEmail,
            icon: Mail,
            errorKey: 'email',
            autoComplete: 'email',
          })}

          {renderField({
            id: 'register-password',
            label: 'Password',
            placeholder: 'At least 6 characters',
            value: password,
            onChange: setPassword,
            icon: Lock,
            errorKey: 'password',
            autoComplete: 'new-password',
            isPassword: true,
          })}

          {renderField({
            id: 'register-confirm',
            label: 'Confirm Password',
            placeholder: 'Re-enter your password',
            value: confirmPassword,
            onChange: setConfirmPassword,
            icon: Lock,
            errorKey: 'confirmPassword',
            autoComplete: 'new-password',
            isPassword: true,
          })}

          {/* Password strength hint */}
          {password.length > 0 && (
            <div
              style={{
                display: 'flex',
                gap: 'var(--space-1)',
                marginBottom: 'var(--space-4)',
                marginTop: 'calc(-1 * var(--space-3))',
              }}
            >
              {[1, 2, 3, 4].map((i) => {
                let color = 'var(--border-default)';
                if (password.length >= 6 && i <= 1) color = 'var(--accent-red)';
                if (password.length >= 8 && i <= 2) color = 'var(--accent-amber)';
                if (password.length >= 10 && i <= 3) color = 'var(--accent-amber)';
                if (password.length >= 12 && i <= 4) color = 'var(--accent-green)';
                return (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: '3px',
                      borderRadius: 'var(--radius-full)',
                      background: color,
                      transition: 'background var(--transition-fast)',
                    }}
                  />
                );
              })}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={isLoading}
            style={{ width: '100%', marginTop: 'var(--space-2)' }}
          >
            {isLoading ? (
              <>
                <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                Creating account…
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Create Account
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

        <div className="auth-divider" style={{ margin: 'var(--space-4) 0' }}>or</div>

        {/* Footer link */}
        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
