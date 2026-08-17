import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getStoredToken, getStoredUser, setStoredToken, setStoredUser, removeStoredToken, removeStoredUser } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [token, setToken] = useState(getStoredToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('taskflow_unauthorized', handleUnauthorized);

    const initAuth = async () => {
      const storedToken = getStoredToken();
      if (storedToken) {
        try {
          const res = await api.getProfile();
          if (res.success && res.user) {
            setUser(res.user);
            setStoredUser(res.user);
          }
        } catch (e) {
          removeStoredToken();
          removeStoredUser();
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();

    return () => {
      window.removeEventListener('taskflow_unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    if (res.success) {
      setStoredToken(res.token);
      setStoredUser(res.user);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.message || 'Login failed');
  };

  const demoLogin = async () => {
    return login('demo@taskflow.dev', 'password123');
  };

  const register = async (name, email, password) => {
    const res = await api.register(name, email, password);
    if (res.success) {
      setStoredToken(res.token);
      setStoredUser(res.user);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    removeStoredToken();
    removeStoredUser();
    setUser(null);
    setToken(null);
  };

  const updateProfile = async (name) => {
    const res = await api.updateProfile(name);
    if (res.success) {
      const updated = { ...user, name: res.user.name };
      setUser(updated);
      setStoredUser(updated);
      return updated;
    }
    throw new Error(res.message || 'Update failed');
  };

  const changePassword = async (currPass, newPass) => {
    const res = await api.changePassword(currPass, newPass);
    if (!res.success) {
      throw new Error(res.message || 'Failed to update password');
    }
    return res;
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    demoLogin,
    register,
    logout,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
