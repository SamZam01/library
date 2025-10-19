import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types/user';
import { loginUser, registerUser, getCurrentUser, logoutUser, changePassword as changePasswordService } from '../services/authService';
import { AuthContext } from './AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    const user = await loginUser(username, password);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  };

  const register = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    const success = await registerUser(username, password);
    setIsLoading(false);
    return success;
  };

  const changePassword = (currentPassword: string, newPassword: string) => {
    return changePasswordService(currentPassword, newPassword);
  };

  const logout = () => {
    logoutUser();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, isLoading, login, register, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};
