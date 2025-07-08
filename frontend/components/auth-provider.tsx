'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: { id: string; name: string; email: string; userType: string } | null;
  login: (email: string, password: string, userType: string) => Promise<void>;
  register: (formData: {
    name: string;
    email: string;
    password: string;
    userType: 'user' | 'company' | 'admin';
    companyName?: string;
    phone?: string;
    department?: string;
    adminCode?: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextType['user']>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUser({
          id: decoded.userId,
          name: decoded.name || 'User',
          email: decoded.email || '',
          userType: decoded.userType
        });
        console.log('Restored user from token:', decoded);
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
        setUser(null);
      }
    }
  }, []);

  const login = async (email: string, password: string, userType: string) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, userType })
      });
      const data = await response.json();
      console.log('Login response:', data);
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          userType: data.user.userType
        });
        console.log('Set user:', data.user);
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (formData: {
    name: string;
    email: string;
    password: string;
    userType: 'user' | 'company' | 'admin';
    companyName?: string;
    phone?: string;
    department?: string;
    adminCode?: string;
  }) => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      console.log('Register response:', data);
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
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