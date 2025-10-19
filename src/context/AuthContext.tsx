import { createContext } from 'react';
import type { User } from '../types/user';

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => { success: boolean; message: string };
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
