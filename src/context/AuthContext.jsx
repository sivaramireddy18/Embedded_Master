import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const USERS_KEY = 'embedmaster-users';
const SESSION_KEY = 'embedmaster-session';

/**
 * Read the users array from localStorage.
 * Returns an empty array if nothing is stored or parsing fails.
 */
function getStoredUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const users = raw ? JSON.parse(raw) : [];
    
    // Ensure default admin user is present
    const hasAdmin = users.some(u => u.email === 'admin');
    if (!hasAdmin) {
      const adminUser = {
        id: 'admin_user',
        name: 'Administrator',
        email: 'admin',
        password: 'admin',
        role: 'admin',
        createdAt: new Date().toISOString()
      };
      users.push(adminUser);
      
      // Also add admin@embedmaster.com fallback for standard email logins
      if (!users.some(u => u.email === 'admin@embedmaster.com')) {
        users.push({
          id: 'admin_user_email',
          name: 'Administrator',
          email: 'admin@embedmaster.com',
          password: 'admin',
          role: 'admin',
          createdAt: new Date().toISOString()
        });
      }
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    return users;
  } catch {
    return [];
  }
}

/**
 * Read the current session (logged-in user) from localStorage.
 */
function getStoredSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Persist users array to localStorage.
 */
function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    console.error('Failed to save users to localStorage');
  }
}

/**
 * Persist session to localStorage.
 */
function saveSession(user) {
  try {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  } catch {
    console.error('Failed to save session to localStorage');
  }
}

/**
 * Determine role based on email.
 * Emails containing 'admin' are assigned the 'admin' role.
 */
function determineRole(email) {
  return email.toLowerCase().includes('admin') ? 'admin' : 'student';
}

/**
 * Generate a pseudo-unique ID for new users.
 */
function generateId() {
  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const session = getStoredSession();
    if (session) {
      setUser(session);
    }
    setLoading(false);
  }, []);

  /**
   * Log in with email and password.
   * Throws an error with a user-friendly message on failure.
   */
  const login = useCallback(async (email, password) => {
    if (!email?.trim() || !password) {
      throw new Error('Email and password are required.');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const users = getStoredUsers();

    const found = users.find(
      (u) => u.email === normalizedEmail && u.password === password
    );

    if (!found) {
      throw new Error('Invalid email or password.');
    }

    const sessionUser = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
    };

    setUser(sessionUser);
    saveSession(sessionUser);
    return sessionUser;
  }, []);

  /**
   * Register a new user.
   * Throws an error with a user-friendly message on failure.
   */
  const register = useCallback(async (name, email, password) => {
    if (!name?.trim()) {
      throw new Error('Name is required.');
    }
    if (!email?.trim()) {
      throw new Error('Email is required.');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();
    const users = getStoredUsers();

    // Check for duplicate email
    if (users.some((u) => u.email === normalizedEmail)) {
      throw new Error('An account with this email already exists.');
    }

    const role = determineRole(normalizedEmail);
    const newUser = {
      id: generateId(),
      name: trimmedName,
      email: normalizedEmail,
      password, // Stored as plain text for localStorage demo; Firebase will hash it
      role,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    // Auto-login after registration
    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };

    setUser(sessionUser);
    saveSession(sessionUser);
    return sessionUser;
  }, []);

  /**
   * Log the current user out.
   */
  const logout = useCallback(() => {
    setUser(null);
    saveSession(null);
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
