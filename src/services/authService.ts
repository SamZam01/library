import type { User } from '../types/user';
import { setAuthToken, removeAuthToken, getAuthToken } from './authTokenService';


const USERS_KEY = 'lib_users';
const CURRENT_USER_KEY = 'lib_user';

/**
 * Obtiene todos los usuarios registrados de LocalStorage.
 * @returns Array de usuarios.
 */
const getAllUsers = (): User[] => {
  const usersJson = localStorage.getItem(USERS_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
};

/**
 * Guarda la lista de usuarios en LocalStorage.
 * @param users Array de usuarios.
 */
const saveAllUsers = (users: User[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

/**
 * Intenta registrar un nuevo usuario.
 * @param username Nombre de usuario.
 * @param password Contraseña.
 * @returns true si el registro fue exitoso, false si el usuario ya existe.
 */
export const registerUser = async (username: string, password: string): Promise<boolean> => {
  const users = getAllUsers();
  if (users.some(user => user.username === username)) {
    return false; 
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    username,
    password,
  };
  users.push(newUser);
  saveAllUsers(users);
  return true;
};

/**
 * Intenta iniciar sesión con un usuario.
 * @param username Nombre de usuario.
 * @param password Contraseña.
 * @returns El objeto User si el login es exitoso, null si falla.
 */
export const loginUser = async (username: string, password: string): Promise<User | null> => {
  const users = getAllUsers();
  const foundUser = users.find(user => user.username === username && user.password === password);

  if (foundUser) {
    const token = btoa(`${username}:${password}`);
    setAuthToken(token);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(foundUser));
    return foundUser;
  }
  return null;
};

/**
 * Obtiene el usuario actualmente logueado de LocalStorage.
 * @returns El objeto User si hay un usuario logueado, null en caso contrario.
 */
export const getCurrentUser = (): User | null => {
  const token = getAuthToken();
  if (!token) return null;
  const userJson = localStorage.getItem(CURRENT_USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

/**
 * Cierra la sesión del usuario actual.
 */
export const logoutUser = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY);
  removeAuthToken();
};
