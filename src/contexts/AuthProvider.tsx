
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/types';

// This type represents the object coming from the login/signup forms.
interface LoginUserData {
  email: string;
  fullName: string;
  role: string;
  creaNumber?: string;
  creaValidated?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (userData: LoginUserData) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData: LoginUserData) => {
    const appUser: User = {
      id: userData.email, // Using email as id, as it's unique.
      name: userData.fullName,
      email: userData.email,
      role: userData.role as User['role'], // Assuming role from form matches allowed roles.
      creaNumber: userData.creaNumber,
      creaValidated: userData.creaValidated,
    };
    localStorage.setItem('user', JSON.stringify(appUser));
    setUser(appUser);
    navigate('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
