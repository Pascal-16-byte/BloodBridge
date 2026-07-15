import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setUnauthorizedHandler } from '../config/axios';
import { getCurrentUserProfile, loginUser, registerUser } from '../services/authService';
import { clearAuthSession, getAuthToken, getStoredAuthUser, saveAuthSession, saveAuthUser } from '../utils/authStorage';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(
    ({ redirect = true } = {}) => {
      clearAuthSession();
      setCurrentUser(null);

      if (redirect) {
        navigate('/login', { replace: true });
      }
    },
    [navigate],
  );

  const loadCurrentUser = useCallback(async () => {
    const token = getAuthToken();

    if (!token) {
      setCurrentUser(null);
      setLoading(false);
      return null;
    }

    const storedUser = getStoredAuthUser();
    if (storedUser) {
      setCurrentUser(storedUser);
    }

    try {
      const profile = await getCurrentUserProfile();
      setCurrentUser(profile);
      saveAuthUser(profile);
      return profile;
    } catch {
      clearAuthSession();
      setCurrentUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => logout({ redirect: true }));
    loadCurrentUser();

    return () => setUnauthorizedHandler(null);
  }, [loadCurrentUser, logout]);

  const login = useCallback(async ({ email, password }) => {
    const loginResponse = await loginUser({ email, password });
    const token = loginResponse?.token;
    const user = loginResponse?.user;

    if (!token) {
      throw new Error('Login succeeded, but no token was returned by the backend.');
    }

    saveAuthSession(token, user || null);
    const profile = await getCurrentUserProfile();
    setCurrentUser(profile);
    saveAuthUser(profile);
    return profile;
  }, []);

  const register = useCallback(async (payload) => registerUser(payload), []);

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser && getAuthToken()),
      loading,
      loadCurrentUser,
      login,
      logout,
      register,
    }),
    [currentUser, loading, loadCurrentUser, login, logout, register],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
