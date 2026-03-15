'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext({
  user: null,
  loading: true,
  showAuthModal: false,
  setShowAuthModal: () => {},
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('loading'); // 'loading' | 'authenticated' | 'unauthenticated'
  const [showAuthModal, setShowAuthModal] = useState(false);

  const refreshUser = useCallback(async () => {
    try {
      setLoading(true);
      setStatus('loading');
      const res = await fetch('/api/customers/me');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        setStatus('authenticated');
      } else {
        setUser(null);
        setStatus('unauthenticated');
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
      setUser(null);
      setStatus('unauthenticated');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async ({ email, password }) => {
    try {
      setLoading(true);
      const res = await fetch('/api/customers/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setStatus('authenticated');
        setShowAuthModal(false);
        return { success: true };
      } else {
        return { success: false, message: data.errors?.[0]?.message || 'Đăng nhập thất bại' };
      }
    } catch (err) {
      return { success: false, message: 'Lỗi kết nối' };
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ email, password, fullName, phone }) => {
    try {
      setLoading(true);
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName, phone }),
      });

      const data = await res.json();
      if (res.ok) {
        // Auto login after register
        return await login({ email, password });
      } else {
        return { success: false, message: data.errors?.[0]?.message || 'Đăng ký thất bại' };
      }
    } catch (err) {
      return { success: false, message: 'Lỗi kết nối' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await fetch('/api/customers/logout', { method: 'POST' });
      setUser(null);
      setStatus('unauthenticated');
      window.location.href = '/';
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        status,
        showAuthModal,
        setShowAuthModal,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
