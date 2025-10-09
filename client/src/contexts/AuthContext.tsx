import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axiosInstance from '../api/config';
import * as authApi from '../api/auth';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  checkTokenValidity: () => boolean;
  isTokenExpired: (token: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      verifyToken();
    } else {
      setLoading(false);
    }

    // Listen for token expiration events
    const handleTokenExpiration = () => {
      console.log('Token expired, logging out user');
      logout();
    };

    window.addEventListener('tokenExpired', handleTokenExpiration);
    
    return () => {
      window.removeEventListener('tokenExpired', handleTokenExpiration);
    };
  }, []);

  const verifyToken = async () => {
    try {
      const { user } = await authApi.me();
      setUser(user);
    } catch (error: any) {
      console.log('Token verification failed:', error.response?.status, error.message);
      // Clear token and authorization header
      localStorage.removeItem('token');
      delete axiosInstance.defaults.headers.common['Authorization'];
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { token, user } = await authApi.login(email, password);
      setUser(user);
      localStorage.setItem('token', token);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const { token, user } = await authApi.register(username, email, password);
      setUser(user);
      localStorage.setItem('token', token);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    delete axiosInstance.defaults.headers.common['Authorization'];
  };

  const isTokenExpired = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true; // If we can't parse the token, consider it expired
    }
  };

  const checkTokenValidity = () => {
    const token = localStorage.getItem('token');
    if (token && isTokenExpired(token)) {
      console.log('Token is expired, logging out');
      logout();
      return false;
    }
    return !!token;
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    checkTokenValidity,
    isTokenExpired
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
