import { getItem, removeItem, setItem } from './localStorageService'; // ✅ Agregado setItem

const TOKEN_KEY = 'lib_auth_token';

/**
 * Obtiene el token de autenticación de localStorage.
 * @returns El token o null si no hay.
 */
export const getAuthToken = (): string | null => {
  return getItem<string>(TOKEN_KEY);
};

/**
 * Guarda un token en localStorage.
 * @param token El token a guardar.
 */
export const setAuthToken = (token: string): void => {
  setItem(TOKEN_KEY, token);
};

/**
 * Remueve el token de localStorage (para logout).
 */
export const removeAuthToken = (): void => {
  removeItem(TOKEN_KEY);
};

/**
 * Obtiene headers de autorización para requests a "backend" simulado.
 * @returns Objeto con Authorization header.
 */
export const getAuthHeaders = (): { Authorization?: string } => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
