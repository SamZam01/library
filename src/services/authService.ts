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

/**
 * Cambia la contraseña del usuario actual
 */
export const changePassword = (
  currentPassword: string,
  newPassword: string
): { success: boolean; message: string } => {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    return { success: false, message: 'No hay sesión activa' };
  }

  const usersData = localStorage.getItem('lib_users');
  if (!usersData) {
    return { success: false, message: 'Error al acceder a los datos' };
  }

  const users: User[] = JSON.parse(usersData);
  const userIndex = users.findIndex(u => u.id === currentUser.id);

  if (userIndex === -1) {
    return { success: false, message: 'Usuario no encontrado' };
  }

  if (users[userIndex].password !== currentPassword) {
    return { success: false, message: 'Contraseña actual incorrecta' };
  }

  if (newPassword.length < 6) {
    return { success: false, message: 'La nueva contraseña debe tener al menos 6 caracteres' };
  }

  users[userIndex].password = newPassword;
  localStorage.setItem('lib_users', JSON.stringify(users));

  const updatedUser = { ...users[userIndex] };
  delete updatedUser.password;
  localStorage.setItem('lib_currentUser', JSON.stringify(updatedUser));

  return { success: true, message: 'Contraseña actualizada correctamente' };
};