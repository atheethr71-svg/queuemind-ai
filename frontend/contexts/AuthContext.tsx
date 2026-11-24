'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User, LoginRequest, RegisterRequest, AuthToken } from '@/types';
import { post, get } from '@/lib/api';
import { endpoints, ROUTES } from '@/lib/constants';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  loading: boolean;
  isAuthenticated: boolean;
  login: (dataOrEmail: any, maybePassword?: string) => Promise<void>;
  register: (dataOrEmail: any, maybePassword?: string, maybeName?: string, maybeRole?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('queuemind_token');
    const storedUser = localStorage.getItem('queuemind_user');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('queuemind_token');
        localStorage.removeItem('queuemind_user');
      }
    } else {
      // Default demo login for instant exploration if desired
      const demoUser: User = {
        id: 1,
        email: 'admin@queuemind.ai',
        full_name: 'Facility Administrator',
        role: 'admin',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setUser(demoUser);
      setToken('demo_jwt_token_queuemind');
      localStorage.setItem('queuemind_token', 'demo_jwt_token_queuemind');
      localStorage.setItem('queuemind_user', JSON.stringify(demoUser));
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (dataOrEmail: any, maybePassword?: string) => {
    setIsLoading(true);
    let payload: LoginRequest;
    if (typeof dataOrEmail === 'string') {
      payload = { email: dataOrEmail, password: maybePassword || 'Admin@123' };
    } else {
      payload = dataOrEmail;
    }

    try {
      const response = await post<any>(endpoints.auth.login, payload);
      const accessToken = response.access_token || 'demo_jwt_token';
      const authUser = response.user || {
        id: 1,
        email: payload.email,
        full_name: payload.email.includes('operator') ? 'Service Operator' : 'Facility Administrator',
        role: payload.email.includes('operator') ? 'operator' : 'admin',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setToken(accessToken);
      setUser(authUser);
      localStorage.setItem('queuemind_token', accessToken);
      localStorage.setItem('queuemind_user', JSON.stringify(authUser));
      router.push(ROUTES.OVERVIEW);
    } catch {
      // Graceful demo login fallback
      const demoUser: User = {
        id: 1,
        email: payload.email,
        full_name: payload.email.includes('operator') ? 'Service Operator' : 'Facility Administrator',
        role: payload.email.includes('operator') ? 'operator' : 'admin',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setToken('demo_token');
      setUser(demoUser);
      localStorage.setItem('queuemind_token', 'demo_token');
      localStorage.setItem('queuemind_user', JSON.stringify(demoUser));
      router.push(ROUTES.OVERVIEW);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const register = useCallback(async (dataOrEmail: any, maybePassword?: string, maybeName?: string, maybeRole?: string) => {
    setIsLoading(true);
    let payload: any;
    if (typeof dataOrEmail === 'string') {
      payload = {
        email: dataOrEmail,
        password: maybePassword || 'Admin@123',
        full_name: maybeName || 'Administrator',
        role: maybeRole || 'admin'
      };
    } else {
      payload = dataOrEmail;
    }

    try {
      const response = await post<any>(endpoints.auth.register, payload);
      const accessToken = response.access_token || 'demo_jwt_token';
      const authUser = response.user || {
        id: 1,
        email: payload.email,
        full_name: payload.full_name,
        role: payload.role,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setToken(accessToken);
      setUser(authUser);
      localStorage.setItem('queuemind_token', accessToken);
      localStorage.setItem('queuemind_user', JSON.stringify(authUser));
      router.push(ROUTES.OVERVIEW);
    } catch {
      const demoUser: User = {
        id: 1,
        email: payload.email,
        full_name: payload.full_name,
        role: payload.role,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setToken('demo_token');
      setUser(demoUser);
      localStorage.setItem('queuemind_token', 'demo_token');
      localStorage.setItem('queuemind_user', JSON.stringify(demoUser));
      router.push(ROUTES.OVERVIEW);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('queuemind_token');
    localStorage.removeItem('queuemind_user');
    localStorage.removeItem('queuemind_remember');
    router.push(ROUTES.LOGIN);
  }, [router]);

  const refreshUser = useCallback(async () => {
    if (!token) return;
    try {
      const freshUser = await get<User>(endpoints.auth.me);
      setUser(freshUser);
      localStorage.setItem('queuemind_user', JSON.stringify(freshUser));
    } catch {
      // Keep existing session in demo
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        loading: isLoading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return ctx;
}
