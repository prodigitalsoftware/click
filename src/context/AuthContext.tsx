import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authAPI } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isAuthenticated: boolean;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('navaseal_token'));
  const [loading, setLoading] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await authAPI.getMe();
        if (res.success && res.user) {
          setUser(res.user);
        } else {
          logout();
        }
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await authAPI.login({ email, password });
    if (res.success && res.token) {
      localStorage.setItem('navaseal_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setAuthModalOpen(false);
    } else {
      throw new Error(res.message || 'Login failed');
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    const res = await authAPI.register({ name, email, password, phone });
    if (res.success && res.token) {
      localStorage.setItem('navaseal_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setAuthModalOpen(false);
    } else {
      throw new Error(res.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('navaseal_token');
    setToken(null);
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAdmin,
        isAuthenticated,
        authModalOpen,
        setAuthModalOpen,
        authMode,
        setAuthMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

